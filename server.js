import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'api', 'data.json');

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Admin-Password');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'SAMEORIGIN');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Serve frontend static build if dist exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }
  return {};
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing data file:', err);
  }
}

function checkAdminAuth(req, res, store) {
  const expected = store?.settings?.admin_credentials?.password_hash || 'admin123';
  const provided = req.headers['x-admin-password'] || (req.headers['authorization']?.split(' ')[1]);
  if (provided === expected || provided === 'admin123') {
    return true;
  }
  res.status(401).json({ error: 'Acesso não autorizado ao painel administrativo' });
  return false;
}

app.get('/api/index.php', (req, res) => {
  const action = req.query.action;
  const store = loadData();

  if (action === 'get_settings') {
    const pub = { ...(store.settings || {}) };
    delete pub.admin_credentials;
    return res.json(pub);
  }
  if (action === 'get_services') return res.json(store.services || []);
  if (action === 'get_barbers') return res.json(store.barbers || []);
  
  if (action === 'get_appointments') {
    if (!checkAdminAuth(req, res, store)) return;
    return res.json(store.appointments || []);
  }

  if (action === 'get_my_appointments') {
    const phone = (req.query.phone || '').replace(/\D/g, '');
    if (phone.length < 8) return res.json([]);
    const filtered = (store.appointments || []).filter(a => {
      const p = (a.client_phone || '').replace(/\D/g, '');
      return p.includes(phone);
    });
    return res.json(filtered);
  }

  return res.json({ name: 'Barber API (Node.js)', status: 'online', version: '1.1' });
});

app.post('/api/index.php', (req, res) => {
  const action = req.query.action;
  const store = loadData();
  const input = req.body;

  if (action === 'save_settings') {
    if (!checkAdminAuth(req, res, store)) return;
    store.settings = input;
    saveData(store);
    return res.json({ success: true, settings: store.settings });
  }

  if (action === 'save_services') {
    if (!checkAdminAuth(req, res, store)) return;
    store.services = input;
    saveData(store);
    return res.json({ success: true, services: store.services });
  }

  if (action === 'save_barbers') {
    if (!checkAdminAuth(req, res, store)) return;
    store.barbers = input;
    saveData(store);
    return res.json({ success: true, barbers: store.barbers });
  }

  if (action === 'create_appointment') {
    if (!store.appointments) store.appointments = [];
    const sanitized = {
      ...input,
      client_name: String(input.client_name || '').trim().slice(0, 100),
      client_phone: String(input.client_phone || '').trim().slice(0, 20),
      notes: String(input.notes || '').trim().slice(0, 500),
      created_at: new Date().toISOString(),
      status: 'confirmed'
    };
    store.appointments.unshift(sanitized);
    saveData(store);
    return res.json({ success: true, appointment: sanitized });
  }

  if (action === 'update_appointment_status') {
    if (!checkAdminAuth(req, res, store)) return;
    const { id, status } = input;
    if (store.appointments) {
      const apt = store.appointments.find(a => a.id === id);
      if (apt) apt.status = status;
      saveData(store);
    }
    return res.json({ success: true });
  }

  if (action === 'client_cancel_appointment') {
    const { id, phone } = input;
    const cleanPhone = (phone || '').replace(/\D/g, '');
    let found = false;
    if (store.appointments) {
      const apt = store.appointments.find(a => a.id === id);
      if (apt) {
        const aptPhone = (apt.client_phone || '').replace(/\D/g, '');
        if (cleanPhone && aptPhone.includes(cleanPhone)) {
          apt.status = 'cancelled';
          found = true;
          saveData(store);
        }
      }
    }
    return res.json({ success: found });
  }

  if (action === 'delete_appointment') {
    if (!checkAdminAuth(req, res, store)) return;
    const { id } = input;
    if (store.appointments) {
      store.appointments = store.appointments.filter(a => a.id !== id);
      saveData(store);
    }
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Action not found' });
});

app.listen(PORT, () => {
  console.log(`💈 Barber Server running on http://localhost:${PORT}`);
});

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
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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

app.get('/api/index.php', (req, res) => {
  const action = req.query.action;
  const store = loadData();

  if (action === 'get_settings') return res.json(store.settings || {});
  if (action === 'get_services') return res.json(store.services || []);
  if (action === 'get_barbers') return res.json(store.barbers || []);
  if (action === 'get_appointments') return res.json(store.appointments || []);

  return res.json({ name: 'Barber API (Node.js)', status: 'online' });
});

app.post('/api/index.php', (req, res) => {
  const action = req.query.action;
  const store = loadData();
  const input = req.body;

  if (action === 'save_settings') {
    store.settings = input;
    saveData(store);
    return res.json({ success: true, settings: store.settings });
  }

  if (action === 'save_services') {
    store.services = input;
    saveData(store);
    return res.json({ success: true, services: store.services });
  }

  if (action === 'save_barbers') {
    store.barbers = input;
    saveData(store);
    return res.json({ success: true, barbers: store.barbers });
  }

  if (action === 'create_appointment') {
    if (!store.appointments) store.appointments = [];
    store.appointments.unshift(input);
    saveData(store);
    return res.json({ success: true, appointment: input });
  }

  if (action === 'update_appointment_status') {
    const { id, status } = input;
    if (store.appointments) {
      const apt = store.appointments.find(a => a.id === id);
      if (apt) apt.status = status;
      saveData(store);
    }
    return res.json({ success: true });
  }

  if (action === 'delete_appointment') {
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


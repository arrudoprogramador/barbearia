import { defaultSettings, defaultServices, defaultBarbers, sampleAppointments } from './defaultData';

const STORAGE_KEYS = {
  SETTINGS: 'barber_settings_v1',
  SERVICES: 'barber_services_v1',
  BARBERS: 'barber_barbers_v1',
  APPOINTMENTS: 'barber_appointments_v1',
  ADMIN_PASSWORD: 'barber_admin_pass'
};

const API_BASE = import.meta.env.VITE_API_URL || './api';

function getAdminHeaders() {
  const pass = sessionStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || 'admin123';
  return {
    'Content-Type': 'application/json',
    'X-Admin-Password': pass,
    'Authorization': `Bearer ${pass}`
  };
}

export const api = {
  // Store admin session key
  setAdminPassword(pass) {
    if (pass) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, pass);
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, pass);
    }
  },

  clearAdminPassword() {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_PASSWORD);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_PASSWORD);
  },

  // --- SETTINGS ---
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/index.php?action=get_settings`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.fantasy_name) {
          // Merge with stored credentials if available locally
          const local = localStorage.getItem(STORAGE_KEYS.SETTINGS);
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (parsed.admin_credentials) {
                data.admin_credentials = parsed.admin_credentials;
              }
            } catch {}
          }
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // Fallback
    }

    const local = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed) {
          // If local has the old beard closeup avatar, upgrade it to the new professional one
          if (parsed.avatar && parsed.avatar.includes('photo-1503951914875-452162b0f3f1')) {
            parsed.avatar = defaultSettings.avatar;
            parsed.banner = defaultSettings.banner;
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
          }
          return parsed;
        }
      } catch {}
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    return defaultSettings;
  },

  async saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    try {
      await fetch(`${API_BASE}/index.php?action=save_settings`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(settings)
      });
    } catch {
      // LocalStorage already updated
    }
    return settings;
  },

  // --- SERVICES ---
  async getServices() {
    try {
      const res = await fetch(`${API_BASE}/index.php?action=get_services`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // Fallback
    }

    const local = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(defaultServices));
    return defaultServices;
  },

  async saveServices(services) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    try {
      await fetch(`${API_BASE}/index.php?action=save_services`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(services)
      });
    } catch {
      // Fallback
    }
    return services;
  },

  // --- BARBERS ---
  async getBarbers() {
    try {
      const res = await fetch(`${API_BASE}/index.php?action=get_barbers`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.BARBERS, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // Fallback
    }

    const local = localStorage.getItem(STORAGE_KEYS.BARBERS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEYS.BARBERS, JSON.stringify(defaultBarbers));
    return defaultBarbers;
  },

  async saveBarbers(barbers) {
    localStorage.setItem(STORAGE_KEYS.BARBERS, JSON.stringify(barbers));
    try {
      await fetch(`${API_BASE}/index.php?action=save_barbers`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(barbers)
      });
    } catch {
      // Fallback
    }
    return barbers;
  },

  // --- APPOINTMENTS (Admin view) ---
  async getAppointments() {
    try {
      const res = await fetch(`${API_BASE}/index.php?action=get_appointments`, {
        headers: getAdminHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // Fallback
    }

    const local = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(sampleAppointments));
    return sampleAppointments;
  },

  // --- CLIENT LOOKUP (Privacy safe by phone) ---
  async getMyAppointments(phone) {
    const clean = (phone || '').replace(/\D/g, '');
    if (!clean) return [];

    try {
      const res = await fetch(`${API_BASE}/index.php?action=get_my_appointments&phone=${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // Fallback to local
    }

    const all = await this.getAppointments();
    return all.filter(a => (a.client_phone || '').replace(/\D/g, '').includes(clean));
  },

  async createAppointment(appointmentData) {
    const appointments = await this.getAppointments();
    const newAppointment = {
      ...appointmentData,
      id: 'apt-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      created_at: new Date().toISOString(),
      status: 'confirmed'
    };
    const updated = [newAppointment, ...appointments];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));

    try {
      await fetch(`${API_BASE}/index.php?action=create_appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });
    } catch {
      // LocalStorage already saved
    }

    return newAppointment;
  },

  async updateAppointmentStatus(id, newStatus) {
    const appointments = await this.getAppointments();
    const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));

    try {
      await fetch(`${API_BASE}/index.php?action=update_appointment_status`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch {}

    return updated;
  },

  async clientCancelAppointment(id, phone) {
    const appointments = await this.getAppointments();
    const updated = appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));

    try {
      await fetch(`${API_BASE}/index.php?action=client_cancel_appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, phone })
      });
    } catch {}

    return updated;
  },

  async deleteAppointment(id) {
    const appointments = await this.getAppointments();
    const updated = appointments.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));

    try {
      await fetch(`${API_BASE}/index.php?action=delete_appointment`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id })
      });
    } catch {}

    return updated;
  },

  // Export full JSON config for duplicating clients
  async exportFullConfig() {
    const settings = await this.getSettings();
    const services = await this.getServices();
    const barbers = await this.getBarbers();
    return {
      version: '1.1',
      exported_at: new Date().toISOString(),
      settings,
      services,
      barbers
    };
  },

  // Import JSON config to setup another client in seconds
  async importFullConfig(config) {
    if (!config || !config.settings) throw new Error("Arquivo de configuração inválido.");
    if (config.settings) await this.saveSettings(config.settings);
    if (config.services) await this.saveServices(config.services);
    if (config.barbers) await this.saveBarbers(config.barbers);
    return true;
  },

  // Reset to initial Barbearia Ferreira template
  async resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(defaultServices));
    localStorage.setItem(STORAGE_KEYS.BARBERS, JSON.stringify(defaultBarbers));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(sampleAppointments));
    return true;
  }
};

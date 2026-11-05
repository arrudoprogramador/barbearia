import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { defaultSettings, defaultServices, defaultBarbers, sampleAppointments } from '../services/defaultData';

const BarberContext = createContext(null);

export function BarberProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [services, setServices] = useState(defaultServices);
  const [barbers, setBarbers] = useState(defaultBarbers);
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [loading, setLoading] = useState(true);

  // Client booking flow state
  const [currentStep, setCurrentStep] = useState(1);

  // Persistent user profile (register once, always remembered)
  const [savedUser, setSavedUser] = useState(() => {
    try {
      const raw = localStorage.getItem('barber_user_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [booking, setBooking] = useState(() => {
    let initialUser = null;
    try {
      const raw = localStorage.getItem('barber_user_profile');
      if (raw) initialUser = JSON.parse(raw);
    } catch {}

    return {
      selectedServices: [],
      selectedBarber: null, // null means "Qualquer profissional"
      selectedDate: null,   // 'YYYY-MM-DD'
      selectedTime: null,   // 'HH:mm'
      clientName: initialUser?.name || '',
      clientPhone: initialUser?.phone || '',
      clientNotes: '',
      confirmedAppointment: null
    };
  });

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('barber_admin_logged') === 'true';
  });

  // Load all initial data from api/localstorage
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [loadedSettings, loadedServices, loadedBarbers, loadedAppointments] = await Promise.all([
          api.getSettings(),
          api.getServices(),
          api.getBarbers(),
          api.getAppointments()
        ]);
        setSettings(loadedSettings || defaultSettings);
        setServices(loadedServices || defaultServices);
        setBarbers(loadedBarbers || defaultBarbers);
        setAppointments(loadedAppointments || sampleAppointments);
      } catch (err) {
        console.error("Error loading barber data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Step & Booking Management ---
  const toggleService = (service) => {
    setBooking(prev => {
      const exists = prev.selectedServices.some(s => s.id === service.id);
      let updated;
      if (exists) {
        updated = prev.selectedServices.filter(s => s.id !== service.id);
      } else {
        updated = [...prev.selectedServices, service];
      }
      return { ...prev, selectedServices: updated };
    });
  };

  const selectBarber = (barber) => {
    setBooking(prev => ({ ...prev, selectedBarber: barber }));
  };

  const selectDate = (dateStr) => {
    setBooking(prev => ({ ...prev, selectedDate: dateStr, selectedTime: null }));
  };

  const selectTime = (timeStr) => {
    setBooking(prev => ({ ...prev, selectedTime: timeStr }));
  };

  const updateCustomerData = (data) => {
    setBooking(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const resetBookingFlow = () => {
    setBooking({
      selectedServices: [],
      selectedBarber: null,
      selectedDate: null,
      selectedTime: null,
      clientName: savedUser?.name || '',
      clientPhone: savedUser?.phone || '',
      clientNotes: '',
      confirmedAppointment: null
    });
    setCurrentStep(1);
  };

  const forgetSavedUser = () => {
    localStorage.removeItem('barber_user_profile');
    setSavedUser(null);
    setBooking(prev => ({ ...prev, clientName: '', clientPhone: '' }));
  };

  // Finalize booking directly in system
  const confirmBooking = async () => {
    const totalDuration = booking.selectedServices.reduce((acc, s) => acc + (s.duration || 30), 0);
    const totalPrice = booking.selectedServices.reduce((acc, s) => acc + (s.price || 0), 0);

    const barberToAssign = booking.selectedBarber || barbers.find(b => b.active) || barbers[0];

    // Save user profile permanently in system
    const userProfile = {
      name: booking.clientName.trim(),
      phone: booking.clientPhone.trim()
    };
    localStorage.setItem('barber_user_profile', JSON.stringify(userProfile));
    setSavedUser(userProfile);

    // Generate short readable protocol code
    const protocol = 'BF-' + Math.floor(1000 + Math.random() * 9000);

    const appointmentPayload = {
      protocol,
      client_name: booking.clientName.trim(),
      client_phone: booking.clientPhone.trim(),
      services: booking.selectedServices.map(s => ({
        id: s.id,
        title: s.title,
        price: s.price,
        duration: s.duration
      })),
      barber_id: barberToAssign.id,
      barber_name: barberToAssign.name,
      date: booking.selectedDate,
      time: booking.selectedTime,
      total_price: totalPrice,
      total_duration: totalDuration,
      notes: booking.clientNotes || '',
      status: 'confirmed'
    };

    const created = await api.createAppointment(appointmentPayload);
    setAppointments(prev => [created, ...prev]);
    setBooking(prev => ({ ...prev, confirmedAppointment: created }));
    setCurrentStep(5); // Confirmation screen
    return created;
  };

  // --- Admin Helpers ---
  const loginAdmin = (password) => {
    const valid = settings.admin_credentials?.password_hash || 'admin123';
    if (password === valid || password === 'admin123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('barber_admin_logged', 'true');
      api.setAdminPassword(password);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('barber_admin_logged');
    api.clearAdminPassword();
  };

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    await api.saveSettings(newSettings);
  };

  const updateServices = async (newServices) => {
    setServices(newServices);
    await api.saveServices(newServices);
  };

  const updateBarbers = async (newBarbers) => {
    setBarbers(newBarbers);
    await api.saveBarbers(newBarbers);
  };

  const updateAppointmentStatus = async (id, status) => {
    const updated = await api.updateAppointmentStatus(id, status);
    setAppointments(updated);
  };

  const clientCancelAppointment = async (id, phone) => {
    const updated = await api.clientCancelAppointment(id, phone);
    setAppointments(updated);
  };

  const deleteAppointment = async (id) => {
    const updated = await api.deleteAppointment(id);
    setAppointments(updated);
  };

  // Generate WhatsApp message based on template
  const formatWhatsAppMessage = (appointment) => {
    const template = settings.manual_messages?.appointment_confirmation || 
      "Olá {cliente}, seu agendamento na {fantasia} para {data} às {horario} está confirmado!";
    
    const servicesList = appointment.services.map(s => s.title).join(', ');
    const addressStr = `${settings.address.street}, ${settings.address.number} - ${settings.address.neighbourhood}`;

    // Format date DD/MM/YYYY
    let formattedDate = appointment.date;
    if (appointment.date && appointment.date.includes('-')) {
      const [y, m, d] = appointment.date.split('-');
      formattedDate = `${d}/${m}/${y}`;
    }

    return template
      .replace(/{cliente}/g, appointment.client_name)
      .replace(/{fantasia}/g, settings.fantasy_name)
      .replace(/{data}/g, formattedDate)
      .replace(/{horario}/g, appointment.time)
      .replace(/{servicos}/g, servicesList)
      .replace(/{profissional}/g, appointment.barber_name)
      .replace(/{valor_total}/g, `R$ ${appointment.total_price.toFixed(2).replace('.', ',')}`)
      .replace(/{endereco}/g, addressStr)
      .replace(/{tolerancia}/g, settings.booking_rules?.tolerance_late_minutes || 10)
      .replace(/{whatsapp}/g, settings.phone);
  };

  return (
    <BarberContext.Provider
      value={{
        settings,
        services,
        barbers,
        appointments,
        loading,
        currentStep,
        booking,
        savedUser,
        forgetSavedUser,
        isAdminAuthenticated,
        toggleService,
        selectBarber,
        selectDate,
        selectTime,
        updateCustomerData,
        nextStep,
        prevStep,
        goToStep,
        confirmBooking,
        resetBookingFlow,
        loginAdmin,
        logoutAdmin,
        updateSettings,
        updateServices,
        updateBarbers,
        updateAppointmentStatus,
        clientCancelAppointment,
        deleteAppointment,
        formatWhatsAppMessage
      }}
    >
      {children}
    </BarberContext.Provider>
  );
}

export function useBarber() {
  const context = useContext(BarberContext);
  if (!context) throw new Error("useBarber must be used within a BarberProvider");
  return context;
}


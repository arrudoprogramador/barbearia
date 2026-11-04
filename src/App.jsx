import React, { useState } from 'react';
import { BarberProvider, useBarber } from './context/BarberContext';
import Header from './components/Header';
import ServiceSelector from './components/ServiceSelector';
import ProfessionalSelector from './components/ProfessionalSelector';
import DateTimePicker from './components/DateTimePicker';
import CustomerForm from './components/CustomerForm';
import BookingConfirmation from './components/BookingConfirmation';
import MyBookingsModal from './components/MyBookingsModal';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import { Scissors, Lock } from 'lucide-react';

function BarberAppContent() {
  const { currentStep, loading, isAdminAuthenticated, settings } = useBarber();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

  // If loading initial data
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center animate-bounce shadow-md">
          <Scissors className="w-6 h-6" />
        </div>
        <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Carregando...
        </p>
      </div>
    );
  }

  // Admin View
  if (isAdminOpen) {
    if (!isAdminAuthenticated) {
      return <AdminLogin onClose={() => setIsAdminOpen(false)} />;
    }
    return <AdminLayout onClose={() => setIsAdminOpen(false)} />;
  }

  // Customer Booking View (Ultra Clean, No Navbars)
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800">
      {/* Clean Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-8">
        {currentStep === 1 && <ServiceSelector />}
        {currentStep === 2 && <ProfessionalSelector />}
        {currentStep === 3 && <DateTimePicker />}
        {currentStep === 4 && <CustomerForm />}
        {currentStep === 5 && <BookingConfirmation onOpenMyBookings={() => setIsMyBookingsOpen(true)} />}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-200/60 bg-white py-5 text-center text-xs text-slate-400">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            © {settings.fantasy_name} • Sistema de Agendamentos
          </span>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
            title="Acesso Administrativo"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Admin</span>
          </button>
        </div>
      </footer>

      {/* Modal Meus Agendamentos */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BarberProvider>
      <BarberAppContent />
    </BarberProvider>
  );
}

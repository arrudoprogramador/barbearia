import React, { useState } from 'react';
import { LayoutDashboard, Calendar, Scissors, Users, Settings, Server, LogOut, ArrowLeft, ExternalLink } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import DashboardTab from './DashboardTab';
import AppointmentsTab from './AppointmentsTab';
import ServicesTab from './ServicesTab';
import BarbersTab from './BarbersTab';
import SettingsTab from './SettingsTab';
import DeployGuideTab from './DeployGuideTab';

export default function AdminLayout({ onClose }) {
  const { settings, logoutAdmin } = useBarber();
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Agendamentos', icon: Calendar },
    { id: 'services', label: 'Serviços', icon: Scissors },
    { id: 'barbers', label: 'Barbeiros & Escalas', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'deploy', label: 'Deploy HostGator', icon: Server },
  ];

  const handleLogout = () => {
    logoutAdmin();
    onClose();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Voltar para a Área do Cliente"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  {settings.fantasy_name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                  Painel Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Gerenciador da barbearia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              <span>Ver Site do Cliente</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sair do Painel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab navigation pills */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto no-scrollbar border-t border-slate-800">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 animate-fade-in">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'appointments' && <AppointmentsTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'barbers' && <BarbersTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'deploy' && <DeployGuideTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-400">
        Template Barbearia Profissional • Pronto para HostGator cPanel & Multi-Empresas
      </footer>
    </div>
  );
}


import React, { useState } from 'react';
import { X, Search, Calendar, Clock, Scissors, AlertCircle, Trash2, User, LogOut, CheckCircle } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function MyBookingsModal({ isOpen, onClose }) {
  const { appointments, updateAppointmentStatus, settings, savedUser, forgetSavedUser } = useBarber();
  const [searchPhone, setSearchPhone] = useState(savedUser?.phone || '');
  const [hasSearched, setHasSearched] = useState(!!savedUser);

  if (!isOpen) return null;

  const phoneQuery = (savedUser?.phone || searchPhone).replace(/\D/g, '');

  const userAppointments = appointments.filter(a => {
    if (!phoneQuery || phoneQuery.length < 8) return false;
    const cleanAptPhone = (a.client_phone || '').replace(/\D/g, '');
    return cleanAptPhone.includes(phoneQuery);
  });

  const handleCancel = async (aptId) => {
    if (confirm("Deseja realmente cancelar este horário no sistema?")) {
      await updateAppointmentStatus(aptId, 'cancelled');
    }
  };

  const handleForget = () => {
    if (confirm("Deseja remover seus dados salvos deste dispositivo?")) {
      forgetSavedUser();
      setSearchPhone('');
      setHasSearched(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Meus Agendamentos</h3>
            <p className="text-[11px] text-slate-500">
              {savedUser ? `Registrado para: ${savedUser.name}` : 'Consulte seus horários no sistema'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* User Status Bar if saved */}
          {savedUser ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                  {savedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">{savedUser.name}</p>
                  <p className="text-[11px] text-slate-500">{savedUser.phone}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleForget}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                title="Desconectar deste dispositivo"
              >
                <LogOut className="w-3 h-3" />
                <span>Trocar</span>
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Digite seu Telefone de Cadastro
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-slate-900 text-xs focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setHasSearched(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Buscar</span>
                </button>
              </div>
            </div>
          )}

          {/* Appointments List */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {userAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">Nenhum agendamento encontrado</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Seus próximos cortes agendados aparecerão aqui.</p>
              </div>
            ) : (
              userAppointments.map(apt => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        {apt.date} às {apt.time}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'cancelled' ? 'Cancelado' : apt.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <p className="font-bold text-slate-900">
                      {apt.services.map(s => s.title).join(' + ')}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Barbeiro: <b>{apt.barber_name}</b> • R$ {Number(apt.total_price).toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  {apt.status === 'confirmed' && settings.booking_rules?.allow_client_cancel && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        Protocolo: #{apt.protocol || apt.id.slice(-6).toUpperCase()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCancel(apt.id)}
                        className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Cancelar horário</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

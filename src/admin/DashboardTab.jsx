import React from 'react';
import { Calendar, DollarSign, Users, Clock, CheckCircle, XCircle, MessageCircle, AlertCircle } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { getLocalDateString } from '../utils/date';

export default function DashboardTab() {
  const { appointments, services, barbers, settings, updateAppointmentStatus, formatWhatsAppMessage } = useBarber();

  const todayStr = getLocalDateString();

  // Appointments today
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const activeToday = todayAppointments.filter(a => a.status !== 'cancelled');
  
  // Total projected revenue today
  const todayRevenue = activeToday.reduce((sum, a) => sum + (a.total_price || 0), 0);

  // Quick WhatsApp notify
  const handleNotifyClient = (apt) => {
    const cleanPhone = apt.client_phone.replace(/\D/g, '');
    const message = formatWhatsAppMessage(apt);
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Agendamentos Hoje
            </span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {activeToday.length}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Faturamento Hoje
            </span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              R$ {todayRevenue.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Barbeiros Ativos
            </span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {barbers.filter(b => b.active).length}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Serviços
            </span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {services.filter(s => s.active).length}
            </span>
          </div>
        </div>
      </div>

      {/* Today Schedule List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Agenda de Hoje</h3>
            <p className="text-xs text-slate-500">
              {todayAppointments.length} agendamento(s) para a data atual
            </p>
          </div>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-sm text-slate-700">Nenhum agendamento para hoje ainda</p>
            <p className="text-xs text-slate-400 mt-1">Os clientes agendados aparecerão listados aqui.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {todayAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(apt => (
                <div key={apt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Time Pill */}
                    <div className="w-16 py-2 rounded-xl bg-slate-900 text-amber-400 font-extrabold text-center text-sm flex-shrink-0">
                      {apt.time}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{apt.client_name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            apt.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : apt.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {apt.status === 'completed' ? 'Concluído' : apt.status === 'cancelled' ? 'Cancelado' : 'Confirmado'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-0.5">
                        <span className="font-semibold text-slate-800">{apt.services.map(s => s.title).join(' + ')}</span>
                        <span className="text-slate-400"> • </span>
                        <span>Profissional: {apt.barber_name}</span>
                        <span className="text-slate-400"> • </span>
                        <span className="font-bold text-slate-900">R$ {Number(apt.total_price).toFixed(2).replace('.', ',')}</span>
                      </p>

                      {apt.notes && (
                        <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                          Nota: {apt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleNotifyClient(apt)}
                      className="p-2 sm:px-3 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
                      title="Enviar WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                        className="p-2 sm:px-3 sm:py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-blue-200 transition-colors cursor-pointer"
                        title="Marcar como Concluído"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Concluir</span>
                      </button>
                    )}

                    {apt.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                        className="p-2 sm:px-3 sm:py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
                        title="Cancelar Horário"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Cancelar</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}


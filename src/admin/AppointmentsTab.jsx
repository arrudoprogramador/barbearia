import React, { useState, useMemo } from 'react';
import { Calendar, Search, Filter, Plus, Trash2, CheckCircle, XCircle, MessageCircle, Clock, User, Scissors } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { api } from '../services/api';

export default function AppointmentsTab() {
  const { appointments, services, barbers, updateAppointmentStatus, deleteAppointment, formatWhatsAppMessage, confirmBooking } = useBarber();

  const [filterDate, setFilterDate] = useState('all'); // 'all', 'today', 'tomorrow', 'custom'
  const [customDate, setCustomDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualClient, setManualClient] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualServiceId, setManualServiceId] = useState(services[0]?.id || '');
  const [manualBarberId, setManualBarberId] = useState(barbers[0]?.id || '');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualTime, setManualTime] = useState('10:00');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Date filter
      if (filterDate === 'today' && apt.date !== todayStr) return false;
      if (filterDate === 'tomorrow' && apt.date !== tomorrowStr) return false;
      if (filterDate === 'custom' && customDate && apt.date !== customDate) return false;

      // Status filter
      if (filterStatus !== 'all' && apt.status !== filterStatus) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = apt.client_name?.toLowerCase().includes(q);
        const matchPhone = apt.client_phone?.includes(q);
        const matchBarber = apt.barber_name?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchBarber) return false;
      }

      return true;
    });
  }, [appointments, filterDate, customDate, filterStatus, searchQuery, todayStr, tomorrowStr]);

  const handleNotify = (apt) => {
    const cleanPhone = apt.client_phone.replace(/\D/g, '');
    const message = formatWhatsAppMessage(apt);
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja realmente excluir este registro de agendamento?")) {
      await deleteAppointment(id);
    }
  };

  const handleCreateManual = async (e) => {
    e.preventDefault();
    if (!manualClient.trim() || !manualPhone.trim()) {
      alert("Preencha o nome e o WhatsApp do cliente.");
      return;
    }
    const selectedSrv = services.find(s => s.id === manualServiceId) || services[0];
    const selectedBrb = barbers.find(b => b.id === manualBarberId) || barbers[0];

    const newApt = {
      client_name: manualClient.trim(),
      client_phone: manualPhone.trim(),
      services: [{
        id: selectedSrv.id,
        title: selectedSrv.title,
        price: selectedSrv.price,
        duration: selectedSrv.duration
      }],
      barber_id: selectedBrb.id,
      barber_name: selectedBrb.name,
      date: manualDate,
      time: manualTime,
      total_price: selectedSrv.price,
      total_duration: selectedSrv.duration,
      notes: "Agendado manualmente via painel admin",
      status: 'confirmed'
    };

    await api.createAppointment(newApt);
    window.location.reload(); // reload state
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, telefone ou barbeiro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm focus:outline-hidden"
            />
          </div>

          {/* Add Manual Appointment Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Agendamento Manual</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Data:
          </span>
          <button
            type="button"
            onClick={() => setFilterDate('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${filterDate === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setFilterDate('today')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${filterDate === 'today' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => setFilterDate('tomorrow')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${filterDate === 'tomorrow' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Amanhã
          </button>
          <button
            type="button"
            onClick={() => setFilterDate('custom')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${filterDate === 'custom' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Data específica
          </button>

          {filterDate === 'custom' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:outline-hidden ml-2"
            />
          )}

          <span className="text-xs font-bold text-slate-500 ml-auto mr-2">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:outline-hidden bg-white"
          >
            <option value="all">Todos os Status</option>
            <option value="confirmed">Confirmados</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>{filteredAppointments.length} agendamento(s) encontrado(s)</span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-600">Nenhum agendamento encontrado para estes filtros.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map(apt => (
              <div key={apt.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Date & Time pill */}
                  <div className="w-24 text-center py-2 px-2 rounded-xl bg-slate-100 border border-slate-200/80 flex-shrink-0">
                    <span className="text-xs font-extrabold text-slate-900 block">{apt.time}</span>
                    <span className="text-[10px] font-semibold text-slate-500 block uppercase">{apt.date}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">{apt.client_name}</span>
                      <span className="text-xs font-medium text-slate-500">({apt.client_phone})</span>
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

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-800">
                        {apt.services.map(s => s.title).join(' + ')}
                      </span>
                      <span>•</span>
                      <span>Barbeiro: <b>{apt.barber_name}</b></span>
                      <span>•</span>
                      <span className="font-bold text-slate-900">R$ {Number(apt.total_price).toFixed(2).replace('.', ',')}</span>
                      <span>•</span>
                      <span>~{apt.total_duration} min</span>
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                        Obs: {apt.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleNotify(apt)}
                    className="p-2 sm:px-3 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
                    title="Enviar WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  {apt.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                      className="p-2 sm:px-3 sm:py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-blue-200 transition-colors cursor-pointer"
                      title="Concluir Atendimento"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Concluir</span>
                    </button>
                  )}

                  {apt.status !== 'cancelled' ? (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                      className="p-2 sm:px-3 sm:py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
                      title="Cancelar"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cancelar</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                      className="p-2 sm:px-3 sm:py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Reativar"
                    >
                      <span>Reativar</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(apt.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Excluir Registro"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Novo Agendamento Manual</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={manualClient}
                  onChange={(e) => setManualClient(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="(11) 98765-4321"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Serviço</label>
                  <select
                    value={manualServiceId}
                    onChange={(e) => setManualServiceId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.title} - R$ {s.price}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barbeiro</label>
                  <select
                    value={manualBarberId}
                    onChange={(e) => setManualBarberId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {barbers.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-xl"
                >
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

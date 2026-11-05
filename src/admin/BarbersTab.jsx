import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, Phone, User, Check, Shield } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function BarbersTab() {
  const { barbers, updateBarbers } = useBarber();
  const [editingBarber, setEditingBarber] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const daysList = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const defaultSchedule = {
    monday: { day_on: false, opens_at: "10:00", closes_at: "19:00", lunch_start: "13:00", lunch_end: "14:30" },
    tuesday: { day_on: true, opens_at: "09:00", closes_at: "19:00", lunch_start: "13:00", lunch_end: "14:30" },
    wednesday: { day_on: true, opens_at: "09:00", closes_at: "19:30", lunch_start: "13:00", lunch_end: "14:30" },
    thursday: { day_on: true, opens_at: "09:00", closes_at: "19:30", lunch_start: "13:00", lunch_end: "14:30" },
    friday: { day_on: true, opens_at: "09:00", closes_at: "20:00", lunch_start: "13:00", lunch_end: "14:30" },
    saturday: { day_on: true, opens_at: "09:00", closes_at: "20:00", lunch_start: "13:00", lunch_end: "14:30" },
    sunday: { day_on: true, opens_at: "09:00", closes_at: "14:00", lunch_start: "", lunch_end: "" },
  };

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    nickname: '',
    role: 'Barbeiro Profissional',
    phone: '',
    photo: '',
    active: true,
    week_schedule: defaultSchedule
  });

  const handleOpenNew = () => {
    setIsNew(true);
    setFormData({
      id: 'barber-' + Date.now().toString(36),
      name: '',
      nickname: '',
      role: 'Barbeiro Profissional',
      phone: '',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      active: true,
      week_schedule: defaultSchedule
    });
    setEditingBarber(true);
  };

  const handleOpenEdit = (barber) => {
    setIsNew(false);
    setFormData({
      ...barber,
      week_schedule: barber.week_schedule || defaultSchedule
    });
    setEditingBarber(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja realmente excluir este profissional?")) {
      const updated = barbers.filter(b => b.id !== id);
      await updateBarbers(updated);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let updated;
    if (isNew) {
      updated = [...barbers, formData];
    } else {
      updated = barbers.map(b => b.id === formData.id ? formData : b);
    }
    await updateBarbers(updated);
    setEditingBarber(null);
  };

  const updateDaySchedule = (dayKey, field, val) => {
    setFormData(prev => ({
      ...prev,
      week_schedule: {
        ...prev.week_schedule,
        [dayKey]: {
          ...prev.week_schedule[dayKey],
          [field]: val
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Equipe & Cadeiras</h3>
          <p className="text-xs text-slate-500">
            Gerencie barbeiros, horários individuais de expediente e pausas de almoço.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Barbeiro</span>
        </button>
      </div>

      {/* Barbers list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {barbers.map(barber => (
          <div
            key={barber.id}
            className={`bg-white rounded-2xl border p-5 transition-all ${
              barber.active ? 'border-slate-200 shadow-xs' : 'border-slate-200/60 opacity-60 bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={barber.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={barber.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{barber.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{barber.role}</p>
                  {barber.phone && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" /> {barber.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(barber)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Editar Barbeiro"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {barbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDelete(barber.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Excluir Barbeiro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick schedule summary */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Seg a Sáb: ~09:00 - 19:30
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  barber.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {barber.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-extrabold text-slate-900 text-base">
                {isNew ? 'Cadastrar Novo Barbeiro' : 'Editar Barbeiro e Horários'}
              </h3>
              <button
                onClick={() => setEditingBarber(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Bruno Vinicius Lopes"
                    className="w-full px-3 py-2 border rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Apelido / Como é chamado</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="ex: Bruno Lopes"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cargo / Especialidade</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="ex: Barbeiro Master"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL da Foto de Perfil</label>
                <input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-amber-500 w-4 h-4"
                  />
                  <span>Barbeiro ativo para novos agendamentos</span>
                </label>
              </div>

              {/* Weekly Working Hours Table */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-3">
                  Escala de Horários Semanais
                </h4>

                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  {daysList.map(d => {
                    const sch = formData.week_schedule?.[d.key] || { day_on: true, opens_at: "09:00", closes_at: "19:00", lunch_start: "13:00", lunch_end: "14:00" };

                    return (
                      <div key={d.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-white rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 min-w-[130px]">
                          <input
                            type="checkbox"
                            checked={sch.day_on}
                            onChange={(e) => updateDaySchedule(d.key, 'day_on', e.target.checked)}
                            className="rounded text-amber-500"
                          />
                          <span className={`font-semibold ${sch.day_on ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                            {d.label}
                          </span>
                        </div>

                        {sch.day_on ? (
                          <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Das</span>
                              <input
                                type="time"
                                value={sch.opens_at}
                                onChange={(e) => updateDaySchedule(d.key, 'opens_at', e.target.value)}
                                className="px-1.5 py-0.5 border rounded"
                              />
                              <span className="text-slate-400">às</span>
                              <input
                                type="time"
                                value={sch.closes_at}
                                onChange={(e) => updateDaySchedule(d.key, 'closes_at', e.target.value)}
                                className="px-1.5 py-0.5 border rounded"
                              />
                            </div>

                            <div className="flex items-center gap-1 sm:ml-2 sm:border-l sm:pl-2 border-slate-200">
                              <span className="text-slate-400">Almoço:</span>
                              <input
                                type="time"
                                value={sch.lunch_start}
                                onChange={(e) => updateDaySchedule(d.key, 'lunch_start', e.target.value)}
                                className="px-1.5 py-0.5 border rounded"
                              />
                              <span className="text-slate-400">-</span>
                              <input
                                type="time"
                                value={sch.lunch_end}
                                onChange={(e) => updateDaySchedule(d.key, 'lunch_end', e.target.value)}
                                className="px-1.5 py-0.5 border rounded"
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Folga / Fechado
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBarber(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
                >
                  Salvar Barbeiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


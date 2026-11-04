import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, Sparkles, Clock, DollarSign, Image as ImageIcon } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function ServicesTab() {
  const { services, updateServices } = useBarber();
  const [editingService, setEditingService] = useState(null);
  const [isNew, setIsNew] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    price: 35.00,
    duration: 35,
    category: 'Cabelo',
    photo: '',
    popular: false,
    active: true
  });

  const handleOpenNew = () => {
    setIsNew(true);
    setFormData({
      id: 'srv-' + Date.now().toString(36),
      title: '',
      description: '',
      price: 35.00,
      duration: 35,
      category: 'Cabelo',
      photo: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
      popular: false,
      active: true
    });
    setEditingService(true);
  };

  const handleOpenEdit = (srv) => {
    setIsNew(false);
    setFormData({ ...srv });
    setEditingService(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja realmente remover este serviço do catálogo?")) {
      const updated = services.filter(s => s.id !== id);
      await updateServices(updated);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let updated;
    if (isNew) {
      updated = [...services, formData];
    } else {
      updated = services.map(s => s.id === formData.id ? formData : s);
    }
    await updateServices(updated);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Catálogo de Serviços</h3>
          <p className="text-xs text-slate-500">
            Cadastre, altere preços, durações e fotos dos serviços oferecidos aos clientes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <div
            key={service.id}
            className={`bg-white rounded-2xl border p-4 sm:p-5 flex gap-4 transition-all ${
              service.active ? 'border-slate-200 shadow-xs' : 'border-slate-200/60 opacity-60 bg-slate-50'
            }`}
          >
            {/* Image */}
            <img
              src={service.photo || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80"}
              alt={service.title}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover ring-1 ring-slate-200/80 flex-shrink-0 bg-slate-100"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base">{service.title}</h4>
                    {service.popular && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                        <Sparkles className="w-2.5 h-2.5" /> Destaque
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                    {service.category || 'Geral'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(service)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Editar Serviço"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Excluir Serviço"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {service.description && (
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {service.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-100 text-xs">
                <span className="font-extrabold text-slate-900 text-sm">
                  R$ {Number(service.price).toFixed(2).replace('.', ',')}
                </span>
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {service.duration} min
                </span>
                <span
                  className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    service.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {service.active ? 'Ativo no Chat' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">
                {isNew ? 'Cadastrar Novo Serviço' : 'Editar Serviço'}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Serviço *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: CORTE & BARBA"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição</label>
                <textarea
                  rows="2"
                  placeholder="Detalhes sobre o serviço..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duração (min) *</label>
                  <input
                    type="number"
                    step="5"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 15 })}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Cabelo, Barba, Combos..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL da Imagem / Foto</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="rounded text-amber-500 w-4 h-4"
                  />
                  <span>Destacar como "Mais Pedido"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-amber-500 w-4 h-4"
                  />
                  <span>Disponível para agendamento</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


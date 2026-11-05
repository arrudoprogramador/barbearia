import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, User, Phone, FileText, Calendar, Clock, Scissors, Edit3, ShieldCheck } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { formatDateBR } from '../utils/date';

export default function CustomerForm() {
  const { booking, settings, savedUser, updateCustomerData, confirmBooking, prevStep, forgetSavedUser } = useBarber();

  const [isEditing, setIsEditing] = useState(!savedUser);
  const [name, setName] = useState(savedUser?.name || booking.clientName || '');
  const [phone, setPhone] = useState(savedUser?.phone || booking.clientPhone || '');
  const [notes, setNotes] = useState(booking.clientNotes || '');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Mask Brazilian phone: (XX) 9XXXX-XXXX
  const handlePhoneChange = (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    
    if (v.length > 6) {
      v = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
    } else if (v.length > 2) {
      v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    setPhone(v);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim() || name.trim().length < 3) {
      errs.name = "Por favor, informe seu nome completo.";
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errs.phone = "Por favor, informe um telefone de contato válido com DDD.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      updateCustomerData({
        clientName: name.trim(),
        clientPhone: phone.trim(),
        clientNotes: notes.trim()
      });
      await confirmBooking();
    } catch (err) {
      console.error(err);
      alert("Houve um erro ao registrar seu agendamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = booking.selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalDuration = booking.selectedServices.reduce((sum, s) => sum + (s.duration || 0), 0);

  // Format date display
  const dateFormatted = formatDateBR(booking.selectedDate);

  return (
    <div className="pb-24 animate-fade-in">
      {/* Clean Step Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-0.5">
            Etapa Final
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Confirmação no Sistema
          </h2>
        </div>

        <button
          type="button"
          onClick={prevStep}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Customer Data */}
        <div className="md:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If user is already saved and not in edit mode */}
            {savedUser && !isEditing ? (
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-amber-500/30 bg-amber-50/20 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Seus Dados Salvos no Sistema</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar dados</span>
                  </button>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <p className="text-sm font-black text-slate-900">{name}</p>
                  <p className="text-xs font-medium text-slate-500">{phone}</p>
                </div>

                <p className="text-[11px] text-slate-500">
                  ✅ Seus dados estão salvos neste dispositivo para agendamentos rápidos em 1 clique.
                </p>
              </div>
            ) : (
              /* First time registration or editing */
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {savedUser ? 'Atualizar Seus Dados' : 'Identificação no Sistema'}
                  </h3>
                  {savedUser && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancelar edição
                    </button>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Seu Nome Completo *</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="ex: Carlos Silva"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900 focus:outline-hidden transition-all ${
                      errors.name ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-300 focus:border-slate-900'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Telefone de Contato com DDD *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={phone}
                    onChange={(e) => {
                      handlePhoneChange(e);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900 focus:outline-hidden transition-all ${
                      errors.phone ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-300 focus:border-slate-900'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                  <p className="text-[11px] text-slate-400 mt-1">
                    Você só cadastra uma vez. Seus dados ficam salvos para os próximos cortes.
                  </p>
                </div>
              </div>
            )}

            {/* Optional Notes */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Observação para o barbeiro (opcional)</span>
              </label>
              <textarea
                rows="2"
                placeholder="ex: Degradê navalhado, disfarçado alto..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-slate-900 text-xs text-slate-900 focus:outline-hidden transition-all"
              />
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{submitting ? 'Confirmando no Sistema...' : 'Confirmar Agendamento no Sistema'}</span>
            </button>
          </form>
        </div>

        {/* Right: Clean Summary Card */}
        <div className="md:col-span-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 sticky top-6">
            <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-500" />
              <span>Resumo do Horário</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Data
                </span>
                <span className="font-extrabold text-slate-900">{dateFormatted}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Horário
                </span>
                <span className="font-extrabold text-slate-900">{booking.selectedTime}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Barbeiro
                </span>
                <span className="font-extrabold text-slate-900">
                  {booking.selectedBarber ? booking.selectedBarber.name : "Primeiro disponível"}
                </span>
              </div>
            </div>

            {/* Services */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Serviços ({booking.selectedServices.length})
              </span>
              <div className="space-y-1.5">
                {booking.selectedServices.map(s => (
                  <div key={s.id} className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">{s.title}</span>
                    <span className="text-slate-900 font-bold">
                      R$ {Number(s.price).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Estimado</span>
                <span className="text-[10px] text-slate-400">~{totalDuration} min de atendimento</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                R$ {Number(totalPrice).toFixed(2).replace('.', ',')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

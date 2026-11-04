import React from 'react';
import { ArrowLeft, ArrowRight, UserCheck, Users, Star } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function ProfessionalSelector() {
  const { barbers, booking, selectBarber, nextStep, prevStep } = useBarber();

  const activeBarbers = barbers.filter(b => b.active !== false);

  const handleSelect = (barber) => {
    selectBarber(barber);
    // Auto advance on selection for speed and clean UX!
    setTimeout(() => {
      nextStep();
    }, 180);
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-0.5">
            Passo 2 de 4
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Escolha o profissional
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

      <div className="space-y-3.5">
        {/* Option: Any Professional */}
        <div
          onClick={() => handleSelect(null)}
          className={`flex items-center justify-between p-4 rounded-xl border bg-white cursor-pointer transition-all duration-200 select-none group ${
            booking.selectedBarber === null
              ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20 shadow-sm'
              : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                  Qualquer profissional
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Mais rápido
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Maior disponibilidade de horários no dia escolhido.
              </p>
            </div>
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
              booking.selectedBarber === null
                ? 'border-amber-500 bg-amber-500 text-slate-950'
                : 'border-slate-300'
            }`}
          >
            {booking.selectedBarber === null && <UserCheck className="w-3.5 h-3.5" />}
          </div>
        </div>

        {/* Specific Barbers */}
        {activeBarbers.map(barber => {
          const isSelected = booking.selectedBarber?.id === barber.id;

          return (
            <div
              key={barber.id}
              onClick={() => handleSelect(barber)}
              className={`flex items-center justify-between p-4 rounded-xl border bg-white cursor-pointer transition-all duration-200 select-none group ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={barber.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={barber.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                      {barber.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {barber.role || "Barbeiro Profissional"}
                  </p>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500 text-slate-950'
                    : 'border-slate-300'
                }`}
              >
                {isSelected && <UserCheck className="w-3.5 h-3.5" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Serviços</span>
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


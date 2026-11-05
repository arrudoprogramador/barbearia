import React, { useState, useMemo } from 'react';
import { Clock, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function ServiceSelector() {
  const { services, booking, toggleService, nextStep } = useBarber();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Active services only
  const activeServices = useMemo(() => {
    return services.filter(s => s.active !== false);
  }, [services]);

  // Extract categories
  const categories = useMemo(() => {
    const cats = ['Todos'];
    activeServices.forEach(s => {
      if (s.category && !cats.includes(s.category)) {
        cats.push(s.category);
      }
    });
    return cats;
  }, [activeServices]);

  // Filtered by category
  const filteredServices = useMemo(() => {
    if (selectedCategory === 'Todos') return activeServices;
    return activeServices.filter(s => s.category === selectedCategory);
  }, [activeServices, selectedCategory]);

  const selectedCount = booking.selectedServices.length;
  const totalPrice = booking.selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalDuration = booking.selectedServices.reduce((sum, s) => sum + (s.duration || 0), 0);

  const formatMoney = (val) => {
    return `R$ ${Number(val).toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="pb-28 animate-fade-in">
      {/* Step Header */}
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-0.5">
          Passo 1 de 4
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Escolha os serviços
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Selecione um ou mais serviços para o mesmo atendimento.
        </p>
      </div>

      {/* Category Pills */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredServices.map(service => {
          const isSelected = booking.selectedServices.some(s => s.id === service.id);

          return (
            <div
              key={service.id}
              onClick={() => toggleService(service)}
              className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border bg-white transition-all duration-200 cursor-pointer group select-none active:scale-[0.99] ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                {/* Photo or placeholder */}
                {service.photo ? (
                  <img
                    src={service.photo}
                    alt={service.title}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0 bg-slate-100 ring-1 ring-slate-200/50"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    ✂️
                  </div>
                )}

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-amber-600 transition-colors">
                      {service.title}
                    </h3>
                    {service.popular && (
                      <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                        <Sparkles className="w-2.5 h-2.5" /> Destaque
                      </span>
                    )}
                  </div>

                  {service.description && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {service.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {formatMoney(service.price)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {service.duration} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Selection Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'border-2 border-slate-300 group-hover:border-slate-400'
                }`}
              >
                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Action Bar with iOS Safe Area Padding */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-float px-4 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] animate-fade-in">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">
                {selectedCount} {selectedCount === 1 ? 'serviço' : 'serviços'} • ~{totalDuration} min
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900">
                {formatMoney(totalPrice)}
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


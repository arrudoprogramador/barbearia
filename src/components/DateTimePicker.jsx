import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, Sun, Sunset, Moon, AlertCircle } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function DateTimePicker() {
  const { barbers, appointments, booking, selectDate, selectTime, nextStep, prevStep } = useBarber();

  const daysWeekNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const daysKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Generate next 14 days
  const availableDays = useMemo(() => {
    const list = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      const dayOfWeekIndex = d.getDay();
      const dayKey = daysKeys[dayOfWeekIndex];
      const dayName = i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : daysWeekNames[dayOfWeekIndex];
      const monthName = monthNames[d.getMonth()];

      // Check if open on this day
      let isOpen = false;
      if (booking.selectedBarber) {
        isOpen = booking.selectedBarber.week_schedule?.[dayKey]?.day_on ?? true;
      } else {
        // Any active barber open?
        isOpen = barbers.some(b => b.active && b.week_schedule?.[dayKey]?.day_on);
      }

      list.push({
        dateString,
        dayNum: day,
        dayName,
        monthName,
        dayKey,
        isOpen,
        isToday: i === 0
      });
    }
    return list;
  }, [barbers, booking.selectedBarber]);

  // Set default selected date if not selected
  const activeDate = booking.selectedDate || availableDays.find(d => d.isOpen)?.dateString || availableDays[0].dateString;

  // Selected day info
  const currentDayInfo = availableDays.find(d => d.dateString === activeDate);

  // Generate available time slots for the active date
  const timeSlots = useMemo(() => {
    if (!currentDayInfo || !currentDayInfo.isOpen) return [];

    const dayKey = currentDayInfo.dayKey;
    let opensAt = "09:00";
    let closesAt = "19:00";
    let lunchStart = "13:00";
    let lunchEnd = "14:00";

    if (booking.selectedBarber) {
      const sch = booking.selectedBarber.week_schedule?.[dayKey];
      if (sch) {
        opensAt = sch.opens_at || "09:00";
        closesAt = sch.closes_at || "19:00";
        lunchStart = sch.lunch_start || "";
        lunchEnd = sch.lunch_end || "";
      }
    }

    // Helper minutes
    const toMins = (str) => {
      if (!str) return -1;
      const [h, m] = str.split(':').map(Number);
      return h * 60 + m;
    };

    const startMins = toMins(opensAt);
    const endMins = toMins(closesAt);
    const lunchStartMins = toMins(lunchStart);
    const lunchEndMins = toMins(lunchEnd);

    // Filter appointments for this date
    const bookedTimes = appointments
      .filter(a => {
        if (a.date !== activeDate || a.status === 'cancelled') return false;
        if (booking.selectedBarber) {
          return a.barber_id === booking.selectedBarber.id;
        }
        return true;
      })
      .map(a => a.time);

    // Current time check if today
    const now = new Date();
    const isToday = currentDayInfo.isToday;
    const currentMins = now.getHours() * 60 + now.getMinutes() + 15; // 15 min margin

    const slots = [];
    const interval = 30; // 30 min intervals

    for (let m = startMins; m <= endMins - 30; m += interval) {
      const hStr = String(Math.floor(m / 60)).padStart(2, '0');
      const mStr = String(m % 60).padStart(2, '0');
      const timeStr = `${hStr}:${mStr}`;

      // Check lunch
      const isLunch = lunchStartMins > 0 && lunchEndMins > 0 && m >= lunchStartMins && m < lunchEndMins;
      // Check already booked
      const isBooked = bookedTimes.includes(timeStr);
      // Check past time if today
      const isPast = isToday && m <= currentMins;

      // Group period
      let period = 'morning';
      if (m >= 720 && m < 1080) period = 'afternoon';
      if (m >= 1080) period = 'night';

      slots.push({
        time: timeStr,
        period,
        disabled: isLunch || isBooked || isPast,
        reason: isBooked ? 'Ocupado' : isLunch ? 'Almoço' : isPast ? 'Passou' : null
      });
    }

    return slots;
  }, [activeDate, currentDayInfo, booking.selectedBarber, appointments]);

  const morningSlots = timeSlots.filter(s => s.period === 'morning');
  const afternoonSlots = timeSlots.filter(s => s.period === 'afternoon');
  const nightSlots = timeSlots.filter(s => s.period === 'night');

  const handleSelectTime = (slot) => {
    if (slot.disabled) return;
    selectTime(slot.time);
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-0.5">
            Passo 3 de 4
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Escolha data e horário
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

      {/* Date Selector Slider */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          <span>Escolha a Data</span>
        </label>

        <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar -mx-2 px-2">
          {availableDays.map(item => {
            const isSelected = activeDate === item.dateString;

            return (
              <button
                key={item.dateString}
                type="button"
                disabled={!item.isOpen}
                onClick={() => selectDate(item.dateString)}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-16 py-3 rounded-2xl border transition-all duration-150 select-none cursor-pointer ${
                  !item.isOpen
                    ? 'opacity-40 border-slate-200 bg-slate-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-amber-500 bg-slate-900 text-white shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                  {item.dayName}
                </span>
                <span className={`text-xl font-extrabold my-0.5 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {item.dayNum}
                </span>
                <span className={`text-[10px] font-medium ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Section */}
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-4 flex items-center justify-between uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Horários Disponíveis</span>
          </div>
          {booking.selectedTime && (
            <span className="text-amber-600 font-bold lowercase">
              Selecionado: {booking.selectedTime}
            </span>
          )}
        </label>

        {!currentDayInfo?.isOpen ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700">Estabelecimento fechado nesta data</h4>
            <p className="text-xs text-slate-400 mt-1">Por favor selecione outro dia no calendário acima.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Manhã */}
            {morningSlots.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Manhã</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {morningSlots.map(slot => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={slot.disabled}
                      onClick={() => handleSelectTime(slot)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all select-none ${
                        slot.disabled
                          ? 'bg-slate-100 text-slate-300 border border-transparent cursor-not-allowed line-through'
                          : booking.selectedTime === slot.time
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500/30 shadow-sm cursor-pointer'
                          : 'bg-white text-slate-800 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 cursor-pointer'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tarde */}
            {afternoonSlots.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2.5">
                  <Sunset className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tarde</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {afternoonSlots.map(slot => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={slot.disabled}
                      onClick={() => handleSelectTime(slot)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all select-none ${
                        slot.disabled
                          ? 'bg-slate-100 text-slate-300 border border-transparent cursor-not-allowed line-through'
                          : booking.selectedTime === slot.time
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500/30 shadow-sm cursor-pointer'
                          : 'bg-white text-slate-800 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 cursor-pointer'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Noite */}
            {nightSlots.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2.5">
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Noite</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {nightSlots.map(slot => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={slot.disabled}
                      onClick={() => handleSelectTime(slot)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all select-none ${
                        slot.disabled
                          ? 'bg-slate-100 text-slate-300 border border-transparent cursor-not-allowed line-through'
                          : booking.selectedTime === slot.time
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500/30 shadow-sm cursor-pointer'
                          : 'bg-white text-slate-800 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 cursor-pointer'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-10 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button
          type="button"
          disabled={!booking.selectedTime}
          onClick={nextStep}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
            booking.selectedTime
              ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


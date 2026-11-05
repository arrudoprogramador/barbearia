import React, { useState, useMemo, useRef } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, Sun, Sunset, Moon, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { getLocalDateString, timeToMinutes, intervalsOverlap } from '../utils/date';

export default function DateTimePicker() {
  const { barbers, appointments, booking, selectDate, selectTime, nextStep, prevStep } = useBarber();
  const dateScrollRef = useRef(null);

  const daysWeekNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const daysKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Total service duration in minutes (minimum 15 mins)
  const totalDuration = useMemo(() => {
    const sum = booking.selectedServices.reduce((acc, s) => acc + (Number(s.duration) || 30), 0);
    return Math.max(sum, 15);
  }, [booking.selectedServices]);

  // Generate next 14 days using local dates
  const availableDays = useMemo(() => {
    const list = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const dateString = getLocalDateString(d);
      
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
        dayNum: String(d.getDate()).padStart(2, '0'),
        dayName,
        monthName,
        dayKey,
        isOpen,
        isToday: i === 0
      });
    }
    return list;
  }, [barbers, booking.selectedBarber]);

  // Set default selected date if not selected or if previously selected is closed
  const activeDate = useMemo(() => {
    if (booking.selectedDate) {
      const found = availableDays.find(d => d.dateString === booking.selectedDate);
      if (found && found.isOpen) return booking.selectedDate;
    }
    return availableDays.find(d => d.isOpen)?.dateString || availableDays[0].dateString;
  }, [booking.selectedDate, availableDays]);

  // Selected day info
  const currentDayInfo = availableDays.find(d => d.dateString === activeDate);

  // Generate available time slots considering appointment durations & lunch overlaps
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

    const startMins = timeToMinutes(opensAt);
    const endMins = timeToMinutes(closesAt);
    const lunchStartMins = timeToMinutes(lunchStart);
    const lunchEndMins = timeToMinutes(lunchEnd);

    // Existing booked appointments for this date
    const bookedIntervals = appointments
      .filter(a => {
        if (a.date !== activeDate || a.status === 'cancelled') return false;
        if (booking.selectedBarber) {
          return a.barber_id === booking.selectedBarber.id;
        }
        return true;
      })
      .map(a => {
        const start = timeToMinutes(a.time);
        const dur = Number(a.total_duration) || 30;
        return { start, end: start + dur };
      });

    // Current time margin check if today (15 min margin)
    const now = new Date();
    const isToday = currentDayInfo.isToday;
    const currentMins = now.getHours() * 60 + now.getMinutes() + 15;

    const slots = [];
    const interval = 30; // 30 min grid steps

    for (let m = startMins; m <= endMins - 15; m += interval) {
      const slotEnd = m + totalDuration;
      const hStr = String(Math.floor(m / 60)).padStart(2, '0');
      const mStr = String(m % 60).padStart(2, '0');
      const timeStr = `${hStr}:${mStr}`;

      // 1. Exceeds closing time
      const exceedsClosing = slotEnd > endMins;

      // 2. Overlaps with lunch break
      const hasLunch = lunchStartMins > 0 && lunchEndMins > lunchStartMins;
      const overlapsLunch = hasLunch && intervalsOverlap(m, slotEnd, lunchStartMins, lunchEndMins);

      // 3. Overlaps with existing appointment
      const overlapsBooked = bookedIntervals.some(inv => intervalsOverlap(m, slotEnd, inv.start, inv.end));

      // 4. Past time if today
      const isPast = isToday && m <= currentMins;

      const disabled = exceedsClosing || overlapsLunch || overlapsBooked || isPast;
      let reason = null;
      if (isPast) reason = 'Passou';
      else if (overlapsBooked) reason = 'Ocupado';
      else if (overlapsLunch) reason = 'Almoço';
      else if (exceedsClosing) reason = 'Fecha antes';

      // Group into periods
      let period = 'morning';
      if (m >= 720 && m < 1080) period = 'afternoon';
      if (m >= 1080) period = 'night';

      slots.push({
        time: timeStr,
        period,
        disabled,
        reason
      });
    }

    return slots;
  }, [activeDate, currentDayInfo, booking.selectedBarber, appointments, totalDuration]);

  const morningSlots = timeSlots.filter(s => s.period === 'morning');
  const afternoonSlots = timeSlots.filter(s => s.period === 'afternoon');
  const nightSlots = timeSlots.filter(s => s.period === 'night');

  const handleSelectTime = (slot) => {
    if (slot.disabled) return;
    selectTime(slot.time);
  };

  const scrollDates = (direction) => {
    if (dateScrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      dateScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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
          <p className="text-xs text-slate-500 mt-0.5">
            Tempo total estimado de atendimento: <b>{totalDuration} minutos</b>
          </p>
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

      {/* Date Selector Slider with Left/Right Controls */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Escolha o Dia</span>
          </label>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollDates('left')}
              className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              title="Dias anteriores"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollDates('right')}
              className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              title="Próximos dias"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={dateScrollRef}
          className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar -mx-2 px-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {availableDays.map(item => {
            const isSelected = activeDate === item.dateString;

            return (
              <button
                key={item.dateString}
                type="button"
                disabled={!item.isOpen}
                onClick={() => selectDate(item.dateString)}
                className={`snap-center flex-shrink-0 flex flex-col items-center justify-center w-16 sm:w-18 py-3 rounded-2xl border transition-all duration-150 select-none cursor-pointer ${
                  !item.isOpen
                    ? 'opacity-40 border-slate-200 bg-slate-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-amber-500 bg-slate-900 text-white shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-95'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
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
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Horários Livres</span>
          </label>
          {booking.selectedTime && (
            <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Selecionado: {booking.selectedTime}
            </span>
          )}
        </div>

        {!currentDayInfo?.isOpen ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700">Barbearia fechada nesta data</h4>
            <p className="text-xs text-slate-400 mt-1">Por favor selecione outro dia no calendário acima.</p>
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700">Nenhum horário disponível para esta data</h4>
            <p className="text-xs text-slate-400 mt-1">A duração do serviço selecionado não cabe nos horários restantes.</p>
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
                      className={`min-h-[44px] py-2.5 px-2 rounded-xl text-xs font-bold transition-all select-none active:scale-95 ${
                        slot.disabled
                          ? 'bg-slate-100 text-slate-300 border border-transparent cursor-not-allowed line-through'
                          : booking.selectedTime === slot.time
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500/30 shadow-sm cursor-pointer'
                          : 'bg-white text-slate-800 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 cursor-pointer shadow-xs'
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
                      className={`min-h-[44px] py-2.5 px-2 rounded-xl text-xs font-bold transition-all select-none active:scale-95 ${
                        slot.disabled
                          ? 'bg-slate-100 text-slate-300 border border-transparent cursor-not-allowed line-through'
                          : booking.selectedTime === slot.time
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500/30 shadow-sm cursor-pointer'
                          : 'bg-white text-slate-800 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 cursor-pointer shadow-xs'
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
                      className={`min-h-[44px] py-2.5 px-2 rounded-xl text-xs font-bold transition-all select-none active:scale-95 ${
                        slot.disabled
                          ? 'bg-slate-100 text-slate-300 border border-transparent cursor-not-allowed line-through'
                          : booking.selectedTime === slot.time
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500/30 shadow-sm cursor-pointer'
                          : 'bg-white text-slate-800 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 cursor-pointer shadow-xs'
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button
          type="button"
          disabled={!booking.selectedTime}
          onClick={nextStep}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
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

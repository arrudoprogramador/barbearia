import React from 'react';
import { MapPin, Clock, CalendarCheck, ExternalLink } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function Header({ onOpenAdmin, onOpenMyBookings }) {
  const { settings, barbers, appointments, savedUser } = useBarber();

  // Check if shop is currently open
  const now = new Date();
  const dayIndex = now.getDay(); // 0 is Sunday
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayKey = daysMap[dayIndex];
  
  let isOpenNow = false;
  let todayClosesAt = "19:00";
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  barbers.forEach(b => {
    if (b.active && b.week_schedule && b.week_schedule[currentDayKey]?.day_on) {
      const sch = b.week_schedule[currentDayKey];
      if (currentTimeStr >= sch.opens_at && currentTimeStr <= sch.closes_at) {
        isOpenNow = true;
      }
      if (sch.closes_at) todayClosesAt = sch.closes_at;
    }
  });

  // Count upcoming appointments for saved user
  const userUpcomingCount = React.useMemo(() => {
    if (!savedUser?.phone) return 0;
    const cleanPhone = savedUser.phone.replace(/\D/g, '');
    const todayStr = new Date().toISOString().split('T')[0];
    return appointments.filter(a => {
      const aptPhone = (a.client_phone || '').replace(/\D/g, '');
      return aptPhone === cleanPhone && a.date >= todayStr && a.status === 'confirmed';
    }).length;
  }, [appointments, savedUser]);

  return (
    <header className="bg-white border-b border-slate-200/80">
      <div className="max-w-3xl mx-auto px-4 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          
          {/* Barber Brand & Details */}
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={settings.avatar || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=500&h=500&q=85"}
                alt={settings.fantasy_name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=500&h=500&q=85";
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isOpenNow ? 'bg-emerald-500' : 'bg-rose-400'}`} />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {settings.fantasy_name}
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isOpenNow ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isOpenNow ? `Aberto hoje até às ${todayClosesAt}` : 'Fechado no momento'}
                </span>
              </div>

              {settings.subtitle && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {settings.subtitle}
                </p>
              )}

              <div className="mt-1.5 flex items-center justify-center sm:justify-start gap-1 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>
                  {settings.address.street}, {settings.address.number} - {settings.address.neighbourhood}
                </span>
              </div>
            </div>
          </div>

          {/* Clean User Booking Action */}
          <div className="flex items-center gap-2 self-center sm:self-start">
            <button
              type="button"
              onClick={onOpenMyBookings}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer select-none"
            >
              <CalendarCheck className="w-4 h-4 text-slate-600" />
              <span>{savedUser ? `Olá, ${savedUser.name.split(' ')[0]}` : 'Meus Agendamentos'}</span>
              {userUpcomingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center ml-0.5">
                  {userUpcomingCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

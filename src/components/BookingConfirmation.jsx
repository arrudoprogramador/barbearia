import React from 'react';
import { CheckCircle2, Calendar, Plus, Scissors, MapPin, User, Clock, CalendarCheck } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function BookingConfirmation({ onOpenMyBookings }) {
  const { booking, settings, resetBookingFlow } = useBarber();
  const appointment = booking.confirmedAppointment;

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Nenhum agendamento ativo.</p>
        <button
          onClick={resetBookingFlow}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold"
        >
          Iniciar Agendamento
        </button>
      </div>
    );
  }

  // Format date display
  let dateFormatted = appointment.date;
  if (appointment.date && appointment.date.includes('-')) {
    const [y, m, d] = appointment.date.split('-');
    dateFormatted = `${d}/${m}/${y}`;
  }

  // Google Calendar Link generator
  const createGoogleCalendarLink = () => {
    try {
      const [year, month, day] = appointment.date.split('-').map(Number);
      const [hour, minute] = appointment.time.split(':').map(Number);

      const startDate = new Date(year, month - 1, day, hour, minute);
      const endDate = new Date(startDate.getTime() + (appointment.total_duration || 45) * 60000);

      const formatCalDate = (d) => {
        return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
      };

      const title = encodeURIComponent(`${appointment.services.map(s => s.title).join(' + ')} - ${settings.fantasy_name}`);
      const details = encodeURIComponent(`Agendamento de corte/barba na ${settings.fantasy_name}.\nProtocolo: ${appointment.protocol || appointment.id}\nProfissional: ${appointment.barber_name}\nValor: R$ ${appointment.total_price.toFixed(2)}`);
      const location = encodeURIComponent(`${settings.address.street}, ${settings.address.number} - ${settings.address.city}`);

      return `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${formatCalDate(startDate)}/${formatCalDate(endDate)}&details=${details}&location=${location}`;
    } catch {
      return '#';
    }
  };

  return (
    <div className="max-w-lg mx-auto pb-16 animate-fade-in">
      {/* Top Success Badge */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Agendado com Sucesso!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Seu horário já está garantido no sistema da {settings.fantasy_name}.
        </p>
      </div>

      {/* Ticket / Voucher Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
              Comprovante do Sistema
            </span>
            <span className="text-sm sm:text-base font-extrabold text-white mt-0.5 block">
              {settings.fantasy_name}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Protocolo</span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
              #{appointment.protocol || appointment.id.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Data
              </span>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {dateFormatted}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> Horário
              </span>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {appointment.time}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Cliente
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                {appointment.client_name}
              </p>
              <p className="text-[11px] text-slate-500">{appointment.client_phone}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Scissors className="w-3 h-3 text-slate-400" /> Barbeiro
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                {appointment.barber_name}
              </p>
            </div>
          </div>

          {/* Services list */}
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Serviços Selecionados
            </span>
            <div className="space-y-1">
              {appointment.services.map((srv, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{srv.title}</span>
                  <span className="text-slate-900 font-bold">
                    R$ {Number(srv.price).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-500">
              <span className="block font-medium">Valor Total</span>
              <span className="text-slate-400 text-[10px]">Pagamento direto na barbearia</span>
            </div>
            <div className="text-xl font-black text-slate-900">
              R$ {Number(appointment.total_price).toFixed(2).replace('.', ',')}
            </div>
          </div>

          <div className="pt-2 flex items-start gap-1.5 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span className="text-[11px]">
              {settings.address.street}, {settings.address.number} - {settings.address.neighbourhood}
            </span>
          </div>
        </div>

        {/* Ticket Perforated Cut line aesthetic */}
        <div className="relative flex items-center justify-between px-2 bg-slate-100 py-0.5">
          <div className="w-3 h-6 bg-[#F8FAFC] rounded-r-full -ml-3" />
          <div className="border-t-2 border-dashed border-slate-300 w-full mx-2" />
          <div className="w-3 h-6 bg-[#F8FAFC] rounded-l-full -mr-3" />
        </div>

        {/* Ticket Bottom Actions (All inside the system, no WhatsApp) */}
        <div className="p-4 sm:p-5 bg-white space-y-2.5">
          {/* View My Bookings in system */}
          <button
            type="button"
            onClick={onOpenMyBookings}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Ver Meus Agendamentos no Sistema</span>
          </button>

          {/* Add to Google Calendar */}
          <a
            href={createGoogleCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors text-center cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Salvar no Google Agenda</span>
          </a>

          {/* Reset button */}
          <button
            type="button"
            onClick={resetBookingFlow}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Fazer outro agendamento</span>
          </button>
        </div>
      </div>
    </div>
  );
}

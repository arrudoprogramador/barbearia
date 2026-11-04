export const defaultSettings = {
  fantasy_name: "Barbearia Ferreira",
  subtitle: "Especialistas em cortes modernos, degradê e barba alinhada",
  phone: "(11) 98765-4321",
  whatsapp: "5511987654321",
  instagram: "barbeariaferreira_oficial",
  avatar: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
  banner: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
  address: {
    street: "Estrada de Poá",
    number: "38",
    neighbourhood: "Guaianases",
    city: "São Paulo",
    state: "SP",
    maps_url: "https://maps.google.com/?q=Estrada+de+Poa+38+Guaianases+Sao+Paulo"
  },
  theme: {
    primary_color: "#0F172A", // Dark Slate luxury
    accent_color: "#D97706",  // Warm Amber / Barber Gold
    bg_style: "clean-light",
  },
  booking_rules: {
    slot_interval_minutes: 30, // interval calculation basis
    min_notice_hours: 1,      // advance notice
    cancellation_notice_hours: 12,
    cancellation_policy: "Reembolso até 12 hrs antes, sem devolução do sinal em caso de não comparecimento.",
    tolerance_late_minutes: 10,
    allow_client_cancel: true,
  },
  manual_messages: {
    appointment_confirmation: "Olá {cliente}, tudo bem?\n\nSeu agendamento na *{fantasia}* está confirmado!\n\n📅 *Data:* {data}\n⏰ *Horário:* {horario}\n✂️ *Serviço(s):* {servicos}\n💈 *Profissional:* {profissional}\n💰 *Valor Total:* {valor_total}\n📍 *Local:* {endereco}\n\n⚠️ *Atenção:* Tolerância máxima de {tolerancia} minutos de atraso.\nEstamos te aguardando!",
    cancellation: "Olá {cliente}, seu agendamento para {data} às {horario} foi cancelado com sucesso.\nEm caso de dúvidas, nos contate pelo WhatsApp: {whatsapp}.",
    reminder: "Olá {cliente}! Passando para lembrar do seu horário hoje ({data}) às {horario} na *{fantasia}*! Até já!",
  },
  admin_credentials: {
    password_hash: "admin123" // default password for admin panel, customizable
  }
};

export const defaultServices = [
  {
    id: "srv-corte",
    title: "CORTE",
    description: "Corte completo com tesoura e máquina, finalização com pomada e alinhamento impecável.",
    price: 35.00,
    duration: 35,
    category: "Cabelo",
    photo: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
    popular: true,
    active: true
  },
  {
    id: "srv-corte-barba",
    title: "CORTE & BARBA",
    description: "O combo mais pedido: corte estilizado completo + terapia de barba com toalha quente e navalha.",
    price: 50.00,
    duration: 50,
    category: "Combos",
    photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    popular: true,
    active: true
  },
  {
    id: "srv-barba",
    title: "BARBA COMPLETA",
    description: "Desenho da barba com navalha, toalha quente, pós-barba refrescante e hidratação com óleo nobre.",
    price: 20.00,
    duration: 25,
    category: "Barba",
    photo: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    popular: false,
    active: true
  },
  {
    id: "srv-nevou",
    title: "Corte + Nevou (Platinado)",
    description: "Descoloração global profissional com matização e corte moderno. Cabelo platinado de respeito.",
    price: 135.00,
    duration: 90,
    category: "Química",
    photo: "https://images.unsplash.com/photo-1517832606589-7629c3397143?auto=format&fit=crop&w=600&q=80",
    popular: false,
    active: true
  },
  {
    id: "srv-corte-luzes",
    title: "CORTE + LUZES",
    description: "Corte estilizado combinado com reflexos/luzes na touca, trazendo destaque e textura ao penteado.",
    price: 85.00,
    duration: 60,
    category: "Química",
    photo: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
    popular: false,
    active: true
  },
  {
    id: "srv-corte-alisamento",
    title: "Corte + Alisamento",
    description: "Corte degradê ou social acompanhado de alisamento capilar para redução total de volume.",
    price: 50.00,
    duration: 40,
    category: "Combos",
    photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    popular: false,
    active: true
  },
  {
    id: "srv-alisamento",
    title: "Alisamento",
    description: "Redução de volume e alinhamento dos fios com produto suave e acabamento natural.",
    price: 20.00,
    duration: 15,
    category: "Química",
    photo: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
    popular: false,
    active: true
  },
  {
    id: "srv-sobrancelha",
    title: "Sobrancelha na Navalha",
    description: "Alinhamento e limpeza do desenho da sobrancelha na navalha com precisão cirúrgica.",
    price: 10.00,
    duration: 5,
    category: "Acabamento",
    photo: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
    popular: false,
    active: true
  },
  {
    id: "srv-pezinho",
    title: "Pezinho & Acabamento",
    description: "Acabamento no contorno do cabelo, costeletas e nuca com navalhete.",
    price: 10.00,
    duration: 10,
    category: "Acabamento",
    photo: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
    popular: false,
    active: true
  }
];

export const defaultBarbers = [
  {
    id: "barber-1",
    name: "Bruno Vinicius da Silva Lopes",
    nickname: "Bruno Lopes",
    role: "Barbeiro Master & Proprietário",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    phone: "(11) 98765-4321",
    active: true,
    week_schedule: {
      monday: { day_on: false, opens_at: "10:00", closes_at: "19:00", lunch_start: "13:00", lunch_end: "14:30" },
      tuesday: { day_on: true, opens_at: "09:00", closes_at: "19:00", lunch_start: "13:00", lunch_end: "14:30" },
      wednesday: { day_on: true, opens_at: "09:00", closes_at: "19:30", lunch_start: "13:00", lunch_end: "14:30" },
      thursday: { day_on: true, opens_at: "09:00", closes_at: "19:30", lunch_start: "13:00", lunch_end: "14:30" },
      friday: { day_on: true, opens_at: "09:00", closes_at: "20:00", lunch_start: "13:00", lunch_end: "14:30" },
      saturday: { day_on: true, opens_at: "09:00", closes_at: "20:00", lunch_start: "13:00", lunch_end: "14:30" },
      sunday: { day_on: true, opens_at: "09:00", closes_at: "14:00", lunch_start: "", lunch_end: "" },
    }
  },
  {
    id: "barber-2",
    name: "Matheus Oliveira",
    nickname: "Matheus Fade",
    role: "Especialista em Degradê e Barba",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    phone: "(11) 97654-3210",
    active: true,
    week_schedule: {
      monday: { day_on: true, opens_at: "10:00", closes_at: "19:00", lunch_start: "13:00", lunch_end: "14:00" },
      tuesday: { day_on: true, opens_at: "09:00", closes_at: "19:00", lunch_start: "13:00", lunch_end: "14:00" },
      wednesday: { day_on: true, opens_at: "09:00", closes_at: "19:00", lunch_start: "13:00", lunch_end: "14:00" },
      thursday: { day_on: true, opens_at: "09:00", closes_at: "19:00", lunch_start: "13:00", lunch_end: "14:00" },
      friday: { day_on: true, opens_at: "09:00", closes_at: "20:00", lunch_start: "13:00", lunch_end: "14:00" },
      saturday: { day_on: true, opens_at: "09:00", closes_at: "20:00", lunch_start: "13:00", lunch_end: "14:00" },
      sunday: { day_on: false, opens_at: "09:00", closes_at: "14:00", lunch_start: "", lunch_end: "" },
    }
  }
];

export const sampleAppointments = [
  {
    id: "apt-101",
    client_name: "Lucas Gabriel",
    client_phone: "(11) 99887-1122",
    services: [
      { id: "srv-corte-barba", title: "CORTE & BARBA", price: 50.00, duration: 50 }
    ],
    barber_id: "barber-1",
    barber_name: "Bruno Vinicius da Silva Lopes",
    date: new Date().toISOString().split('T')[0], // today
    time: "10:30",
    total_price: 50.00,
    total_duration: 50,
    status: "confirmed", // pending, confirmed, completed, cancelled
    created_at: new Date().toISOString(),
    notes: "Degradê navalhado alto"
  },
  {
    id: "apt-102",
    client_name: "Rafael Mendes",
    client_phone: "(11) 98112-3344",
    services: [
      { id: "srv-corte", title: "CORTE", price: 35.00, duration: 35 }
    ],
    barber_id: "barber-1",
    barber_name: "Bruno Vinicius da Silva Lopes",
    date: new Date().toISOString().split('T')[0],
    time: "14:30",
    total_price: 35.00,
    total_duration: 35,
    status: "confirmed",
    created_at: new Date().toISOString(),
    notes: ""
  }
];


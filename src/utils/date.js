// Robust Date & Time utilities without timezone drift (Brazilian timezone safe)

export function getLocalDateString(d = new Date()) {
  const date = d instanceof Date ? d : new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateBR(dateString) {
  if (!dateString) return '';
  if (typeof dateString === 'string' && dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
  }
  return dateString;
}

export function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return -1;
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return -1;
  return h * 60 + m;
}

export function minutesToTime(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
}

// Checks if two intervals [start1, end1] and [start2, end2] overlap
export function intervalsOverlap(start1, end1, start2, end2) {
  return Math.max(start1, start2) < Math.min(end1, end2);
}


export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
export const DOW = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
export const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7; // Monday = 0
export const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);

const pad = (n: number) => String(n).padStart(2, '0');
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const formatLong = (d: Date) => `${DAYS_FULL[weekdayIndex(d)]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
export const formatMonthDayYear = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

// 30-minute slots starting at 9:00 AM
export const SLOT_COUNT = 15;
export const timeAt = (i: number) => {
  const total = 9 * 60 + i * 30;
  const h = Math.floor(total / 60);
  const m = total % 60;
  const h12 = h > 12 ? h - 12 : h;
  return `${h12}:${m === 0 ? '00' : '30'} ${h >= 12 ? 'PM' : 'AM'}`;
};
export const slotRange = (i: number) => `${timeAt(i)} - ${timeAt(i + 1)}`;
import dayjs from 'dayjs';
export const uid         = () => Math.random().toString(36).slice(2, 9);
export const fmtDate     = (s: string) => dayjs(s).format('DD/MM/YYYY');
export const serialLabel = (year: number, n: number) => `${year}-${String(n).padStart(3, '0')}`;
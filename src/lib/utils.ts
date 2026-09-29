import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const uid = (prefix = 'id') =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function formatDate(iso: string) {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortDate(iso: string) {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(iso: string, now = new Date()) {
  const d = new Date(iso);
  const diff = Math.max(0, now.getTime() - d.getTime());
  const min = Math.round(diff / 60000);
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const days = Math.round(h / 24);
  if (days < 30) return `hace ${days} d`;
  return formatShortDate(iso);
}

export const formatNumber = (n: number) => n.toLocaleString('es-CO');

export const protocolCode = (n: number) => `PROTOCOLO CREW #${String(n).padStart(3, '0')}`;
export const protocolShort = (n: number) => `#${String(n).padStart(3, '0')}`;

export function monthsLabel(months: number) {
  if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m ? `${y} ${y === 1 ? 'año' : 'años'} y ${m} m` : `${y} ${y === 1 ? 'año' : 'años'}`;
}

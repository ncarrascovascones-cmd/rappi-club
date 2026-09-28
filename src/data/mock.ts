/**
 * DATOS MOCK
 * ------------------------------------------------------------------
 * Contenido conceptual del prototipo. Los aliados son ficticios y
 * los beneficios son ejemplos: no representan acuerdos reales.
 */
import type { LevelId } from './config';

export const user = {
  firstName: 'Raúl',
  fullName: 'Raúl Torres',
  initials: 'RT',
  role: 'Rappitendero',
  benefitsUsed: 12,
  monthsInClub: 8,
  monthsAtCurrentLevel: 3,
  /** Zona de residencia usada por Ruta a Casa. */
  homeZoneId: 4,
};

/* ----------------------------- Zonas ----------------------------- */

export interface Zone {
  id: number;
  name: string;
  area: string;
}

export const zones: Zone[] = [
  { id: 1, name: 'Centro', area: 'Zona financiera y comercial' },
  { id: 2, name: 'Norte', area: 'Residencial y oficinas' },
  { id: 3, name: 'Oriente', area: 'Universidades y parques' },
  { id: 4, name: 'Sur', area: 'Residencial' },
  { id: 5, name: 'Occidente', area: 'Centros comerciales' },
];

/** Zonas preferidas iniciales, en orden: [principal, alternativa]. */
export const initialPreferredZones: number[] = [1, 3];

export const zoneLabel = (id: number) => {
  const z = zones.find((zone) => zone.id === id);
  return z ? `Zona ${z.id} — ${z.name}` : `Zona ${id}`;
};

/* --------------------------- Beneficios -------------------------- */

export type CategoryId = 'movilidad' | 'salud' | 'hogar' | 'familia' | 'entretenimiento';

export const categories: { id: CategoryId; label: string; emoji: string }[] = [
  { id: 'movilidad', label: 'Movilidad', emoji: '🚗' },
  { id: 'salud', label: 'Salud', emoji: '❤️' },
  { id: 'hogar', label: 'Vida cotidiana', emoji: '🏠' },
  { id: 'familia', label: 'Familia', emoji: '👨‍👩‍👧' },
  { id: 'entretenimiento', label: 'Entretenimiento', emoji: '🎬' },
];

export type BenefitIcon =
  | 'wrench'
  | 'droplets'
  | 'fuel'
  | 'shield'
  | 'stethoscope'
  | 'users'
  | 'pill'
  | 'basket'
  | 'store'
  | 'backpack'
  | 'graduation'
  | 'film'
  | 'popcorn';

export interface Benefit {
  id: string;
  category: CategoryId;
  title: string;
  /** Título corto para las tarjetas del Inicio. */
  shortTitle?: string;
  description: string;
  partnerId: string;
  minLevel: LevelId;
  icon: BenefitIcon;
  /** Marca el beneficio como ejemplo conceptual (p. ej. porcentajes). */
  conceptual?: boolean;
}

export const benefits: Benefit[] = [
  {
    id: 'mantenimiento',
    category: 'movilidad',
    title: '20% OFF en mantenimiento',
    description: 'Descuento en el mantenimiento preventivo de tu moto o bicicleta en talleres aliados.',
    partnerId: 'motor',
    minLevel: 'oro',
    icon: 'wrench',
    conceptual: true,
  },
  {
    id: 'aceite',
    category: 'movilidad',
    title: '15% OFF en cambio de aceite',
    description: 'Mantén tu vehículo al día con un descuento en el cambio de aceite.',
    partnerId: 'motor',
    minLevel: 'plata',
    icon: 'droplets',
    conceptual: true,
  },
  {
    id: 'combustible',
    category: 'movilidad',
    title: 'Descuentos en combustible',
    description: 'Precio preferencial por litro en estaciones aliadas.',
    partnerId: 'fuel',
    minLevel: 'bronce',
    icon: 'fuel',
  },
  {
    id: 'revision',
    category: 'movilidad',
    title: 'Revisión de seguridad sin costo',
    description: 'Revisión de frenos, luces y llantas una vez por trimestre.',
    partnerId: 'motor',
    minLevel: 'diamante',
    icon: 'shield',
  },
  {
    id: 'telemedicina',
    category: 'salud',
    title: 'Telemedicina',
    shortTitle: 'Telemedicina para ti y tu familia',
    description: 'Consultas médicas por videollamada, cuando las necesites.',
    partnerId: 'salud',
    minLevel: 'bronce',
    icon: 'stethoscope',
  },
  {
    id: 'familiar',
    category: 'salud',
    title: 'Beneficio familiar',
    description: 'Extiende la telemedicina a tu familia directa.',
    partnerId: 'salud',
    minLevel: 'oro',
    icon: 'users',
  },
  {
    id: 'farmacia',
    category: 'salud',
    title: 'Descuentos en farmacia',
    description: 'Precios especiales en medicamentos y cuidado personal.',
    partnerId: 'farma',
    minLevel: 'plata',
    icon: 'pill',
  },
  {
    id: 'mercado',
    category: 'hogar',
    title: 'Precios especiales en tu mercado',
    description: 'Descuentos en la canasta básica en supermercados aliados.',
    partnerId: 'mercado',
    minLevel: 'bronce',
    icon: 'basket',
  },
  {
    id: 'hogar',
    category: 'hogar',
    title: 'Descuentos para tu hogar',
    description: 'Ofertas en artículos esenciales para la casa.',
    partnerId: 'mercado',
    minLevel: 'plata',
    icon: 'store',
  },
  {
    id: 'utiles',
    category: 'familia',
    title: 'Descuentos en útiles escolares',
    description: 'Temporada escolar más ligera con precios especiales.',
    partnerId: 'educa',
    minLevel: 'plata',
    icon: 'backpack',
  },
  {
    id: 'cursos',
    category: 'familia',
    title: 'Cursos para ti y tu familia',
    description: 'Acceso a cursos cortos de formación y habilidades digitales.',
    partnerId: 'educa',
    minLevel: 'oro',
    icon: 'graduation',
  },
  {
    id: 'cine',
    category: 'entretenimiento',
    title: 'Descuentos en cine',
    description: 'Entradas con precio especial para tu día libre.',
    partnerId: 'cine',
    minLevel: 'bronce',
    icon: 'film',
  },
  {
    id: 'estrenos',
    category: 'entretenimiento',
    title: '2x1 en estrenos',
    description: 'Lleva a alguien contigo a los estrenos de la semana.',
    partnerId: 'cine',
    minLevel: 'diamante',
    icon: 'popcorn',
    conceptual: true,
  },
];

/** Beneficios destacados en el Inicio. */
export const featuredBenefitIds = ['mantenimiento', 'telemedicina', 'combustible'];

/* ----------------------------- Aliados --------------------------- */

export interface Partner {
  id: string;
  name: string;
  kind: string;
  /** Clases de color del logo conceptual. */
  tone: string;
  initials: string;
}

export const partners: Partner[] = [
  { id: 'motor', name: 'Aliado Motor', kind: 'Taller', tone: 'from-orange-400 to-red-500', initials: 'AM' },
  { id: 'salud', name: 'Salud+', kind: 'Clínica', tone: 'from-rose-400 to-pink-600', initials: 'S+' },
  { id: 'farma', name: 'Farma Cerca', kind: 'Farmacia', tone: 'from-emerald-400 to-teal-600', initials: 'FC' },
  { id: 'mercado', name: 'Mercado Club', kind: 'Supermercado', tone: 'from-lime-400 to-green-600', initials: 'MC' },
  { id: 'fuel', name: 'Ruta Fuel', kind: 'Combustible', tone: 'from-amber-400 to-orange-600', initials: 'RF' },
  { id: 'cine', name: 'Cine Club', kind: 'Cine', tone: 'from-violet-400 to-indigo-600', initials: 'CC' },
  { id: 'educa', name: 'Aprende+', kind: 'Educación', tone: 'from-sky-400 to-blue-600', initials: 'A+' },
];

export const getPartner = (id: string) => partners.find((p) => p.id === id);

/* --------------------- Comparativa por nivel --------------------- */

export const levelComparison: Record<LevelId, string[]> = {
  bronce: ['Beneficios básicos', 'Telemedicina', 'Descuentos en combustible y cine'],
  plata: ['Beneficios básicos', 'Mejores descuentos', 'Farmacia y útiles escolares'],
  oro: ['Beneficios premium', 'Mayor variedad de aliados', 'Salud para tu familia'],
  diamante: ['Beneficios exclusivos', 'Condiciones premium', 'Beneficios especiales'],
};

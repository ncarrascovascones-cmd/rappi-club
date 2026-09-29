import type {
  BenefitCategory,
  ClusterStatus,
  CopilotStatus,
  HelpCategory,
  HelpStatus,
  ProtocolStatus,
  Schedule,
  Vehicle,
} from './types';

export const HELP_CATEGORIES: {
  id: HelpCategory;
  label: string;
  short: string;
  hint: string;
  tone: 'brand' | 'sky' | 'sun' | 'grape' | 'mint' | 'ink';
}[] = [
  {
    id: 'cliente_no_responde',
    label: 'Cliente no responde',
    short: 'Cliente',
    hint: 'Llegaste y nadie contesta llamadas ni chat.',
    tone: 'brand',
  },
  {
    id: 'problema_pedido',
    label: 'Problema con pedido',
    short: 'Pedido',
    hint: 'Faltan productos, llegó dañado o no coincide.',
    tone: 'sky',
  },
  {
    id: 'problema_incentivo',
    label: 'Problema con incentivo',
    short: 'Incentivo',
    hint: 'Algo no se reflejó como esperabas.',
    tone: 'sun',
  },
  {
    id: 'demasiado_lejos',
    label: 'Me enviaron demasiado lejos',
    short: 'Distancia',
    hint: 'La entrega quedó fuera de tu zona habitual.',
    tone: 'grape',
  },
  {
    id: 'problema_tienda',
    label: 'Problema con tienda',
    short: 'Tienda',
    hint: 'Demoras, pedido no listo o mala recepción.',
    tone: 'mint',
  },
  {
    id: 'otro',
    label: 'Otro',
    short: 'Otro',
    hint: 'Cuéntanos cualquier otra situación.',
    tone: 'ink',
  },
];

export const categoryLabel = (c: HelpCategory) =>
  HELP_CATEGORIES.find((x) => x.id === c)?.label ?? c;
export const categoryShort = (c: HelpCategory) =>
  HELP_CATEGORIES.find((x) => x.id === c)?.short ?? c;
export const categoryTone = (c: HelpCategory) =>
  HELP_CATEGORIES.find((x) => x.id === c)?.tone ?? 'ink';

export const VEHICLE_LABEL: Record<Vehicle, string> = {
  moto: 'Moto',
  bici: 'Bicicleta',
  carro: 'Carro',
  a_pie: 'A pie',
};

export const SCHEDULE_LABEL: Record<Schedule, string> = {
  manana: 'Mañana',
  tarde: 'Tarde',
  noche: 'Noche',
  fin_de_semana: 'Fin de semana',
};

export const HELP_STATUS: Record<HelpStatus, { label: string; tone: 'sun' | 'sky' | 'mint' }> = {
  recibido: { label: 'Recibido', tone: 'sun' },
  en_revision: { label: 'En revisión', tone: 'sky' },
  resuelto: { label: 'Resuelto', tone: 'mint' },
};

export const PROTOCOL_STATUS: Record<
  ProtocolStatus,
  { label: string; tone: 'ink' | 'sun' | 'sky' | 'mint' }
> = {
  borrador: { label: 'Borrador', tone: 'ink' },
  en_validacion: { label: 'En validación', tone: 'sun' },
  aprobado: { label: 'Aprobado', tone: 'sky' },
  publicado: { label: 'Publicado', tone: 'mint' },
};

export const CLUSTER_STATUS: Record<
  ClusterStatus,
  { label: string; tone: 'brand' | 'sun' | 'sky' | 'grape' | 'mint' }
> = {
  detectado: { label: 'Patrón detectado', tone: 'brand' },
  en_analisis: { label: 'En análisis', tone: 'sun' },
  protocolo_en_borrador: { label: 'Protocolo en borrador', tone: 'grape' },
  en_validacion: { label: 'En validación', tone: 'sky' },
  publicado: { label: 'Protocolo publicado', tone: 'mint' },
};

export const COPILOT_STATUS: Record<CopilotStatus, { label: string; tone: 'mint' | 'sun' | 'ink' }> = {
  activo: { label: 'Activo', tone: 'mint' },
  pausa: { label: 'Pausado', tone: 'sun' },
  retirado: { label: 'No participa', tone: 'ink' },
};

export const BENEFIT_CATEGORIES: { id: BenefitCategory; label: string; blurb: string }[] = [
  { id: 'movilidad', label: 'Movilidad', blurb: 'Tu vehículo y tu seguridad en la vía.' },
  { id: 'salud', label: 'Salud', blurb: 'Cuidarte también es parte del trabajo.' },
  { id: 'familia', label: 'Familia', blurb: 'Para quienes te esperan en casa.' },
  { id: 'aprendizaje', label: 'Aprendizaje', blurb: 'Crecer dentro y fuera de la calle.' },
];

export const ZONES = [
  'Chapinero',
  'Usaquén',
  'Teusaquillo',
  'Cedritos',
  'Salitre',
  'Suba',
  'Kennedy',
  'Centro',
];

export const VOLUNTARY_RULE = 'Ser Copiloto es voluntario.';
export const VOLUNTARY_RULE_DETAIL = 'Puedes aceptar, pausar o dejar de participar sin penalización.';

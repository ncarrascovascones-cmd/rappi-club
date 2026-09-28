/**
 * CONFIGURACIÓN DEL PROTOTIPO
 * ------------------------------------------------------------------
 * Todos los valores de este archivo son CONCEPTUALES y existen solo
 * para demostrar la experiencia. No son datos oficiales de Rappi.
 * Cámbialos libremente: toda la app se recalcula a partir de aquí.
 */

export type LevelId = 'bronce' | 'plata' | 'oro' | 'diamante';

export interface LevelConfig {
  id: LevelId;
  name: string;
  emoji: string;
  /** Pedidos mínimos del periodo para estar en este nivel. */
  minOrders: number;
  tagline: string;
  description: string;
  highlights: string[];
}

/** Pedidos completados del periodo (valor DEMO). */
export const ordersCompleted = 850;

/** Pedidos del periodo anterior, para la comparación "+120 vs. periodo anterior". */
export const previousPeriodOrders = 730;

/**
 * Umbrales de nivel (valores de ejemplo).
 * Deben ir en orden ascendente. El último nivel es el más alto.
 */
export const LEVELS: LevelConfig[] = [
  {
    id: 'bronce',
    name: 'Bronce',
    emoji: '🥉',
    minOrders: 0,
    tagline: 'Beneficios esenciales',
    description: 'Tu punto de partida. Desde el primer día ya tienes beneficios.',
    highlights: ['Telemedicina', 'Descuentos en combustible', 'Descuentos en cine'],
  },
  {
    id: 'plata',
    name: 'Plata',
    emoji: '🥈',
    minOrders: 250,
    tagline: 'Más beneficios y mejores condiciones',
    description: 'Tu constancia se nota: más aliados y mejores descuentos.',
    highlights: ['Cambio de aceite con descuento', 'Descuentos en farmacia', 'Útiles escolares'],
  },
  {
    id: 'oro',
    name: 'Oro',
    emoji: '🥇',
    minOrders: 500,
    tagline: 'Beneficios premium',
    description: 'Beneficios premium para ti y para tu familia.',
    highlights: ['Mantenimiento de tu vehículo', 'Salud para tu familia', 'Mayor variedad de aliados'],
  },
  {
    id: 'diamante',
    name: 'Diamante',
    emoji: '💎',
    minOrders: 700,
    tagline: 'Beneficios exclusivos',
    description: 'El reconocimiento más alto del programa.',
    highlights: ['Beneficios exclusivos', 'Condiciones premium', 'Beneficios especiales'],
  },
];

/**
 * En el nivel más alto no hay "siguiente nivel", así que mostramos un
 * objetivo de referencia para que el progreso siga teniendo sentido.
 */
export const TOP_LEVEL_GOAL = 1000;

/** Máximo de zonas preferidas que puede elegir un rappitendero. */
export const MAX_PREFERRED_ZONES = 2;

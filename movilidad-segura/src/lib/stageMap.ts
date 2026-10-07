import type { MapPhase } from '../components/CityMap';
import type { Stage } from '../state/store';

/** Posición estática del vehículo en el mapa para cada etapa (sin animación). */
export function staticMapState(stage: Stage, approachNear = false): { phase: MapPhase; progress: number } {
  switch (stage) {
    case 'idle':
      return { phase: 'approach', progress: 0 };
    case 'approaching':
      return { phase: 'approach', progress: approachNear ? 0.75 : 0.35 };
    case 'boarded':
      return { phase: 'toSchool', progress: 0 };
    case 'enRoute':
      return { phase: 'toSchool', progress: 0.45 };
    case 'nearSchool':
      return { phase: 'toSchool', progress: 0.8 };
    case 'atSchool':
      return { phase: 'toSchool', progress: 1 };
    case 'pickedFromSchool':
      return { phase: 'toHome', progress: 0 };
    case 'returning':
      return { phase: 'toHome', progress: 0.45 };
    case 'nearHome':
      return { phase: 'toHome', progress: 0.8 };
    case 'delivered':
    case 'finished':
      return { phase: 'toHome', progress: 1 };
  }
}

/** Interpolación del tiempo estimado: de `start` minutos a 5 min en la geocerca y 0 al llegar. */
export function etaFor(progress: number, start: number, fence = 0.8) {
  if (progress <= fence) return Math.max(5, Math.round(start - (start - 5) * (progress / fence)));
  return Math.max(1, Math.round(5 * (1 - (progress - fence) / (1 - fence))));
}

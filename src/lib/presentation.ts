/** Guion de la demo de 40 segundos del Modo presentación (5 escenas). */

export type DemoView = 'nuevo' | 'admin';

export interface DemoStep {
  id: string;
  label: string;
  title: string;
  view: DemoView;
  /** Duración sugerida en segundos (suma ≈ 37 s, deja margen dentro de los 40 s). */
  seconds: number;
}

export const DEMO_STEPS: DemoStep[] = [
  { id: 'copiloto', label: 'Mi Copiloto', title: 'Nadie empieza solo', view: 'nuevo', seconds: 7 },
  { id: 'problema', label: 'Me pasa un problema', title: 'Necesito una mano', view: 'nuevo', seconds: 6 },
  { id: 'crew', label: 'Entra a la Crew', title: 'Mi experiencia se suma a la Crew', view: 'nuevo', seconds: 6 },
  { id: 'rappi', label: 'Rappi valida', title: 'Rappi convierte experiencias en protocolo', view: 'admin', seconds: 12 },
  { id: 'aprende', label: 'El siguiente aprende', title: 'El siguiente Rappitendero aprende', view: 'nuevo', seconds: 6 },
];

export const DEMO_TOTAL_SECONDS = DEMO_STEPS.reduce((a, s) => a + s.seconds, 0);

export const DEMO_CLOSING =
  'Una experiencia resuelta deja de ser un problema individual y se convierte en conocimiento para toda la Crew.';

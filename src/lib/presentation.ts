import { PRESENTATION_CLUSTER_ID, PRESENTATION_EXPERIENCE_IDS } from './demo-data';
import type { CrewState } from './store';
import type { Role } from './types';

export type PresentationAction = 'problem' | 'group' | 'create' | 'validate' | 'publish';

export interface PresentationStep {
  id: string;
  label: string;
  title: string;
  role: Role;
  href: (s: CrewState) => string;
  /** Qué contarle al jurado en este paso (una o dos frases). */
  say: string;
  action?: PresentationAction;
  actionLabel?: string;
}

export const PROBLEM_MESSAGE = 'Estoy en la puerta y el cliente no contesta 😰 ¿Qué hago?';
export const PROBLEM_REPLY =
  'Tranqui, a mí me pasó mil veces. Entra a “Necesito una mano”: ahí está el Protocolo Crew validado por Rappi para esto.';
export const PROBLEM_TEXT =
  'Llegué al edificio, llamé dos veces y el cliente no contesta. En portería no me dejan subir.';

export const presentationProtocolId = (s: CrewState) =>
  s.clusters.find((c) => c.id === PRESENTATION_CLUSTER_ID)?.protocolId ?? null;

export const PRESENTATION_STEPS: PresentationStep[] = [
  {
    id: 'nuevo',
    label: 'Nuevo Rappitendero',
    title: 'Valentina empieza',
    role: 'nuevo',
    href: () => '/inicio',
    say: 'Valentina lleva 9 días en la calle. Las primeras semanas son las más frágiles: si se aprende en soledad y a golpes, es más fácil abandonar.',
  },
  {
    id: 'copiloto',
    label: 'Copiloto',
    title: 'Un Copiloto voluntario la acompaña',
    role: 'nuevo',
    href: () => '/mi-copiloto',
    say: 'Andrés, con 3 años en su misma zona, decidió acompañar a Valentina. Es voluntario: puede aceptar, pausar o dejar de participar sin penalización. No es supervisor ni trabajador de Rappi.',
  },
  {
    id: 'problema',
    label: 'Problema',
    title: 'Aparece un problema en la calle',
    role: 'nuevo',
    href: () => '/mi-copiloto/chat',
    say: 'El cliente no responde. Valentina le escribe a su Copiloto, que comparte su experiencia y la lleva a la solución oficial.',
    action: 'problem',
    actionLabel: 'Enviar mensaje de Valentina',
  },
  {
    id: 'mano',
    label: 'Necesito una mano',
    title: 'Necesito una mano',
    role: 'nuevo',
    href: () => `/necesito-una-mano?c=cliente_no_responde&t=${encodeURIComponent(PROBLEM_TEXT)}`,
    say: 'Cuenta lo que pasó. La plataforma busca experiencias similares y el Protocolo Crew validado que aplica. Este ya existe porque otros pasaron por ahí antes. (Pulsa “Enviar”.)',
  },
  {
    id: 'admin',
    label: 'Administrador',
    title: 'Rappi ve lo que pasa en la calle',
    role: 'admin',
    href: () => '/admin',
    say: 'Del otro lado, Rappi recibe casos y experiencias. Este es el corazón: experiencia → varios comparten → patrón → solución → validación → Protocolo Crew.',
  },
  {
    id: 'analisis',
    label: 'Análisis de experiencias',
    title: 'Rappi identifica un patrón',
    role: 'admin',
    href: () => '/admin/experiencias?c=problema_tienda',
    say: 'Tres Rappitenderos contaron lo mismo: no encuentran el punto de recogida. Rappi agrupa sus experiencias e identifica el patrón.',
    action: 'group',
    actionLabel: `Agrupar ${PRESENTATION_EXPERIENCE_IDS.length} experiencias en un patrón`,
  },
  {
    id: 'protocolo',
    label: 'Protocolo Crew',
    title: 'Rappi propone la solución',
    role: 'admin',
    href: (s) => (presentationProtocolId(s) ? `/admin/protocolos/${presentationProtocolId(s)}` : `/admin/patrones#${PRESENTATION_CLUSTER_ID}`),
    say: 'Con lo que funcionó en la calle, Rappi redacta un Protocolo Crew. Los consejos no se convierten automáticamente en reglas oficiales.',
    action: 'create',
    actionLabel: 'Proponer solución y crear protocolo',
  },
  {
    id: 'validacion',
    label: 'Validación',
    title: 'Rappi valida',
    role: 'admin',
    href: (s) => `/admin/protocolos/${presentationProtocolId(s) ?? ''}`,
    say: 'El equipo de Rappi revisa que la solución sea correcta y segura, y la aprueba. Solo así obtiene el sello “Validado por Rappi”.',
    action: 'validate',
    actionLabel: 'Enviar a validación y aprobar',
  },
  {
    id: 'publicacion',
    label: 'Publicación',
    title: 'Se publica el Protocolo Crew',
    role: 'admin',
    href: (s) => `/admin/protocolos/${presentationProtocolId(s) ?? ''}`,
    say: 'Rappi publica el protocolo. Desde ahora está disponible para toda la flota.',
    action: 'publish',
    actionLabel: 'Publicar protocolo',
  },
  {
    id: 'visible',
    label: 'Visible para el Rappitendero',
    title: 'El siguiente Rappitendero aprende',
    role: 'nuevo',
    href: (s) => `/protocolos/${presentationProtocolId(s) ?? ''}`,
    say: 'El próximo nuevo ya no aprende a golpes: encuentra la solución validada, construida con experiencias reales. Conocimiento colectivo que acompaña la etapa inicial y ayuda a que se quede.',
  },
];

/** ¿La acción del paso ya está hecha? (las acciones son idempotentes). */
export function actionDone(action: PresentationAction, s: CrewState, threadId: string) {
  const pid = presentationProtocolId(s);
  const protocol = s.protocols.find((p) => p.id === pid);
  switch (action) {
    case 'problem':
      return (s.threads[threadId] ?? []).some((m) => m.text === PROBLEM_MESSAGE);
    case 'group':
      return s.clusters.find((c) => c.id === PRESENTATION_CLUSTER_ID)?.status !== 'detectado';
    case 'create':
      return !!pid;
    case 'validate':
      return protocol?.status === 'aprobado' || protocol?.status === 'publicado';
    case 'publish':
      return protocol?.status === 'publicado';
  }
}

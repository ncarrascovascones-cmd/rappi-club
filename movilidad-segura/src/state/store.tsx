import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { CHILD, INCIDENT_TYPES, ROUTE_KIDS, SCHOOL, type IncidentType } from '../data/mock';

/* ------------------------------------------------------------------ */
/* Etapas del recorrido                                                */
/* ------------------------------------------------------------------ */

export const STAGES = [
  'idle',
  'approaching',
  'boarded',
  'enRoute',
  'nearSchool',
  'atSchool',
  'pickedFromSchool',
  'returning',
  'nearHome',
  'delivered',
  'finished',
] as const;

export type Stage = (typeof STAGES)[number];

export const stageIdx = (s: Stage) => STAGES.indexOf(s);
export const atLeast = (s: Stage, min: Stage) => stageIdx(s) >= stageIdx(min);

/** Hora simulada que muestra la barra de estado en cada etapa. */
export const STAGE_CLOCK: Record<Stage, string> = {
  idle: '6:52',
  approaching: '7:04',
  boarded: '7:11',
  enRoute: '7:22',
  nearSchool: '7:36',
  atSchool: '7:41',
  pickedFromSchool: '2:35',
  returning: '2:51',
  nearHome: '3:07',
  delivered: '3:12',
  finished: '3:13',
};

/** Etiquetas del panel de simulación (pasos 1–9). */
export const DEMO_STEPS: { stage: Stage; label: string }[] = [
  { stage: 'approaching', label: 'Movilidad en camino' },
  { stage: 'boarded', label: 'Niño abordó' },
  { stage: 'enRoute', label: 'En ruta' },
  { stage: 'nearSchool', label: 'Cerca del colegio' },
  { stage: 'atSchool', label: 'Llegó al colegio' },
  { stage: 'pickedFromSchool', label: 'Recogido del colegio' },
  { stage: 'returning', label: 'Regreso a casa' },
  { stage: 'nearHome', label: 'Cerca de casa' },
  { stage: 'delivered', label: 'Niño entregado' },
];

/* ------------------------------------------------------------------ */
/* Notificaciones                                                      */
/* ------------------------------------------------------------------ */

export type NotifKind = 'info' | 'success' | 'alert' | 'incident';

export interface Notif {
  id: number;
  key: string;
  /** Etapa que la origina (-1 = independiente de la etapa, p. ej. incidencias). */
  stageIdx: number;
  kind: NotifKind;
  title: string;
  body: string;
  time: string;
}

interface Template {
  key: string;
  stage: Stage;
  kind: NotifKind;
  title: string;
  body: (s: State) => string;
  time: string;
}

const TEMPLATES: Template[] = [
  {
    key: 'approaching',
    stage: 'approaching',
    kind: 'info',
    title: 'Tu movilidad está en camino',
    body: () => `Carlos inició la ${CHILD.route}. Llegada estimada 7:11 a. m.`,
    time: '7:04 a. m.',
  },
  {
    key: 'approachNear',
    stage: 'approaching',
    kind: 'alert',
    title: 'La movilidad está a 5 minutos de llegar',
    body: () => `Prepárate para recibir a ${CHILD.firstName}.`,
    time: '7:06 a. m.',
  },
  {
    key: 'boarded',
    stage: 'boarded',
    kind: 'success',
    title: `${CHILD.firstName} abordó la movilidad`,
    body: () => 'Recogido a las 7:11 a. m. · Av. Demo 123',
    time: '7:11 a. m.',
  },
  {
    key: 'enRoute',
    stage: 'enRoute',
    kind: 'info',
    title: 'Viaje en curso',
    body: () => `${CHILD.firstName} está en camino a ${SCHOOL.name}. Llegada estimada 7:41 a. m.`,
    time: '7:22 a. m.',
  },
  {
    key: 'nearSchool',
    stage: 'nearSchool',
    kind: 'alert',
    title: 'La movilidad está llegando al colegio',
    body: () => 'Faltan aproximadamente 5 minutos.',
    time: '7:36 a. m.',
  },
  {
    key: 'atSchool',
    stage: 'atSchool',
    kind: 'success',
    title: `${CHILD.firstName} llegó al colegio`,
    body: () => 'Ingreso confirmado a las 7:41 a. m.',
    time: '7:41 a. m.',
  },
  {
    key: 'pickedFromSchool',
    stage: 'pickedFromSchool',
    kind: 'success',
    title: `${CHILD.firstName} fue recogido del colegio`,
    body: () => 'Abordó la movilidad a las 2:35 p. m.',
    time: '2:35 p. m.',
  },
  {
    key: 'returning',
    stage: 'returning',
    kind: 'info',
    title: `${CHILD.firstName} está regresando a casa`,
    body: () => 'Llegada estimada 3:12 p. m.',
    time: '2:51 p. m.',
  },
  {
    key: 'nearHome',
    stage: 'nearHome',
    kind: 'alert',
    title: 'La movilidad está a 5 minutos de casa',
    body: () => `Prepárate para recibir a ${CHILD.firstName}.`,
    time: '3:07 p. m.',
  },
  {
    key: 'delivered',
    stage: 'delivered',
    kind: 'success',
    title: `${CHILD.firstName} llegó a casa`,
    body: (s) => `Entrega confirmada · Recibido por ${s.receivedBy}`,
    time: '3:12 p. m.',
  },
];

/* ------------------------------------------------------------------ */
/* Estado                                                              */
/* ------------------------------------------------------------------ */

export type AlertKind = 'approach' | 'school' | 'home';
export type KidEvent = 'idaPick' | 'idaDrop' | 'regPick' | 'regDrop';

export interface Incident {
  id: number;
  type: IncidentType;
  label: string;
  detail: string;
  time: string;
}

export interface State {
  stage: Stage;
  /** La movilidad cruzó la geocerca de la casa durante la etapa "en camino". */
  approachNear: boolean;
  activeAlert: AlertKind | null;
  receivedBy: string;
  notifications: Notif[];
  lastReadId: number;
  /** Eventos registrados manualmente por el conductor para los demás niños. */
  kidEvents: Record<string, Partial<Record<KidEvent, string>>>;
  incidents: Incident[];
  autoplay: boolean;
  /** Se incrementa cuando el panel de simulación pide mostrar el viaje en el teléfono del padre. */
  focusSeq: number;
  seq: number;
}

const initialState: State = {
  stage: 'idle',
  approachNear: false,
  activeAlert: null,
  receivedBy: 'María Carrasco',
  notifications: [],
  lastReadId: 0,
  kidEvents: {},
  incidents: [],
  autoplay: false,
  focusSeq: 0,
  seq: 0,
};

export type Action =
  | { type: 'SET_STAGE'; stage: Stage; receivedBy?: string; focus?: boolean }
  | { type: 'APPROACH_NEAR' }
  | { type: 'DISMISS_ALERT' }
  | { type: 'KID_EVENT'; kidId: string; event: KidEvent; time: string }
  | { type: 'REPORT_INCIDENT'; incident: IncidentType; detail: string }
  | { type: 'MARK_READ' }
  | { type: 'SET_AUTOPLAY'; on: boolean }
  | { type: 'RESET' };

/** Asegura que existan las notificaciones de todas las etapas alcanzadas, y quita las de etapas futuras. */
function syncNotifications(s: State): State {
  const idx = stageIdx(s.stage);
  const kept = s.notifications.filter((n) => n.stageIdx <= idx || n.stageIdx < 0);
  let seq = s.seq;
  const added: Notif[] = [];
  for (const t of TEMPLATES) {
    const tIdx = stageIdx(t.stage);
    if (tIdx > idx) continue;
    if (t.key === 'approachNear' && s.stage === 'approaching' && !s.approachNear) continue;
    if (kept.some((n) => n.key === t.key)) continue;
    seq += 1;
    added.push({ id: seq, key: t.key, stageIdx: tIdx, kind: t.kind, title: t.title, body: t.body(s), time: t.time });
  }
  const notifications = [...kept, ...added];
  const lastReadId = Math.min(s.lastReadId, notifications.length ? Math.max(...notifications.map((n) => n.id)) : 0);
  return { ...s, notifications, seq, lastReadId };
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'SET_STAGE': {
      const activeAlert: AlertKind | null = a.stage === 'nearSchool' ? 'school' : a.stage === 'nearHome' ? 'home' : null;
      return syncNotifications({
        ...s,
        stage: a.stage,
        approachNear: false,
        activeAlert,
        receivedBy: a.receivedBy ?? (atLeast(a.stage, 'delivered') ? s.receivedBy : 'María Carrasco'),
        focusSeq: a.focus ? s.focusSeq + 1 : s.focusSeq,
      });
    }
    case 'APPROACH_NEAR':
      if (s.stage !== 'approaching' || s.approachNear) return s;
      return syncNotifications({ ...s, approachNear: true, activeAlert: 'approach' });
    case 'DISMISS_ALERT':
      return { ...s, activeAlert: null };
    case 'KID_EVENT':
      return { ...s, kidEvents: { ...s.kidEvents, [a.kidId]: { ...s.kidEvents[a.kidId], [a.event]: a.time } } };
    case 'REPORT_INCIDENT': {
      const label = INCIDENT_TYPES.find((i) => i.id === a.incident)!.label;
      const time = clockLabel(s.stage);
      const seq = s.seq + 1;
      const notif: Notif = {
        id: seq,
        key: `incident-${seq}`,
        stageIdx: -1,
        kind: 'incident',
        title: a.incident === 'emergencia' ? `Emergencia reportada en ${CHILD.route}` : `${label} en ${CHILD.route}`,
        body: a.detail,
        time,
      };
      return {
        ...s,
        seq,
        incidents: [{ id: seq, type: a.incident, label, detail: a.detail, time }, ...s.incidents],
        notifications: [...s.notifications, notif],
      };
    }
    case 'MARK_READ':
      return { ...s, lastReadId: s.seq };
    case 'SET_AUTOPLAY':
      return { ...s, autoplay: a.on };
    case 'RESET':
      return { ...initialState, focusSeq: s.focusSeq };
  }
}

export function clockLabel(stage: Stage) {
  const t = STAGE_CLOCK[stage];
  return `${t} ${atLeast(stage, 'pickedFromSchool') ? 'p. m.' : 'a. m.'}`;
}

/* ------------------------------------------------------------------ */
/* Estado de cada niño (vista del conductor)                           */
/* ------------------------------------------------------------------ */

export interface KidStatus {
  idaPick?: string;
  idaDrop?: string;
  regPick?: string;
  regDrop?: string;
}

export function kidStatus(s: State, kidId: string): KidStatus {
  const kid = ROUTE_KIDS.find((k) => k.id === kidId)!;
  const manual = s.kidEvents[kidId] ?? {};
  const isMateo = kidId === CHILD.id;
  const st = s.stage;
  return {
    idaPick: (isMateo ? atLeast(st, 'boarded') : atLeast(st, 'enRoute')) ? kid.pickupTime : manual.idaPick,
    idaDrop: atLeast(st, 'atSchool') ? '7:41 a. m.' : manual.idaDrop,
    regPick: atLeast(st, 'pickedFromSchool') ? '2:35 p. m.' : manual.regPick,
    regDrop: isMateo && atLeast(st, 'delivered') ? kid.dropTime : manual.regDrop,
  };
}

/* ------------------------------------------------------------------ */
/* Contexto + persistencia                                             */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'movilidad-segura-demo-v1';

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<State>;
    if (!parsed.stage || !STAGES.includes(parsed.stage)) return initialState;
    return { ...initialState, ...parsed, autoplay: false };
  } catch {
    return initialState;
  }
}

const Ctx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* almacenamiento no disponible: la demo sigue funcionando en memoria */
    }
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return ctx;
}

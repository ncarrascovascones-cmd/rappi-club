import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Clock,
  Gauge,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  Route,
  ShieldCheck,
  TriangleAlert,
  UserCheck,
} from 'lucide-react';
import { CityMap, type MapPhase } from '../../components/CityMap';
import { Avatar, DetailRow, Pill, Sheet, SuccessCheck } from '../../components/ui';
import { CHILD, DRIVER, SCHOOL } from '../../data/mock';
import { etaFor, staticMapState } from '../../lib/stageMap';
import { useAnimatedValue } from '../../lib/useAnimatedValue';
import { useStore, type Stage } from '../../state/store';
import type { ParentTab } from './ParentApp';

export function TripScreen({ go }: { go: (t: ParentTab) => void }) {
  const { state } = useStore();
  const st = state.stage;

  if (st === 'idle') return <PreTrip go={go} />;
  // La clave reinicia la animación cuando el panel de simulación salta de etapa.
  const k = state.focusSeq;
  if (st === 'approaching') return <LiveApproach key={k} go={go} />;
  if (st === 'enRoute' || st === 'nearSchool') return <LiveRoute key={`s${k}`} go={go} kind="toSchool" />;
  if (st === 'returning' || st === 'nearHome') return <LiveRoute key={`h${k}`} go={go} kind="toHome" />;
  return <Confirmation go={go} stage={st} />;
}

/* ------------------------------------------------------------------ */
/* Comunes                                                             */
/* ------------------------------------------------------------------ */

function MapHeader({ go, title }: { go: (t: ParentTab) => void; title: string }) {
  return (
    <div className="pt-sb pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-white/90 via-white/50 to-transparent px-4 pb-6">
      <button
        onClick={() => go('home')}
        className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-card"
        aria-label="Volver"
      >
        <ChevronLeft size={22} />
      </button>
      <span className="pointer-events-auto flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold shadow-card">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
        </span>
        {title}
      </span>
      <span className="w-11" />
    </div>
  );
}

function DriverRow() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface p-3">
      <Avatar initials={DRIVER.initials} size={42} tone="navy" />
      <div className="min-w-0 flex-1 text-[12.5px] leading-snug text-ink-3">
        <p className="text-[14px] font-semibold text-ink">Conductor: {DRIVER.name}</p>
        <p>Movilidad: {DRIVER.vehicle}</p>
        <p>
          Placa: <span className="font-semibold text-ink">{DRIVER.plate}</span>
        </p>
      </div>
      <button className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink-2 shadow-card" aria-label="Mensaje">
        <MessageCircle size={17} />
      </button>
      <button className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white shadow-glow" aria-label="Llamar">
        <Phone size={17} />
      </button>
    </div>
  );
}

function IncidentStrip() {
  const { state } = useStore();
  const last = state.incidents[0];
  if (!last) return null;
  return (
    <div className="mb-4 flex animate-fade-up items-start gap-3 rounded-2xl border border-warn-100 bg-warn-50 p-3 text-[12.5px]">
      <TriangleAlert size={18} className="mt-0.5 shrink-0 text-warn" />
      <span>
        <span className="block font-semibold text-ink">
          {last.label} reportado · {last.time}
        </span>
        <span className="text-ink-2">{last.detail}</span>
      </span>
    </div>
  );
}

function BottomCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 -mt-7 animate-sheet-up rounded-t-[30px] bg-white px-5 pb-6 pt-3 shadow-[0_-10px_30px_rgba(11,31,58,0.08)]">{children}</div>
  );
}

/* ------------------------------------------------------------------ */
/* Antes del viaje                                                     */
/* ------------------------------------------------------------------ */

function PreTrip({ go }: { go: (t: ParentTab) => void }) {
  const { dispatch } = useStore();
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <CityMap phase="approach" progress={0} className="absolute inset-0" />
        <MapHeader go={go} title="Ruta 04 · Programada" />
      </div>
      <BottomCard>
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
        <p className="eyebrow">Próximo viaje</p>
        <p className="mt-1 text-[34px] font-semibold tracking-tight tabular">7:00 a. m.</p>
        <p className="text-[14px] text-ink-3">
          Casa → {CHILD.school} · {CHILD.route}
        </p>
        <div className="mt-4">
          <DriverRow />
        </div>
        <button className="btn-primary mt-4 w-full" onClick={() => dispatch({ type: 'SET_STAGE', stage: 'approaching' })}>
          Ver viaje <ArrowRight size={18} />
        </button>
      </BottomCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pantalla 1–2: movilidad en camino + alerta de 5 minutos             */
/* ------------------------------------------------------------------ */

const FENCE = 0.75;

function LiveApproach({ go }: { go: (t: ParentTab) => void }) {
  const { state, dispatch } = useStore();
  const [fast, setFast] = useState(false);
  const current = useRef(0);
  const near = state.approachNear;
  const holding = near && !!state.activeAlert;

  let from = current.current;
  let to = FENCE;
  let duration = fast ? 1800 : 7000;
  let done: (() => void) | undefined = () => dispatch({ type: 'APPROACH_NEAR' });
  if (holding) {
    from = to = FENCE;
    duration = 0;
    done = undefined;
  } else if (near) {
    from = Math.max(current.current, FENCE);
    to = 1;
    duration = 2600;
    done = () => dispatch({ type: 'SET_STAGE', stage: 'boarded' });
  }

  const p = useAnimatedValue(from, to, duration, `${near}-${holding}-${fast}`, done);
  current.current = p;
  const eta = p >= FENCE ? Math.max(1, Math.round(5 * (1 - (p - FENCE) / (1 - FENCE)))) : Math.round(8 - 3 * (p / FENCE));

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <CityMap phase="approach" progress={p} activeFence={near ? 'home' : null} className="absolute inset-0" />
        <MapHeader go={go} title="En vivo" />
      </div>
      <BottomCard>
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
        <IncidentStrip />
        <div className="flex items-center justify-between">
          <Pill tone="blue" live>
            Movilidad en camino
          </Pill>
          <span className="text-[12px] font-medium text-ink-3">{CHILD.route}</span>
        </div>
        <h2 className="mt-3 text-[24px] font-semibold leading-tight tracking-tight">
          {near && !holding ? 'Tu movilidad está llegando' : 'Tu movilidad está en camino'}
        </h2>
        <p className="mt-1 text-[15px] text-ink-2">
          Llegará aproximadamente en{' '}
          <span className="font-semibold text-ink tabular">
            {eta} {eta === 1 ? 'minuto' : 'minutos'}
          </span>
        </p>
        <div className="mt-4">
          <DriverRow />
        </div>
        <button className="btn-primary mt-4 w-full" disabled={near} onClick={() => setFast(true)}>
          {near ? 'Llegando a tu casa…' : fast ? 'Siguiendo recorrido…' : 'Ver recorrido'}
          {!near && !fast && <Route size={18} />}
        </button>
      </BottomCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pantallas 4–5 y 7–8: viaje en curso + cerca del destino             */
/* ------------------------------------------------------------------ */

function LiveRoute({ go, kind }: { go: (t: ParentTab) => void; kind: 'toSchool' | 'toHome' }) {
  const { state, dispatch } = useStore();
  const toSchool = kind === 'toSchool';
  const nearStage: Stage = toSchool ? 'nearSchool' : 'nearHome';
  const arrived: Stage = toSchool ? 'atSchool' : 'delivered';
  const near = state.stage === nearStage;
  const holding = near && !!state.activeAlert;
  const current = useRef(0);

  let from = current.current;
  let to = 0.8;
  let duration = 9000;
  let done: (() => void) | undefined = () => dispatch({ type: 'SET_STAGE', stage: nearStage });
  if (holding) {
    from = to = Math.max(current.current, 0.8);
    duration = 0;
    done = undefined;
  } else if (near) {
    from = Math.max(current.current, 0.8);
    to = 1;
    duration = 3000;
    done = () => dispatch({ type: 'SET_STAGE', stage: arrived });
  }
  const p = useAnimatedValue(from, to, duration, `${kind}-${near}-${holding}`, done);
  current.current = p;

  const start = toSchool ? 18 : 22;
  const eta = etaFor(p, start);
  const phase: MapPhase = kind;

  const steps = toSchool
    ? [
        { t: 'Casa', d: 'Recogido · 7:11 a. m.', s: 'done' as const },
        { t: 'En ruta', d: near ? 'Ingresando a la geocerca' : 'Actual', s: 'current' as const },
        { t: 'Colegio', d: 'Pendiente', s: 'todo' as const },
      ]
    : [
        { t: 'Colegio', d: 'Recogido · 2:35 p. m.', s: 'done' as const },
        { t: 'En ruta', d: near ? 'Ingresando a la geocerca' : 'Actual', s: 'current' as const },
        { t: 'Casa', d: 'Pendiente', s: 'todo' as const },
      ];

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <CityMap phase={phase} progress={p} activeFence={near ? (toSchool ? 'school' : 'home') : null} className="absolute inset-0" />
        <MapHeader go={go} title="En vivo" />
      </div>
      <BottomCard>
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
        <IncidentStrip />
        <h2 className="text-[21px] font-semibold leading-tight tracking-tight">
          {toSchool ? `${CHILD.firstName} está en camino al colegio.` : `${CHILD.firstName} está regresando a casa`}
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface p-3.5">
            <p className="text-[12px] text-ink-3">Tiempo estimado</p>
            <p className="mt-0.5 text-[26px] font-semibold leading-none tracking-tight tabular">
              {eta} <span className="text-[15px] font-medium text-ink-3">min</span>
            </p>
          </div>
          <div className="rounded-2xl bg-surface p-3.5">
            <p className="text-[12px] text-ink-3">Estado</p>
            <p className="mt-1.5 flex items-center gap-2 text-[16px] font-semibold text-brand">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
              </span>
              En ruta
            </p>
          </div>
        </div>

        {/* Línea de progreso */}
        <div className="mt-5 flex items-start">
          {steps.map((s, i) => (
            <div key={s.t} className="relative flex flex-1 flex-col items-center text-center">
              {i > 0 && (
                <span
                  className={`absolute right-1/2 top-[13px] h-[3px] w-full -translate-x-[14px] rounded-full ${s.s === 'todo' ? 'bg-line' : 'bg-brand'}`}
                  style={{ width: 'calc(100% - 28px)' }}
                />
              )}
              <span
                className={`relative z-10 grid h-7 w-7 place-items-center rounded-full text-white ${
                  s.s === 'done' ? 'bg-ok' : s.s === 'current' ? 'bg-brand ring-4 ring-brand-100' : 'border-2 border-line bg-white'
                }`}
              >
                {s.s === 'done' && <Check size={15} strokeWidth={3} />}
                {s.s === 'current' && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
              <span className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink">{s.t}</span>
              <span className={`text-[11.5px] ${s.s === 'current' ? 'font-semibold text-brand' : s.s === 'done' ? 'text-ok-700' : 'text-ink-4'}`}>{s.d}</span>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <DriverRow />
        </div>
      </BottomCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Confirmaciones: abordaje, llegada, recojo en colegio y entrega      */
/* ------------------------------------------------------------------ */

function Confirmation({ go, stage }: { go: (t: ParentTab) => void; stage: Stage }) {
  const { state, dispatch } = useStore();
  const [summary, setSummary] = useState(false);
  const map = staticMapState(stage);

  const next = (s: Stage) => dispatch({ type: 'SET_STAGE', stage: s });
  const finish = () => {
    dispatch({ type: 'SET_AUTOPLAY', on: false });
    if (state.stage !== 'finished') dispatch({ type: 'SET_STAGE', stage: 'finished' });
    go('history');
  };

  // Recorrido automático: avanza solo tras unos segundos en cada confirmación.
  useEffect(() => {
    if (!state.autoplay) return;
    const t = setTimeout(() => {
      if (stage === 'boarded') next('enRoute');
      else if (stage === 'atSchool') next('pickedFromSchool');
      else if (stage === 'pickedFromSchool') next('returning');
      else if (stage === 'delivered' || stage === 'finished') finish();
    }, 3800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.autoplay, stage]);

  let body: ReactNode = null;
  let actions: ReactNode = null;

  if (stage === 'boarded') {
    body = (
      <>
        <Hero title={`${CHILD.firstName} abordó la movilidad`} time="7:11 a. m." />
        <div className="card mt-6 px-4">
          <DetailRow icon={<UserCheck size={17} />} label="Estado" value={<span className="text-ok">✓ {CHILD.firstName} fue recogido</span>} />
          <DetailRow icon={<Clock size={17} />} label="Hora" value="7:11 a. m." />
          <DetailRow icon={<MapPin size={17} />} label="Ubicación registrada" value="Av. Demo 123" />
          <DetailRow icon={<ShieldCheck size={17} />} label="Confirmado por" value={`${DRIVER.name} · conductor`} last />
        </div>
        <MiniMap focus="home" phase={map.phase} progress={map.progress} caption="Punto de abordaje · Miraflores" />
      </>
    );
    actions = (
      <button className="btn-primary w-full" onClick={() => next('enRoute')}>
        Ver viaje en vivo <ArrowRight size={18} />
      </button>
    );
  } else if (stage === 'atSchool') {
    body = (
      <>
        <Hero title={`${CHILD.firstName} llegó al colegio`} time="7:41 a. m." note="Su viaje de ida terminó correctamente." />
        <div className="card mt-6 px-4">
          <DetailRow icon={<MapPin size={17} />} label="Destino" value={SCHOOL.name} />
          <DetailRow icon={<Clock size={17} />} label="Duración" value="30 min" />
          <DetailRow icon={<ShieldCheck size={17} />} label="Ingreso" value={<span className="text-ok">✓ Confirmado</span>} last />
        </div>
        <MiniMap focus="school" phase={map.phase} progress={map.progress} caption="Llegada registrada · Santiago de Surco" />
      </>
    );
    actions = (
      <div className="grid grid-cols-2 gap-2.5">
        <button className="btn-ghost w-full px-3" onClick={() => setSummary(true)}>
          Ver resumen
        </button>
        <button className="btn-primary w-full px-3" onClick={() => next('pickedFromSchool')}>
          Ver regreso <ArrowRight size={18} />
        </button>
      </div>
    );
  } else if (stage === 'pickedFromSchool') {
    body = (
      <>
        <Hero title={`${CHILD.firstName} fue recogido del colegio`} time="2:35 p. m." note="✓ Recogido correctamente" />
        <div className="card mt-6 px-4">
          <DetailRow icon={<MapPin size={17} />} label="Ubicación registrada" value={SCHOOL.name} />
          <DetailRow icon={<Clock size={17} />} label="Llegada estimada a casa" value="3:12 p. m." />
          <DetailRow icon={<ShieldCheck size={17} />} label="Confirmado por" value={`${DRIVER.tutor.split(' ')[0]} · tutora`} last />
        </div>
        <MiniMap focus="school" phase={map.phase} progress={map.progress} caption="Salida del colegio · Santiago de Surco" />
      </>
    );
    actions = (
      <button className="btn-primary w-full" onClick={() => next('returning')}>
        Ver viaje en vivo <ArrowRight size={18} />
      </button>
    );
  } else {
    // delivered / finished
    body = (
      <>
        <Hero title={`${CHILD.firstName} llegó a casa`} time="3:12 p. m." note="Entrega confirmada" />
        <div className="card mt-6 p-5">
          <p className="text-[12px] text-ink-3">Recibido por:</p>
          <p className="mt-0.5 text-[18px] font-semibold">{state.receivedBy}</p>
          <div className="mt-4 border-t border-line pt-4">
            <p className="flex items-center gap-1.5 text-[12px] text-ink-3">
              <KeyRound size={14} /> Código de entrega
            </p>
            <div className="mt-2 flex items-center gap-2">
              {CHILD.deliveryCode.split('').map((d, i) => (
                <span key={i} className="grid h-12 w-11 place-items-center rounded-xl bg-surface text-[22px] font-semibold tabular">
                  {d}
                </span>
              ))}
              <Pill tone="green">✓ Verificado</Pill>
            </div>
          </div>
        </div>
        <MiniMap focus="home" phase={map.phase} progress={map.progress} caption="Entrega registrada · Av. Demo 123" />
      </>
    );
    actions = (
      <button className="btn-dark w-full" onClick={finish}>
        Finalizar viaje
      </button>
    );
  }

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="pt-sb min-h-0 flex-1 overflow-y-auto px-5 pb-6 no-scrollbar">
        <div className="flex items-center justify-between pt-1">
          <button onClick={() => go('home')} className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-card" aria-label="Volver">
            <ChevronLeft size={22} />
          </button>
          <span className="text-[13px] font-semibold text-ink-3">{stage === 'boarded' || stage === 'atSchool' ? 'Viaje de ida' : 'Viaje de regreso'}</span>
          <span className="w-11" />
        </div>
        <div key={stage}>{body}</div>
      </div>
      <div key={`a-${stage}`} className="animate-fade-up border-t border-line bg-white/90 px-5 pb-4 pt-3 backdrop-blur" style={{ animationDelay: '200ms' }}>
        {actions}
      </div>

      <Sheet open={summary} onClose={() => setSummary(false)} title="Resumen del viaje de ida">
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-ok-50 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ok text-white">
            <Check size={20} strokeWidth={3} />
          </span>
          <span>
            <span className="block text-[15px] font-semibold">Viaje completado sin incidencias</span>
            <span className="block text-[12.5px] text-ink-2">Miércoles 7 de octubre</span>
          </span>
        </div>
        <TimelineList
          items={[
            { t: '7:04 a. m.', d: 'Carlos inició la ruta' },
            { t: '7:06 a. m.', d: 'Alerta: movilidad a 5 minutos' },
            { t: '7:11 a. m.', d: 'Mateo abordó · Av. Demo 123' },
            { t: '7:36 a. m.', d: 'Ingreso a geocerca del colegio' },
            { t: '7:41 a. m.', d: 'Llegada confirmada · Colegio Demo' },
          ]}
        />
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { i: <Clock size={16} />, v: '30 min', l: 'Duración' },
            { i: <Route size={16} />, v: '8,2 km', l: 'Distancia' },
            { i: <Gauge size={16} />, v: '24 km/h', l: 'Vel. prom.' },
          ].map((x) => (
            <div key={x.l} className="rounded-2xl bg-surface p-3">
              <span className="mx-auto grid h-7 w-7 place-items-center text-ink-3">{x.i}</span>
              <p className="text-[15px] font-semibold">{x.v}</p>
              <p className="text-[11px] text-ink-3">{x.l}</p>
            </div>
          ))}
        </div>
        <button
          className="btn-primary mt-5 w-full"
          onClick={() => {
            setSummary(false);
            next('pickedFromSchool');
          }}
        >
          Ver viaje de regreso <ArrowRight size={18} />
        </button>
      </Sheet>
    </div>
  );
}

function Hero({ title, time, note }: { title: string; time: string; note?: string }) {
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <SuccessCheck size={104} />
      <h1 className="mt-5 animate-fade-up text-[25px] font-semibold leading-tight tracking-tight">{title}</h1>
      <p className="mt-2 animate-fade-up text-[34px] font-semibold tracking-tight text-ink tabular" style={{ animationDelay: '80ms' }}>
        {time}
      </p>
      {note && (
        <p className="mt-1 animate-fade-up text-[15px] font-medium text-ok-700" style={{ animationDelay: '140ms' }}>
          {note}
        </p>
      )}
    </div>
  );
}

function MiniMap({ phase, progress, caption, focus }: { phase: MapPhase; progress: number; caption: string; focus: 'home' | 'school' }) {
  return (
    <div className="card mt-4 overflow-hidden">
      <CityMap phase={phase} progress={progress} controls={false} focus={focus} showVehicle={false} className="h-[150px]" />
      <p className="flex items-center gap-2 px-4 py-3 text-[12.5px] font-medium text-ink-2">
        <MapPin size={14} className="text-brand" /> {caption}
      </p>
    </div>
  );
}

export function TimelineList({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ol className="relative">
      {items.map((it, i) => (
        <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
          {i < items.length - 1 && <span className="absolute left-[7px] top-4 h-full w-0.5 bg-line" />}
          <span className="relative mt-1 h-4 w-4 shrink-0 rounded-full border-[3px] border-white bg-ok ring-1 ring-ok/30" />
          <span className="flex-1 text-[13.5px]">
            <span className="font-semibold">{it.d}</span>
            <span className="block text-[12px] text-ink-3">{it.t}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

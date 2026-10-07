import { useEffect, useRef, useState } from 'react';
import { BellRing, CircleCheck, Info, Radar, TriangleAlert } from 'lucide-react';
import { LogoMark } from './ui';
import { CHILD, DRIVER } from '../data/mock';
import { useStore, type AlertKind, type Notif } from '../state/store';

/* ------------------------------------------------------------------ */
/* Banner tipo notificación push (aparece arriba dentro del teléfono)  */
/* ------------------------------------------------------------------ */

export function NotificationBanner({ onOpen }: { onOpen: () => void }) {
  const { state } = useStore();
  const maxId = state.notifications.reduce((m, n) => Math.max(m, n.id), 0);
  const seen = useRef(maxId);
  const [shown, setShown] = useState<Notif | null>(null);

  useEffect(() => {
    if (maxId > seen.current) {
      const latest = state.notifications.find((n) => n.id === maxId);
      // Las alertas de geocerca se muestran como modal grande; no duplicamos con banner.
      if (latest && latest.kind !== 'alert') setShown(latest);
    }
    seen.current = maxId;
  }, [maxId, state.notifications]);

  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setShown(null), 4200);
    return () => clearTimeout(t);
  }, [shown]);

  if (!shown) return null;
  return (
    <button
      key={shown.id}
      onClick={() => {
        setShown(null);
        onOpen();
      }}
      className="absolute inset-x-3 top-[calc(var(--sb,0px)+6px)] z-[80] flex animate-slide-down items-start gap-3 rounded-[22px] border border-white/60 bg-white/85 p-3 text-left shadow-lift backdrop-blur-xl"
    >
      <LogoMark size={36} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between text-[11px] font-medium text-ink-3">
          <span className="uppercase tracking-wide">Movilidad Segura</span>
          <span>ahora</span>
        </span>
        <span className="mt-0.5 block text-[14px] font-semibold leading-snug text-ink">{shown.title}</span>
        <span className="block truncate text-[13px] text-ink-2">{shown.body}</span>
      </span>
    </button>
  );
}

export const notifIcon = (kind: Notif['kind'], size = 18) =>
  kind === 'success' ? (
    <CircleCheck size={size} />
  ) : kind === 'alert' ? (
    <BellRing size={size} />
  ) : kind === 'incident' ? (
    <TriangleAlert size={size} />
  ) : (
    <Info size={size} />
  );

export const notifTone = (kind: Notif['kind']) =>
  kind === 'success'
    ? 'bg-ok-50 text-ok'
    : kind === 'alert'
      ? 'bg-brand-50 text-brand'
      : kind === 'incident'
        ? 'bg-warn-50 text-warn'
        : 'bg-surface text-ink-2';

/* ------------------------------------------------------------------ */
/* Alerta automática grande (geocercas)                                */
/* ------------------------------------------------------------------ */

const ALERT_COPY: Record<AlertKind, { title: string; body: string; meta: string }> = {
  approach: { title: 'La movilidad está a 5 minutos de llegar', body: `Prepárate para recibir a ${CHILD.firstName}.`, meta: 'Llegada estimada 7:11 a. m.' },
  school: { title: 'La movilidad está llegando al colegio', body: 'Faltan aproximadamente 5 minutos.', meta: 'Llegada estimada 7:41 a. m.' },
  home: { title: 'La movilidad está a 5 minutos de casa', body: `Prepárate para recibir a ${CHILD.firstName}.`, meta: 'Llegada estimada 3:12 p. m.' },
};

export function GeofenceAlert() {
  const { state, dispatch } = useStore();
  const kind = state.activeAlert;

  useEffect(() => {
    if (!kind || !state.autoplay) return;
    const t = setTimeout(() => dispatch({ type: 'DISMISS_ALERT' }), 3200);
    return () => clearTimeout(t);
  }, [kind, state.autoplay, dispatch]);

  if (!kind) return null;
  const c = ALERT_COPY[kind];
  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center p-5">
      <div className="absolute inset-0 animate-fade-in bg-navy/55 backdrop-blur-sm" />
      <div key={kind} className="relative w-full animate-scale-in rounded-[32px] bg-white p-6 pt-8 text-center shadow-lift">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-50">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-glow">
            <BellRing size={28} className="animate-ring" />
          </span>
        </span>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3">
          <Radar size={13} /> Alerta automática · Geocerca
        </span>
        <h2 className="mt-3 text-[23px] font-semibold leading-tight tracking-tight text-ink">{c.title}</h2>
        <p className="mt-2 text-[15px] text-ink-2">{c.body}</p>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-left text-[12.5px]">
          <span>
            <span className="block text-ink-3">
              {DRIVER.vehicle} · {DRIVER.plate}
            </span>
            <span className="block font-semibold text-ink">{c.meta}</span>
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 font-semibold text-brand shadow-card">{CHILD.route}</span>
        </div>
        <button className="btn-primary mt-5 w-full" onClick={() => dispatch({ type: 'DISMISS_ALERT' })}>
          Entendido
        </button>
      </div>
    </div>
  );
}

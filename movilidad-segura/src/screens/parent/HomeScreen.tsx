import { useState } from 'react';
import {
  ArrowRight,
  Bell,
  Bus,
  ChevronRight,
  Fingerprint,
  GraduationCap,
  KeyRound,
  MessageCircle,
  Phone,
  Radar,
  Repeat,
  Satellite,
  ShieldCheck,
} from 'lucide-react';
import { Avatar, Logo, Pill, Sheet } from '../../components/ui';
import { CHILD, DRIVER, PARENT } from '../../data/mock';
import { atLeast, useStore, type Stage } from '../../state/store';
import type { ParentTab } from './ParentApp';

const STATUS: Record<Stage, { label: string; tone: 'blue' | 'green' | 'gray'; live?: boolean }> = {
  idle: { label: 'Próximo viaje', tone: 'gray' },
  approaching: { label: 'Movilidad en camino', tone: 'blue', live: true },
  boarded: { label: 'A bordo', tone: 'green', live: true },
  enRoute: { label: 'En ruta al colegio', tone: 'blue', live: true },
  nearSchool: { label: 'Llegando al colegio', tone: 'blue', live: true },
  atSchool: { label: 'En el colegio', tone: 'green' },
  pickedFromSchool: { label: 'A bordo', tone: 'green', live: true },
  returning: { label: 'Regresando a casa', tone: 'blue', live: true },
  nearHome: { label: 'Llegando a casa', tone: 'blue', live: true },
  delivered: { label: 'En casa', tone: 'green' },
  finished: { label: 'En casa', tone: 'green' },
};

export function HomeScreen({ go, onSwitchProfile, unread }: { go: (t: ParentTab) => void; onSwitchProfile: () => void; unread: number }) {
  const { state, dispatch } = useStore();
  const [menu, setMenu] = useState(false);
  const st = state.stage;
  const status = STATUS[st];
  const afternoon = atLeast(st, 'pickedFromSchool');
  const active = st !== 'idle' && st !== 'atSchool' && !atLeast(st, 'delivered');

  const openTrip = () => {
    if (st === 'idle') dispatch({ type: 'SET_STAGE', stage: 'approaching' });
    go(st === 'finished' ? 'history' : 'trip');
  };

  let tripLabel = 'Próximo viaje';
  let tripTime = '7:00 a. m.';
  let tripSub = `Ida · Casa → ${CHILD.school}`;
  let cta = 'Ver viaje';
  if (active) {
    tripLabel = 'Viaje en curso';
    tripTime = afternoon ? 'Regreso' : 'Ida';
    tripSub = afternoon ? `${CHILD.school} → Casa` : `Casa → ${CHILD.school}`;
    cta = 'Ver viaje en vivo';
  } else if (st === 'atSchool') {
    tripLabel = 'Próximo viaje';
    tripTime = '2:35 p. m.';
    tripSub = `Regreso · ${CHILD.school} → Casa`;
    cta = 'Ver viaje';
  } else if (atLeast(st, 'delivered')) {
    tripLabel = 'Viajes de hoy';
    tripTime = 'Completados';
    tripSub = 'Ida y regreso confirmados';
    cta = st === 'finished' ? 'Ver historial' : 'Ver entrega';
  }

  return (
    <div className="pt-sb h-full overflow-y-auto pb-6 no-scrollbar">
      {/* Cabecera */}
      <header className="flex items-center justify-between px-5 pb-2 pt-2">
        <Logo compact />
        <div className="flex items-center gap-2">
          <button
            onClick={() => go('alerts')}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-ink-2 shadow-card"
            aria-label="Alertas"
          >
            <Bell size={19} />
            {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand ring-2 ring-white" />}
          </button>
          <button onClick={() => setMenu(true)} aria-label="Perfil">
            <Avatar initials={PARENT.initials} size={40} />
          </button>
        </div>
      </header>

      <section className="animate-fade-up px-5 pt-4">
        <p className="text-[14px] text-ink-3">Miércoles 7 de octubre</p>
        <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight">
          {afternoon ? 'Buenas tardes' : 'Buenos días'}, {PARENT.firstName}
        </h1>
      </section>

      {/* Tarjeta del hijo */}
      <section className="mt-5 px-5">
        <div className="card animate-fade-up overflow-hidden" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center gap-4 p-5">
            <Avatar initials={CHILD.initials} size={56} tone="blue" />
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] font-semibold tracking-tight">{CHILD.fullName}</h2>
              <p className="mb-1.5 text-[13px] text-ink-3">{CHILD.grade}</p>
              <Pill tone={status.tone} live={status.live}>
                Estado: {status.label}
              </Pill>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t border-line">
            <div className="flex items-center gap-2.5 border-r border-line px-5 py-3.5">
              <GraduationCap size={17} className="text-ink-4" />
              <span>
                <span className="block text-[11px] text-ink-3">Colegio</span>
                <span className="block text-[13.5px] font-semibold">{CHILD.school}</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3.5">
              <Bus size={17} className="text-ink-4" />
              <span>
                <span className="block text-[11px] text-ink-3">Movilidad</span>
                <span className="block text-[13.5px] font-semibold">{CHILD.route}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Próximo viaje / viaje en curso */}
      <section className="mt-4 px-5">
        <div className="relative animate-fade-up overflow-hidden rounded-3xl bg-navy p-5 text-white shadow-lift" style={{ animationDelay: '120ms' }}>
          <RouteLines />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60">{tripLabel}</span>
              {active && (
                <Pill tone="dark" live>
                  En vivo
                </Pill>
              )}
            </div>
            <p className="mt-2 text-[38px] font-semibold leading-none tracking-tight tabular">{tripTime}</p>
            <p className="mt-2 text-[14px] text-white/70">{tripSub}</p>
            <button onClick={openTrip} className="btn mt-5 h-12 w-full bg-white text-[15px] text-navy hover:bg-brand-50">
              {cta} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Conductor */}
      <section className="mt-4 px-5">
        <div className="card flex animate-fade-up items-center gap-3 p-4" style={{ animationDelay: '180ms' }}>
          <Avatar initials={DRIVER.initials} size={46} tone="slate" />
          <div className="min-w-0 flex-1">
            <p className="text-[14.5px] font-semibold">Conductor: {DRIVER.name}</p>
            <p className="text-[12.5px] text-ink-3">{DRIVER.vehicle}</p>
            <p className="text-[12.5px] text-ink-3">
              Placa <span className="font-semibold text-ink">{DRIVER.plate}</span>
            </p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-surface text-ink-2" aria-label="Mensaje">
            <MessageCircle size={18} />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand" aria-label="Llamar">
            <Phone size={18} />
          </button>
        </div>
      </section>

      {/* Seguridad activa */}
      <section className="mt-6 px-5">
        <p className="eyebrow mb-3">Protección activa</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Satellite, t: 'GPS en tiempo real', d: 'Ubicación cada 5 s' },
            { icon: Radar, t: 'Geocercas', d: 'Casa y colegio' },
            { icon: Fingerprint, t: 'Abordaje verificado', d: 'Registro con hora y lugar' },
            { icon: KeyRound, t: 'Entrega con código', d: 'Solo personas autorizadas' },
          ].map(({ icon: Icon, t, d }, i) => (
            <div key={t} className="card animate-fade-up p-4" style={{ animationDelay: `${220 + i * 50}ms` }}>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand">
                <Icon size={18} />
              </span>
              <p className="mt-3 text-[13.5px] font-semibold leading-tight">{t}</p>
              <p className="mt-0.5 text-[12px] text-ink-3">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <button onClick={() => go('history')} className="card flex w-full items-center gap-3 p-4 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ok-50 text-ok">
            <ShieldCheck size={20} />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold">Historial de viajes</span>
            <span className="block text-[12.5px] text-ink-3">26 viajes este mes · 98 % puntual</span>
          </span>
          <ChevronRight size={18} className="text-ink-4" />
        </button>
      </section>

      <Sheet open={menu} onClose={() => setMenu(false)} title="Mi cuenta">
        <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
          <Avatar initials={PARENT.initials} size={48} />
          <div>
            <p className="font-semibold">{PARENT.fullName}</p>
            <p className="text-[13px] text-ink-3">Padre de {CHILD.fullName}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setMenu(false);
            onSwitchProfile();
          }}
          className="btn-ghost mt-4 w-full"
        >
          <Repeat size={18} /> Cambiar de perfil
        </button>
      </Sheet>
    </div>
  );
}

function RouteLines() {
  return (
    <svg className="pointer-events-none absolute -right-6 -top-4 h-[160px] w-[220px] opacity-[0.18]" viewBox="0 0 220 160" fill="none">
      <path d="M10 140 C 60 140, 60 80, 110 80 S 160 20, 210 20" stroke="#fff" strokeWidth="2" strokeDasharray="3 6" />
      <circle cx="10" cy="140" r="5" fill="#fff" />
      <circle cx="210" cy="20" r="5" fill="#fff" />
      <circle cx="110" cy="80" r="9" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

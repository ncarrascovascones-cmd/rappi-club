import { useEffect, useState } from 'react';
import { Bus, Check, Circle, Clock, List, Map as MapIcon, Repeat, TriangleAlert, Users } from 'lucide-react';
import { CityMap } from '../../components/CityMap';
import { Avatar, Pill, ScreenTitle, Sheet } from '../../components/ui';
import { DRIVER, ROUTE_KIDS, type Kid } from '../../data/mock';
import { staticMapState } from '../../lib/stageMap';
import { atLeast, clockLabel, kidStatus, useStore } from '../../state/store';
import { DeliverSheet, IncidentSheet, PickupSheet } from './DriverSheets';

type Tab = 'route' | 'map' | 'incidents';
export type TripMode = 'ida' | 'regreso';
export type SheetTarget = { kid: Kid; mode: TripMode };

export function DriverApp({ onSwitchProfile }: { onSwitchProfile: () => void }) {
  const { state } = useStore();
  const [tab, setTab] = useState<Tab>('route');
  const autoMode: TripMode = atLeast(state.stage, 'atSchool') ? 'regreso' : 'ida';
  const [mode, setMode] = useState<TripMode>(autoMode);
  // El modo se fija al abrir la hoja para que no cambie a mitad de una confirmación.
  const [pickup, setPickup] = useState<SheetTarget | null>(null);
  const [deliver, setDeliver] = useState<SheetTarget | null>(null);
  const [incident, setIncident] = useState(false);
  const [menu, setMenu] = useState(false);

  // Cambia solo a «Regreso» cuando la ruta de ida termina (o vuelve a «Ida» al reiniciar).
  useEffect(() => setMode(autoMode), [autoMode]);

  const statuses = ROUTE_KIDS.map((k) => ({ kid: k, st: kidStatus(state, k.id) }));
  const picked = statuses.filter(({ st }) => (mode === 'ida' ? st.idaPick : st.regPick)).length;
  const dropped = statuses.filter(({ st }) => (mode === 'ida' ? st.idaDrop : st.regDrop)).length;

  return (
    <div className="relative flex h-full flex-col bg-surface">
      <div className="relative min-h-0 flex-1 overflow-y-auto no-scrollbar">
        {tab === 'route' && (
          <>
            {/* Cabecera */}
            <header className="pt-sb relative overflow-hidden bg-navy px-5 pb-6 text-white">
              <svg className="pointer-events-none absolute -right-10 top-6 h-48 w-64 opacity-[0.12]" viewBox="0 0 260 190" fill="none">
                <path d="M0 170h80v-80h90V20h90" stroke="#fff" strokeWidth="2" strokeDasharray="4 7" />
                <circle cx="80" cy="170" r="6" fill="#fff" />
                <circle cx="170" cy="90" r="6" fill="#fff" />
              </svg>
              <div className="relative flex items-center justify-between pt-2">
                <button onClick={() => setMenu(true)} className="flex items-center gap-2.5 text-left">
                  <Avatar initials={DRIVER.initials} size={38} tone="blue" />
                  <span>
                    <span className="block text-[13.5px] font-semibold">{DRIVER.fullName}</span>
                    <span className="block text-[11.5px] text-white/60">Conductor · Tutora: {DRIVER.tutor}</span>
                  </span>
                </button>
                <Pill tone="dark" live>
                  GPS activo
                </Pill>
              </div>

              <p className="relative mt-6 text-[13px] font-medium text-white/60">Ruta de hoy</p>
              <div className="relative mt-1 flex items-end justify-between">
                <div>
                  <h1 className="text-[34px] font-semibold leading-none tracking-tight">Ruta 04</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-[14px] text-white/80">
                    <Users size={15} /> 8 niños · <Bus size={15} /> {DRIVER.plate}
                  </p>
                </div>
                <div className="flex rounded-xl bg-white/10 p-1 text-[12.5px] font-semibold">
                  {(['ida', 'regreso'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`rounded-lg px-3 py-1.5 transition ${mode === m ? 'bg-white text-navy' : 'text-white/70'}`}
                    >
                      {m === 'ida' ? 'Ida' : 'Regreso'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mt-5 grid grid-cols-2 gap-2.5">
                <Stat label="Recogidos" value={picked} />
                <Stat label="Entregados" value={dropped} />
              </div>
            </header>

            <div className="px-5 pt-4">
              <button onClick={() => setIncident(true)} className="btn h-12 w-full border border-warn-100 bg-warn-50 text-[14.5px] text-warn hover:bg-warn-100">
                <TriangleAlert size={18} /> Reportar incidencia
              </button>
            </div>

            <div className="flex items-center justify-between px-5 pb-2 pt-5">
              <p className="eyebrow">{mode === 'ida' ? 'Recojo en casa → Colegio Demo' : 'Colegio Demo → Entrega en casa'}</p>
              <span className="flex items-center gap-1 text-[12px] text-ink-3 tabular">
                <Clock size={13} /> {clockLabel(state.stage)}
              </span>
            </div>

            <ul className="space-y-2.5 px-5 pb-6">
              {statuses.map(({ kid, st }, i) => {
                const pick = mode === 'ida' ? st.idaPick : st.regPick;
                const drop = mode === 'ida' ? st.idaDrop : st.regDrop;
                // En el regreso solo se puede recoger cuando la ida terminó.
                const canPick = !pick && (mode === 'ida' || !!st.idaDrop);
                const isMateo = kid.id === 'mateo';
                return (
                  <li key={kid.id} className={`card animate-fade-up p-4 ${isMateo ? 'ring-1 ring-brand-100' : ''}`} style={{ animationDelay: `${i * 35}ms` }}>
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${drop ? 'bg-ok text-white' : pick ? 'bg-brand text-white' : 'border-2 border-line text-transparent'}`}
                      >
                        {drop || pick ? <Check size={15} strokeWidth={3} /> : <Circle size={10} />}
                      </span>
                      <Avatar initials={kid.initials} size={40} tone={isMateo ? 'blue' : 'slate'} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold">{kid.name}</p>
                        <p className="truncate text-[12.5px] text-ink-3">
                          {drop
                            ? `Entregado · ${drop}`
                            : pick
                              ? `Recogido · ${pick}`
                              : mode === 'ida'
                                ? `${kid.address} · ${kid.pickupTime}`
                                : `Entrega ${kid.dropTime}`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        disabled={!canPick}
                        onClick={() => setPickup({ kid, mode })}
                        className={`btn h-10 rounded-xl text-[13.5px] disabled:bg-surface disabled:text-ink-4 ${pick ? 'disabled:!bg-brand-50 disabled:!text-brand-700 disabled:!opacity-100' : 'bg-brand text-white hover:bg-brand-600'}`}
                      >
                        {pick && <Check size={15} strokeWidth={3} />} Recogido
                      </button>
                      <button
                        disabled={!pick || !!drop}
                        onClick={() => setDeliver({ kid, mode })}
                        className={`btn h-10 rounded-xl text-[13.5px] disabled:bg-surface disabled:text-ink-4 disabled:opacity-100 ${drop ? 'disabled:!bg-ok-50 disabled:!text-ok-700' : 'bg-navy text-white hover:bg-navy-800'}`}
                      >
                        {drop && <Check size={15} strokeWidth={3} />} Entregado
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {tab === 'map' && <DriverMap />}
        {tab === 'incidents' && <IncidentList onNew={() => setIncident(true)} />}
      </div>

      <nav className="pb-hb relative z-20 grid grid-cols-3 border-t border-line bg-white/95 px-2 pt-2 backdrop-blur">
        {[
          { id: 'route' as const, label: 'Ruta', icon: List },
          { id: 'map' as const, label: 'Mapa', icon: MapIcon },
          { id: 'incidents' as const, label: 'Incidencias', icon: TriangleAlert },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-col items-center gap-1 py-1 text-[11px] font-semibold ${tab === id ? 'text-brand' : 'text-ink-4'}`}
          >
            <Icon size={22} strokeWidth={tab === id ? 2.3 : 2} />
            {label}
          </button>
        ))}
      </nav>

      <PickupSheet target={pickup} onClose={() => setPickup(null)} />
      <DeliverSheet target={deliver} onClose={() => setDeliver(null)} />
      <IncidentSheet open={incident} onClose={() => setIncident(false)} />

      <Sheet open={menu} onClose={() => setMenu(false)} title="Mi cuenta">
        <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
          <Avatar initials={DRIVER.initials} size={48} />
          <div>
            <p className="font-semibold">{DRIVER.fullName}</p>
            <p className="text-[13px] text-ink-3">
              {DRIVER.model} · {DRIVER.plate}
            </p>
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/[0.08] p-3.5">
      <p className="text-[12px] text-white/60">{label}</p>
      <p className="mt-1 text-[22px] font-semibold leading-none tabular">
        {value}
        <span className="text-[14px] font-medium text-white/50"> / 8</span>
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${(value / 8) * 100}%` }} />
      </div>
    </div>
  );
}

function DriverMap() {
  const { state } = useStore();
  const m = staticMapState(state.stage, state.approachNear);
  const next = atLeast(state.stage, 'pickedFromSchool')
    ? 'Entrega: Av. Demo 123'
    : atLeast(state.stage, 'boarded')
      ? 'Destino: Colegio Demo'
      : 'Siguiente parada: Av. Demo 123';
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <CityMap phase={m.phase} progress={m.progress} className="absolute inset-0" />
      </div>
      <div className="relative z-10 -mt-6 rounded-t-[28px] bg-white p-5 shadow-[0_-10px_30px_rgba(11,31,58,0.08)]">
        <p className="eyebrow">Navegación</p>
        <p className="mt-1 text-[18px] font-semibold">{next}</p>
        <p className="mt-1 text-[13px] text-ink-3">Tu ubicación se comparte con las 8 familias mientras la ruta está activa.</p>
      </div>
    </div>
  );
}

function IncidentList({ onNew }: { onNew: () => void }) {
  const { state } = useStore();
  return (
    <div className="pt-sb pb-8">
      <ScreenTitle title="Incidencias" subtitle="Registro de la Ruta 04" />
      <div className="px-5">
        <button onClick={onNew} className="btn-dark w-full">
          <TriangleAlert size={18} /> Reportar incidencia
        </button>
        {state.incidents.length === 0 ? (
          <p className="mt-8 text-center text-[14px] text-ink-3">Sin incidencias reportadas hoy.</p>
        ) : (
          <ul className="mt-5 space-y-2.5">
            {state.incidents.map((i) => (
              <li key={i.id} className="card flex items-start gap-3 p-4">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${i.type === 'emergencia' ? 'bg-danger-50 text-danger' : 'bg-warn-50 text-warn'}`}
                >
                  <TriangleAlert size={18} />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{i.label}</span>
                  <span className="block text-[13px] text-ink-2">{i.detail}</span>
                  <span className="mt-1 block text-[12px] text-ink-4">{i.time} · Notificado a 8 familias</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

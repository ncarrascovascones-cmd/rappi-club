import { useState, type ReactNode } from 'react';
import { ArrowRight, Check, ChevronRight, Clock, Gauge, KeyRound, Route, TriangleAlert } from 'lucide-react';
import { ScreenTitle, Sheet } from '../../components/ui';
import { PAST_DAYS, type HistoryTrip } from '../../data/mock';
import { atLeast, useStore } from '../../state/store';
import { TimelineList } from './TripScreen';

type Status = 'done' | 'live' | 'scheduled';

export function HistoryScreen() {
  const { state } = useStore();
  const st = state.stage;
  const [detail, setDetail] = useState<HistoryTrip | null>(null);

  const idaStatus: Status = atLeast(st, 'atSchool') ? 'done' : atLeast(st, 'approaching') ? 'live' : 'scheduled';
  const regStatus: Status = atLeast(st, 'delivered') ? 'done' : atLeast(st, 'pickedFromSchool') ? 'live' : 'scheduled';

  const today: (HistoryTrip & { status: Status })[] = [
    {
      id: 't-ida',
      kind: 'ida',
      from: '7:00 a. m.',
      to: '7:41 a. m.',
      pickup: '7:11 a. m.',
      drop: '7:41 a. m.',
      duration: '30 min',
      distance: '8,2 km',
      incidents: 0,
      status: idaStatus,
    },
    {
      id: 't-reg',
      kind: 'regreso',
      from: '2:35 p. m.',
      to: '3:12 p. m.',
      pickup: '2:35 p. m.',
      drop: '3:12 p. m.',
      receivedBy: state.receivedBy,
      duration: '37 min',
      distance: '8,4 km',
      incidents: state.incidents.length,
      status: regStatus,
    },
  ];

  return (
    <div className="pt-sb h-full overflow-y-auto pb-8 no-scrollbar">
      <ScreenTitle title="Historial de viajes" subtitle="Mateo Carrasco · Ruta 04" />

      <div className="grid grid-cols-3 gap-2.5 px-5">
        {[
          { v: '26', l: 'Viajes este mes' },
          { v: '98 %', l: 'Puntualidad' },
          { v: '100 %', l: 'Entregas verificadas' },
        ].map((x) => (
          <div key={x.l} className="card p-3.5">
            <p className="text-[20px] font-semibold tracking-tight">{x.v}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-ink-3">{x.l}</p>
          </div>
        ))}
      </div>

      <Day label="Hoy" date="Miércoles 7 de octubre">
        {today.map((t) => (
          <TripRow key={t.id} trip={t} status={t.status} onClick={() => t.status === 'done' && setDetail(t)} />
        ))}
      </Day>

      {PAST_DAYS.map((d) => (
        <Day key={d.label} label={d.label} date={d.date}>
          {d.trips.map((t) => (
            <TripRow key={t.id} trip={t} status="done" onClick={() => setDetail(t)} />
          ))}
        </Day>
      ))}

      <Sheet open={!!detail} onClose={() => setDetail(null)} title={detail ? `Viaje de ${detail.kind === 'ida' ? 'ida' : 'regreso'}` : ''}>
        {detail && (
          <>
            <div className="mb-4 flex items-center gap-2 text-[15px] font-semibold">
              {detail.kind === 'ida' ? 'Casa' : 'Colegio Demo'} <ArrowRight size={16} className="text-ink-4" />{' '}
              {detail.kind === 'ida' ? 'Colegio Demo' : 'Casa'}
            </div>
            <TimelineList
              items={
                detail.kind === 'ida'
                  ? [
                      { t: detail.pickup, d: 'Abordaje confirmado · Av. Demo 123' },
                      { t: detail.drop, d: 'Llegada confirmada · Colegio Demo' },
                    ]
                  : [
                      { t: detail.pickup, d: 'Recogido del colegio' },
                      { t: detail.drop, d: `Entregado a ${detail.receivedBy ?? 'María Carrasco'}` },
                    ]
              }
            />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { i: <Clock size={16} />, v: detail.duration, l: 'Duración' },
                { i: <Route size={16} />, v: detail.distance, l: 'Distancia' },
                { i: detail.incidents ? <TriangleAlert size={16} /> : <Gauge size={16} />, v: String(detail.incidents), l: 'Incidencias' },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl bg-surface p-3">
                  <span className="mx-auto grid h-7 w-7 place-items-center text-ink-3">{x.i}</span>
                  <p className="text-[15px] font-semibold">{x.v}</p>
                  <p className="text-[11px] text-ink-3">{x.l}</p>
                </div>
              ))}
            </div>
            {detail.kind === 'regreso' && (
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-ok-50 p-3 text-[13px] font-medium text-ok-700">
                <KeyRound size={16} /> Entrega verificada con código
              </p>
            )}
          </>
        )}
      </Sheet>
    </div>
  );
}

function Day({ label, date, children }: { label: string; date: string; children: ReactNode }) {
  return (
    <section className="mt-6 px-5">
      <div className="mb-2.5 flex items-baseline justify-between">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink">{label}</h2>
        <span className="text-[12px] text-ink-3">{date}</span>
      </div>
      <div className="card divide-y divide-line">{children}</div>
    </section>
  );
}

function TripRow({ trip, status, onClick }: { trip: HistoryTrip; status: Status; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 p-4 text-left">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
          status === 'done' ? 'bg-ok-50 text-ok' : status === 'live' ? 'bg-brand-50 text-brand' : 'bg-surface text-ink-4'
        }`}
      >
        {status === 'done' ? (
          <Check size={19} strokeWidth={3} />
        ) : status === 'live' ? (
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand" />
        ) : (
          <Clock size={18} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{trip.kind === 'ida' ? 'Ida' : 'Regreso'}</span>
        <span className="block whitespace-nowrap text-[13px] text-ink-2 tabular">
          {status === 'scheduled' ? trip.from : status === 'live' ? `Desde ${trip.from}` : `${trip.from} → ${trip.to}`}
        </span>
        <span
          className={`mt-0.5 flex items-center gap-1.5 text-[12.5px] font-semibold ${status === 'done' ? 'text-ok-700' : status === 'live' ? 'text-brand' : 'text-ink-4'}`}
        >
          {status === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />}
          {status === 'done' ? 'Completado' : status === 'live' ? 'En curso' : 'Programado'}
        </span>
      </span>
      {status === 'done' && <ChevronRight size={16} className="text-ink-4" />}
    </button>
  );
}

import { useEffect, useState } from 'react';
import {
  BellRing,
  Car,
  Check,
  ChevronRight,
  Clock,
  Delete,
  KeyRound,
  MapPin,
  Navigation,
  Phone,
  Route,
  ShieldCheck,
  Siren,
  Timer,
  TrafficCone,
  UserRound,
  Wrench,
} from 'lucide-react';
import { DetailRow, LogoMark, Pill, Sheet, SuccessCheck } from '../../components/ui';
import { CHILD, INCIDENT_TYPES, RECEIVERS, SCHOOL, type IncidentType, type Kid } from '../../data/mock';
import { atLeast, useStore } from '../../state/store';
import type { SheetTarget } from './DriverApp';

const first = (k: Kid) => k.name.split(' ')[0];
const isMateo = (k: Kid) => k.id === CHILD.id;

/* ------------------------------------------------------------------ */
/* Recogido                                                            */
/* ------------------------------------------------------------------ */

export function PickupSheet({ target, onClose }: { target: SheetTarget | null; onClose: () => void }) {
  const { state, dispatch } = useStore();

  // Registro automático de hora y ubicación al tocar «Recogido».
  useEffect(() => {
    if (!target) return;
    const { kid, mode } = target;
    if (isMateo(kid)) {
      const stage = mode === 'ida' ? 'boarded' : 'pickedFromSchool';
      if (!atLeast(state.stage, stage)) dispatch({ type: 'SET_STAGE', stage });
    } else {
      dispatch({ type: 'KID_EVENT', kidId: kid.id, event: mode === 'ida' ? 'idaPick' : 'regPick', time: mode === 'ida' ? kid.pickupTime : '2:35 p. m.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target) return null;
  const { kid, mode } = target;
  const time = mode === 'ida' ? kid.pickupTime : '2:35 p. m.';
  const place = mode === 'ida' ? kid.address : SCHOOL.name;

  return (
    <Sheet open onClose={onClose}>
      <div className="flex flex-col items-center pt-2 text-center">
        <SuccessCheck size={84} />
        <h3 className="mt-4 text-[22px] font-semibold tracking-tight">{first(kid)} recogido</h3>
        <span className="mt-2">
          <Pill tone="green">✓ Estado actualizado</Pill>
        </span>
      </div>

      <p className="eyebrow mt-6">Registrado automáticamente</p>
      <div className="mt-1 px-1">
        <DetailRow icon={<Clock size={17} />} label="Hora" value={time} />
        <DetailRow icon={<MapPin size={17} />} label="Ubicación" value={place} />
        <DetailRow
          icon={<Navigation size={17} />}
          label="Coordenadas GPS"
          value={<span className="tabular">{mode === 'ida' ? '-12.1219, -77.0301' : '-12.1102, -76.9893'}</span>}
          last
        />
      </div>

      <NotifiedPreview
        to={kid.parent}
        title={mode === 'ida' ? `${first(kid)} abordó la movilidad` : `${first(kid)} fue recogido del colegio`}
        body={`${time} · ${place}`}
      />

      <button className="btn-primary mt-5 w-full" onClick={onClose}>
        Listo
      </button>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Entregado                                                           */
/* ------------------------------------------------------------------ */

type Step = 'who' | 'code' | 'done';

export function DeliverSheet({ target, onClose }: { target: SheetTarget | null; onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [step, setStep] = useState<Step>('who');
  const [who, setWho] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setStep('who');
    setWho(null);
    setCode('');
    setError(false);
    // En la ida, la entrega es en el colegio: se registra directamente.
    if (target?.mode === 'ida') {
      const { kid } = target;
      if (isMateo(kid)) {
        if (!atLeast(state.stage, 'atSchool')) dispatch({ type: 'SET_STAGE', stage: 'atSchool' });
      } else dispatch({ type: 'KID_EVENT', kidId: kid.id, event: 'idaDrop', time: '7:41 a. m.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target) return null;
  const { kid, mode } = target;

  if (mode === 'ida') {
    return (
      <Sheet open onClose={onClose}>
        <div className="flex flex-col items-center pt-2 text-center">
          <SuccessCheck size={84} />
          <h3 className="mt-4 text-[22px] font-semibold tracking-tight">{first(kid)} entregado</h3>
          <p className="mt-1 text-[14px] text-ink-3">Ingreso registrado en {SCHOOL.name}</p>
        </div>
        <div className="mt-5 px-1">
          <DetailRow icon={<Clock size={17} />} label="Hora" value="7:41 a. m." />
          <DetailRow icon={<MapPin size={17} />} label="Ubicación" value={SCHOOL.name} />
          <DetailRow icon={<ShieldCheck size={17} />} label="Recibido por" value="Recepción del colegio" last />
        </div>
        <NotifiedPreview to={kid.parent} title={`${first(kid)} llegó al colegio`} body="Ingreso confirmado a las 7:41 a. m." />
        <button className="btn-primary mt-5 w-full" onClick={onClose}>
          Listo
        </button>
      </Sheet>
    );
  }

  const options = RECEIVERS.map((r) => ({
    ...r,
    name: isMateo(kid) ? r.name : r.id === 'mama' ? kid.parent : r.id === 'papa' ? `Papá de ${first(kid)}` : 'Registrada en la app',
  }));
  const receiverName = options.find((o) => o.id === who)?.name ?? '';

  const press = (d: string) => {
    if (code.length >= 4) return;
    const next = code + d;
    setCode(next);
    setError(false);
    if (next.length === 4) {
      if (next === kid.code) {
        setTimeout(() => {
          setStep('done');
          if (isMateo(kid)) dispatch({ type: 'SET_STAGE', stage: 'delivered', receivedBy: receiverName });
          else dispatch({ type: 'KID_EVENT', kidId: kid.id, event: 'regDrop', time: kid.dropTime });
        }, 250);
      } else {
        setTimeout(() => {
          setError(true);
          setCode('');
        }, 250);
      }
    }
  };

  return (
    <Sheet open onClose={onClose}>
      {step === 'who' && (
        <div className="animate-fade-in">
          <p className="eyebrow">{first(kid)} entregado</p>
          <h3 className="mt-1 text-[22px] font-semibold tracking-tight">¿Quién recibió al niño?</h3>
          <div className="mt-4 space-y-2.5">
            {options.map((o) => (
              <button
                key={o.id}
                onClick={() => setWho(o.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${who === o.id ? 'border-brand bg-brand-50' : 'border-line bg-white hover:bg-surface'}`}
              >
                <span className={`grid h-10 w-10 place-items-center rounded-full ${who === o.id ? 'bg-brand text-white' : 'bg-surface text-ink-2'}`}>
                  <UserRound size={18} />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold">{o.label}</span>
                  <span className="block text-[12.5px] text-ink-3">{o.name}</span>
                </span>
                <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${who === o.id ? 'border-brand bg-brand text-white' : 'border-line'}`}>
                  {who === o.id && <Check size={13} strokeWidth={3} />}
                </span>
              </button>
            ))}
          </div>
          <button className="btn-primary mt-5 w-full" disabled={!who} onClick={() => setStep('code')}>
            Continuar <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 'code' && (
        <div className="animate-fade-in">
          <p className="eyebrow">Entrega a {receiverName}</p>
          <h3 className="mt-1 text-[22px] font-semibold tracking-tight">Código de entrega</h3>
          <p className="mt-1 text-[13.5px] text-ink-3">Pide el código de 4 dígitos que aparece en la app de la familia.</p>
          <div key={error ? 'e' : 'ok'} className={`mt-5 flex justify-center gap-3 ${error ? 'animate-shake' : ''}`}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`grid h-16 w-14 place-items-center rounded-2xl border-2 text-[26px] font-semibold tabular transition ${
                  error
                    ? 'border-danger/50 bg-danger-50'
                    : code[i]
                      ? 'border-brand bg-brand-50'
                      : i === code.length
                        ? 'border-brand/50 bg-white'
                        : 'border-line bg-surface'
                }`}
              >
                {code[i] ?? ''}
              </span>
            ))}
          </div>
          <p className={`mt-3 text-center text-[13px] ${error ? 'font-semibold text-danger' : 'text-ink-3'}`}>
            {error ? (
              'Código incorrecto. Inténtalo de nuevo.'
            ) : (
              <>
                Código de demostración: <span className="font-semibold text-ink tabular">{kid.code}</span>
              </>
            )}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k, i) =>
              k === '' ? (
                <span key={i} />
              ) : (
                <button
                  key={i}
                  onClick={() => (k === 'del' ? setCode((c) => c.slice(0, -1)) : press(k))}
                  className="grid h-14 place-items-center rounded-2xl bg-surface text-[22px] font-semibold transition hover:bg-line active:scale-95"
                  aria-label={k === 'del' ? 'Borrar' : k}
                >
                  {k === 'del' ? <Delete size={22} /> : k}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="animate-fade-in">
          <div className="flex flex-col items-center pt-2 text-center">
            <SuccessCheck size={88} />
            <h3 className="mt-4 text-[23px] font-semibold tracking-tight">✓ Entrega confirmada</h3>
            <p className="mt-1 text-[14px] text-ink-3">{first(kid)} fue entregado de forma segura.</p>
          </div>
          <div className="mt-5 px-1">
            <DetailRow icon={<UserRound size={17} />} label="Recibido por" value={receiverName} />
            <DetailRow icon={<Clock size={17} />} label="Hora" value={kid.dropTime} />
            <DetailRow icon={<KeyRound size={17} />} label="Código" value={<span className="tabular text-ok">{kid.code} ✓</span>} last />
          </div>
          <NotifiedPreview to={kid.parent} title={`${first(kid)} llegó a casa`} body={`Entrega confirmada · Recibido por ${receiverName}`} />
          <button className="btn-primary mt-5 w-full" onClick={onClose}>
            Listo
          </button>
        </div>
      )}
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Incidencias                                                         */
/* ------------------------------------------------------------------ */

const INCIDENT_ICON: Record<IncidentType, typeof Timer> = {
  retraso: Timer,
  trafico: TrafficCone,
  ruta: Route,
  vehiculo: Wrench,
  emergencia: Siren,
};

const DELAYS = [10, 15, 20];

function detailFor(type: IncidentType, delay: number) {
  switch (type) {
    case 'retraso':
      return `La Ruta 04 tiene un retraso estimado de ${delay} minutos.`;
    case 'trafico':
      return 'Tráfico intenso en Av. Javier Prado. Posible retraso de 5 a 10 minutos.';
    case 'ruta':
      return 'Desvío por obras en Av. Primavera. La ruta se actualizó automáticamente.';
    case 'vehiculo':
      return 'Problema con el vehículo. La central coordina una unidad de reemplazo.';
    case 'emergencia':
      return 'El conductor activó el protocolo de emergencia. La central de monitoreo ya fue notificada.';
  }
}

export function IncidentSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useStore();
  const [type, setType] = useState<IncidentType | null>(null);
  const [delay, setDelay] = useState(10);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setType(null);
      setSent(false);
      setDelay(10);
    }
  }, [open]);

  const meta = INCIDENT_TYPES.find((i) => i.id === type);
  const emergency = type === 'emergencia';

  return (
    <Sheet open={open} onClose={onClose} title={sent ? undefined : type ? meta!.label : 'Reportar incidencia'}>
      {!type && (
        <div className="animate-fade-in">
          <p className="-mt-2 mb-4 text-[14px] text-ink-3">Selecciona una incidencia:</p>
          <div className="space-y-2">
            {INCIDENT_TYPES.map((i) => {
              const Icon = INCIDENT_ICON[i.id];
              const red = i.id === 'emergencia';
              return (
                <button
                  key={i.id}
                  onClick={() => setType(i.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-line p-3.5 text-left transition hover:bg-surface"
                >
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${red ? 'bg-danger-50 text-danger' : 'bg-warn-50 text-warn'}`}>
                    <Icon size={19} />
                  </span>
                  <span className="flex-1">
                    <span className={`block text-[15px] font-semibold ${red ? 'text-danger' : ''}`}>{i.label}</span>
                    <span className="block text-[12.5px] text-ink-3">{i.desc}</span>
                  </span>
                  <ChevronRight size={18} className="text-ink-4" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {type && !sent && (
        <div className="animate-fade-in">
          {type === 'retraso' && (
            <>
              <p className="text-[13px] font-medium text-ink-3">Tiempo estimado de retraso</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {DELAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDelay(d)}
                    className={`h-12 rounded-2xl border text-[15px] font-semibold transition ${delay === d ? 'border-brand bg-brand-50 text-brand-700' : 'border-line'}`}
                  >
                    +{d} min
                  </button>
                ))}
              </div>
            </>
          )}
          <div className={`mt-4 flex items-start gap-3 rounded-2xl p-4 ${emergency ? 'bg-danger-50' : 'bg-brand-50'}`}>
            <BellRing size={20} className={`mt-0.5 shrink-0 ${emergency ? 'text-danger' : 'text-brand'}`} />
            <p className="text-[14px] text-ink">
              <span className="font-semibold">
                {emergency ? 'Se notificará a los padres y a la central de monitoreo.' : 'Se notificará automáticamente a los padres.'}
              </span>
              <span className="mt-1 block text-[13px] text-ink-2">{detailFor(type, delay)}</span>
            </p>
          </div>
          <p className="mt-3 flex items-center gap-2 text-[12.5px] text-ink-3">
            <Car size={14} /> Se adjunta ubicación GPS actual y hora del reporte.
          </p>
          <button
            className={`btn mt-5 h-14 w-full text-[15px] text-white ${emergency ? 'bg-danger hover:bg-danger/90' : 'bg-brand shadow-glow hover:bg-brand-600'}`}
            onClick={() => {
              dispatch({ type: 'REPORT_INCIDENT', incident: type, detail: detailFor(type, delay) });
              setSent(true);
            }}
          >
            <BellRing size={18} /> Enviar alerta
          </button>
          {emergency && (
            <button className="btn-ghost mt-3 w-full">
              <Phone size={18} /> Llamar a la central
            </button>
          )}
          <button className="mt-3 w-full py-2 text-[14px] font-semibold text-ink-3" onClick={() => setType(null)}>
            Elegir otra incidencia
          </button>
        </div>
      )}

      {sent && (
        <div className="animate-fade-in">
          <div className="flex flex-col items-center pt-2 text-center">
            <SuccessCheck size={84} />
            <h3 className="mt-4 text-[22px] font-semibold tracking-tight">Alerta enviada</h3>
            <p className="mt-1 text-[14px] text-ink-3">Notificamos a las 8 familias de la Ruta 04{emergency ? ' y a la central de monitoreo' : ''}.</p>
          </div>
          <NotifiedPreview to="8 familias" title={`${meta!.label} en Ruta 04`} body={detailFor(type!, delay)} />
          <button className="btn-primary mt-5 w-full" onClick={onClose}>
            Listo
          </button>
        </div>
      )}
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Vista previa de la notificación que recibe la familia               */
/* ------------------------------------------------------------------ */

function NotifiedPreview({ to, title, body }: { to: string; title: string; body: string }) {
  return (
    <div className="mt-5 rounded-3xl bg-surface p-3.5">
      <p className="mb-2.5 flex items-center gap-1.5 px-1 text-[12px] font-semibold text-ok-700">
        <Check size={14} strokeWidth={3} /> Notificación enviada a {to}
      </p>
      <div className="flex animate-slide-down items-start gap-3 rounded-2xl bg-white p-3 shadow-card">
        <LogoMark size={34} />
        <span className="min-w-0 flex-1">
          <span className="flex justify-between text-[10.5px] font-medium uppercase tracking-wide text-ink-3">
            <span>Movilidad Segura</span>
            <span className="normal-case">ahora</span>
          </span>
          <span className="block text-[13.5px] font-semibold leading-snug">{title}</span>
          <span className="block truncate text-[12.5px] text-ink-2">{body}</span>
        </span>
      </div>
    </div>
  );
}

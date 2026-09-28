import { House, MapPin, Navigation, Power } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RouteMap } from '../components/RouteMap';
import { Disclaimer } from '../components/Section';
import { user, zoneLabel } from '../data/mock';

const steps = [
  { icon: Power, text: 'Activas Ruta a Casa al terminar tu jornada.' },
  { icon: Navigation, text: 'Cuando la operación lo permita, priorizamos pedidos en dirección a tu zona.' },
  { icon: House, text: 'Cada entrega te acerca un poco más a casa.' },
];

interface RouteHomePageProps {
  active: boolean;
  onToggle: () => void;
  onBack: () => void;
}

export function RouteHomePage({ active, onToggle, onBack }: RouteHomePageProps) {
  return (
    <div className="space-y-5">
      <PageHeader title="Ruta a Casa" onBack={onBack} />

      <div className="-mt-3 animate-fade-up">
        <p className="text-[22px] font-extrabold tracking-tight">¿Terminando tu jornada?</p>
        <p className="mt-1 text-[14.5px] leading-relaxed text-ink-500">
          Cuando la operación lo permita, Ruta a Casa te ayuda a acercarte.
        </p>
      </div>

      <div className="card animate-fade-up overflow-hidden p-2" style={{ animationDelay: '80ms' }}>
        <RouteMap active={active} />
        <div className="flex items-center justify-between px-3 pb-2 pt-3">
          <div>
            <p className="text-[14px] font-extrabold">Ruta aproximada</p>
            <p className="text-[12px] text-ink-500">3 paradas intermedias · ilustrativo</p>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors ${
              active ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-100 text-ink-500'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${active ? 'animate-pulse bg-emerald-500' : 'bg-ink-300'}`} />
            {active ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      </div>

      <div className="card flex items-center gap-3 p-4 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <MapPin size={20} />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-ink-400">Tu zona de residencia</p>
          <p className="text-[15px] font-extrabold">{zoneLabel(user.homeZoneId)}</p>
        </div>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <button
          onClick={onToggle}
          className={
            active
              ? 'btn-ghost w-full py-4 text-[15px]'
              : 'btn-primary w-full py-4 text-[16px]'
          }
        >
          {active ? 'Desactivar Ruta a Casa' : '🏠 Activar Ruta a Casa'}
        </button>
        <p className="mt-3 px-2 text-center text-[13px] leading-relaxed text-ink-500">
          Cuando la operación lo permita, priorizaremos pedidos que puedan acercarte progresivamente hacia tu zona de
          residencia.
        </p>
      </div>

      <div className="card animate-fade-up p-4" style={{ animationDelay: '260ms' }}>
        <p className="mb-3 text-[14px] font-extrabold">Así funciona</p>
        <ul className="space-y-3">
          {steps.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface text-ink-700">
                <Icon size={17} />
              </span>
              <span className="text-[13.5px] leading-snug text-ink-700">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-dashed border-ink-300 px-4 py-3 text-center text-[12.5px] font-semibold text-ink-500">
        Función conceptual. Su implementación requiere validación operativa.
      </div>
      <Disclaimer>No usa mapas reales ni tu ubicación GPS.</Disclaimer>
    </div>
  );
}

import { BellRing, KeyRound, Radar, Satellite, UserCheck } from 'lucide-react';
import { Logo } from './ui';

const PILLARS = [
  { icon: Satellite, t: 'GPS en tiempo real', d: 'Los padres ven la movilidad moverse en el mapa durante todo el recorrido.' },
  { icon: Radar, t: 'Geocercas + alertas automáticas', d: 'Aviso a 5 minutos de casa y del colegio, sin que nadie tenga que escribir.' },
  { icon: UserCheck, t: 'Abordaje y llegada confirmados', d: 'El conductor marca «Recogido»: hora y ubicación quedan registradas.' },
  { icon: KeyRound, t: 'Entrega con código', d: 'El niño solo se entrega a un adulto autorizado que muestra su código.' },
];

/** Contexto para el socio, visible solo en pantallas de escritorio junto al teléfono. */
export function PresentationPanel({ narrow = false }: { narrow?: boolean }) {
  return (
    <aside className={`hidden max-w-[440px] flex-col ${narrow ? 'min-[1320px]:flex' : 'lg:flex'}`}>
      <Logo />
      <h1 className="mt-8 text-[40px] font-semibold leading-[1.08] tracking-tight text-ink">
        Sabe dónde está tu hijo en <span className="text-brand">cada momento</span> del recorrido.
      </h1>
      <p className="mt-5 text-[16px] leading-relaxed text-ink-2">
        Hoy los padres dependen de llamadas y mensajes para saber si su hijo subió a la movilidad, llegó al colegio o volvió a casa. Movilidad Segura convierte
        cada etapa del viaje en un evento verificado y notificado automáticamente.
      </p>

      <ul className="mt-8 space-y-4">
        {PILLARS.map(({ icon: Icon, t, d }) => (
          <li key={t} className="flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-brand shadow-card">
              <Icon size={20} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-ink">{t}</span>
              <span className="block text-[14px] leading-snug text-ink-3">{d}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-white/70 p-4 text-[13.5px] text-ink-2">
        <BellRing size={18} className="mt-0.5 shrink-0 text-brand" />
        <span>
          <span className="font-semibold text-ink">Cómo verlo en 2 minutos:</span> entra como Padre y toca «Ver viaje», o abre{' '}
          <span className="font-semibold text-ink">Modo demo</span> → «Reproducir recorrido completo». Con «Ambos» ves al conductor y al padre a la vez.
        </span>
      </div>
    </aside>
  );
}

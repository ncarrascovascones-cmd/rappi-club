import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight, CircleHelp, FileText, RotateCcw, Settings, type LucideIcon } from 'lucide-react';
import { LevelEmblem } from '../components/LevelEmblem';
import { Logo } from '../components/Logo';
import { PageHeader } from '../components/PageHeader';
import { Disclaimer } from '../components/Section';
import { Sheet } from '../components/Sheet';
import { useToast } from '../components/Toast';
import { user } from '../data/mock';
import type { LevelStatus } from '../lib/levels';

type SheetId = 'settings' | 'help' | 'terms' | null;

interface ProfilePageProps {
  status: LevelStatus;
  preferredZones: number[];
  onBack: () => void;
  onRestartDemo: () => void;
}

export function ProfilePage({ status, preferredZones, onBack, onRestartDemo }: ProfilePageProps) {
  const [sheet, setSheet] = useState<SheetId>(null);
  const { level } = status;

  const stats = [
    { label: 'Nivel', value: `${level.emoji} ${level.name}` },
    { label: 'Mi zona', value: preferredZones[0] ? `Zona ${preferredZones[0]}` : 'Sin elegir' },
    { label: 'Beneficios utilizados', value: String(user.benefitsUsed) },
    { label: 'Meses en Rappi Club', value: String(user.monthsInClub) },
  ];

  const menu: { id: Exclude<SheetId, null>; label: string; icon: LucideIcon }[] = [
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'help', label: 'Ayuda', icon: CircleHelp },
    { id: 'terms', label: 'Términos del programa', icon: FileText },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Mi perfil" onBack={onBack} />

      <div className="card -mt-2 animate-fade-up p-5 text-center">
        <div className="relative mx-auto w-fit">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-gradient text-[26px] font-extrabold text-white shadow-glow">
            {user.initials}
          </div>
          <div className="absolute -bottom-1 -right-2">
            <LevelEmblem level={level} size="sm" />
          </div>
        </div>
        <p className="mt-4 text-[21px] font-extrabold tracking-tight">{user.fullName}</p>
        <p className="text-[14px] text-ink-500">{user.role}</p>
        <div className="mt-3 flex justify-center">
          <Logo size="sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 animate-fade-up" style={{ animationDelay: '80ms' }}>
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-[12px] font-semibold text-ink-400">{s.label}</p>
            <p className="mt-1 text-[18px] font-extrabold tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card animate-fade-up divide-y divide-ink-100 overflow-hidden" style={{ animationDelay: '140ms' }}>
        {menu.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSheet(id)}
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-surface"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface text-ink-700">
              <Icon size={18} />
            </span>
            <span className="flex-1 text-[15px] font-semibold">{label}</span>
            <ChevronRight size={18} className="text-ink-300" />
          </button>
        ))}
      </div>

      <button
        onClick={onRestartDemo}
        className="flex w-full items-center justify-center gap-2 py-2 text-[13px] font-semibold text-ink-500"
      >
        <RotateCcw size={14} /> Ver pantalla de bienvenida
      </button>

      <Disclaimer>Rappi Club es un prototipo conceptual. No es una aplicación oficial de Rappi.</Disclaimer>

      <Sheet open={sheet === 'settings'} onClose={() => setSheet(null)} title="Configuración">
        <SettingsContent />
      </Sheet>
      <Sheet open={sheet === 'help'} onClose={() => setSheet(null)} title="Ayuda">
        <HelpContent />
      </Sheet>
      <Sheet open={sheet === 'terms'} onClose={() => setSheet(null)} title="Términos del programa">
        <TermsContent />
      </Sheet>
    </div>
  );
}

function Toggle({ label, hint, defaultOn = true }: { label: string; hint: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  const toast = useToast();
  return (
    <div className="flex items-center gap-4 py-3.5">
      <div className="flex-1">
        <p className="text-[15px] font-semibold">{label}</p>
        <p className="text-[12.5px] text-ink-500">{hint}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => {
          setOn(!on);
          toast(on ? 'Desactivado' : '✓ Activado');
        }}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? 'bg-brand-500' : 'bg-ink-200'}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-1'}`}
        />
      </button>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="divide-y divide-ink-100">
      <Toggle label="Novedades de beneficios" hint="Te avisamos cuando haya nuevos aliados." />
      <Toggle label="Recordatorio de Ruta a Casa" hint="Una sugerencia amable al final del día." defaultOn={false} />
      <Toggle label="Resumen mensual" hint="Tu progreso y beneficios, una vez al mes." />
    </div>
  );
}

const faqs = [
  {
    q: '¿Cómo subo de nivel?',
    a: 'Tu nivel refleja tu constancia a lo largo del tiempo. No se trata de trabajar jornadas más largas, sino de seguir eligiendo el programa.',
  },
  {
    q: '¿Siempre recibiré pedidos en mi zona?',
    a: 'No. Tus zonas son una preferencia: se priorizan cuando existe disponibilidad y la operación lo permite. Si no, la operación continúa normalmente.',
  },
  {
    q: '¿Qué pasa si me tomo unos días libres?',
    a: 'Con la protección de nivel conservas tu nivel durante un período. Si la inactividad continúa, el descenso es progresivo, un nivel a la vez.',
  },
];

function HelpContent() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {faqs.map((f, i) => (
        <div key={f.q} className="rounded-2xl bg-surface">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            aria-expanded={open === i}
          >
            <span className="flex-1 text-[14.5px] font-bold">{f.q}</span>
            <ChevronDown size={18} className={`text-ink-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && <p className="animate-fade-in px-4 pb-4 text-[13.5px] leading-relaxed text-ink-500">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

function Term({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[14px] font-bold">{title}</p>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">{children}</p>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="space-y-4">
      <Term title="Naturaleza del prototipo">
        Rappi Club es un concepto de experiencia con fines de presentación. No es una aplicación oficial de Rappi ni
        está integrada con sus sistemas.
      </Term>
      <Term title="Niveles">
        Los umbrales, pedidos y porcentajes mostrados son valores de ejemplo y no representan datos oficiales.
      </Term>
      <Term title="Beneficios y aliados">
        Los aliados son ficticios. Los beneficios están sujetos a disponibilidad y condiciones de cada aliado.
      </Term>
      <Term title="Zonas y Ruta a Casa">
        Son preferencias que se priorizan cuando la operación lo permite. No garantizan la asignación de pedidos.
      </Term>
    </div>
  );
}

import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

const before = ['Pedido', 'Entrega', 'Pago'];
const after = ['Trabajo', 'Constancia', 'Nivel', 'Beneficios', 'Permanencia'];
const pillars = ['Control', 'Reconocimiento', 'Beneficios', 'Permanencia'];

function Flow({ steps, highlight }: { steps: string[]; highlight?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-1.5">
          <span
            className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${
              highlight ? 'bg-brand-gradient text-white shadow-glow' : 'bg-white/70 text-ink-500'
            }`}
          >
            {step}
          </span>
          {i < steps.length - 1 && <ArrowRight size={14} className={highlight ? 'text-brand-500' : 'text-ink-300'} />}
        </span>
      ))}
    </div>
  );
}

/** Panel lateral (solo pantallas grandes) para presentar el concepto. */
export function PresentationPanel() {
  return (
    <aside className="hidden max-w-[440px] animate-fade-up lg:block">
      <Logo size="md" />
      <p className="eyebrow mt-8 text-brand-600">Prototipo conceptual</p>
      <h1 className="mt-2 text-[38px] font-extrabold leading-[1.1] tracking-tight text-balance">
        Así podría verse Rappi Club dentro de Soy Rappi.
      </h1>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-500">
        Más razones para que el rappitendero siga eligiendo Rappi durante todo el año.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {pillars.map((p, i) => (
          <span key={p} className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider text-ink">
            {p}
            {i < pillars.length - 1 && <span className="text-brand-500">+</span>}
          </span>
        ))}
      </div>

      <div className="mt-8 space-y-4 rounded-3xl bg-white/60 p-5 backdrop-blur">
        <div>
          <p className="eyebrow mb-2 text-ink-400">Antes</p>
          <Flow steps={before} />
        </div>
        <div>
          <p className="eyebrow mb-2 text-brand-600">Después</p>
          <Flow steps={after} highlight />
        </div>
      </div>

      <p className="mt-6 text-[12px] leading-relaxed text-ink-400">
        Concepto independiente con fines de presentación. No es una aplicación oficial de Rappi ni está integrada con
        sus sistemas. Datos, niveles, aliados y beneficios son ilustrativos.
      </p>
    </aside>
  );
}

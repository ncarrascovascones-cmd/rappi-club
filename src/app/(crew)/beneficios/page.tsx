'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Baby,
  BadgeCheck,
  Brain,
  Check,
  GraduationCap,
  HeartPulse,
  Info,
  LibraryBig,
  Palmtree,
  ShieldCheck,
  Stethoscope,
  Umbrella,
  Video,
  Wrench,
  Award,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useCrew } from '@/lib/store';
import { BENEFIT_CATEGORIES } from '@/lib/labels';
import type { Benefit, BenefitCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/field';
import { Modal } from '@/components/ui/modal';
import { PageSkeleton } from '@/components/ui/states';
import { useToast } from '@/components/ui/toast';

const ICONS: Record<string, LucideIcon> = {
  'b-1': Wrench,
  'b-2': Umbrella,
  'b-3': ShieldCheck,
  'b-4': Video,
  'b-5': Brain,
  'b-6': Stethoscope,
  'b-7': Baby,
  'b-8': HeartPulse,
  'b-9': Palmtree,
  'b-10': GraduationCap,
  'b-11': Users,
  'b-12': Award,
};

const CAT_STYLE: Record<BenefitCategory, { chip: string; icon: string; grad: string; Icon: LucideIcon }> = {
  movilidad: { chip: 'text-brand-700 bg-brand-50', icon: 'bg-brand-50 text-brand-600', grad: 'from-brand-400 to-brand-600', Icon: Wrench },
  salud: { chip: 'text-sky-600 bg-sky-50', icon: 'bg-sky-50 text-sky-600', grad: 'from-sky-500 to-sky-600', Icon: HeartPulse },
  familia: { chip: 'text-sun-700 bg-sun-50', icon: 'bg-sun-50 text-sun-700', grad: 'from-sun-400 to-sun-500', Icon: Baby },
  aprendizaje: { chip: 'text-grape-600 bg-grape-50', icon: 'bg-grape-50 text-grape-600', grad: 'from-grape-500 to-grape-600', Icon: LibraryBig },
};

function BenefitsView() {
  const { benefits, state, registerBenefitInterest, completeStep } = useCrew();
  const { toast } = useToast();
  const params = useSearchParams();
  const initial = params.get('c') as BenefitCategory | null;
  const [cat, setCat] = useState<BenefitCategory | 'todas'>(
    initial && BENEFIT_CATEGORIES.some((c) => c.id === initial) ? initial : 'todas',
  );
  const [open, setOpen] = useState<Benefit | null>(null);
  const [loading, setLoading] = useState(false);

  const list = useMemo(() => benefits.filter((b) => cat === 'todas' || b.category === cat), [benefits, cat]);

  const interest = async (b: Benefit) => {
    setLoading(true);
    try {
      await registerBenefitInterest(b.id);
      completeStep('beneficios');
      toast({ tone: 'success', title: 'Interés registrado', description: `Te avisaremos cuando "${b.title}" esté disponible en tu zona.` });
    } catch {
      toast({ tone: 'error', title: 'No pudimos registrar tu interés', description: 'Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Beneficios Crew"
        title="Beneficios por ser parte de la Crew"
        description="Apoyos pensados para tu día a día en la calle y para quienes te esperan en casa. No son puntos ni bonos: son parte de pertenecer a la Crew."
      />

      <div className="mb-6 flex items-start gap-3 rounded-2xl bg-sky-50 p-4 text-sm text-sky-600 ring-1 ring-sky-100">
        <Info className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          <b>Beneficios sujetos a disponibilidad y acuerdos con aliados.</b> Los beneficios mostrados son conceptuales y
          pueden variar por ciudad.
        </p>
      </div>

      <div className="stagger mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {BENEFIT_CATEGORIES.map((c) => {
          const s = CAT_STYLE[c.id];
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(active ? 'todas' : c.id)}
              aria-pressed={active}
              className={cn(
                'relative overflow-hidden rounded-3xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5',
                active ? `bg-gradient-to-br ${s.grad} text-white shadow-lift` : 'bg-white shadow-card ring-1 ring-ink-900/[0.04]',
              )}
            >
              <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', active ? 'bg-white/20' : s.icon)}>
                <s.Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-extrabold">{c.label}</p>
              <p className={cn('mt-0.5 text-xs leading-snug', active ? 'text-white/80' : 'text-ink-500')}>{c.blurb}</p>
            </button>
          );
        })}
      </div>

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <Chip active={cat === 'todas'} onClick={() => setCat('todas')}>
          Todos ({benefits.length})
        </Chip>
        {BENEFIT_CATEGORIES.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
            {c.label}
          </Chip>
        ))}
      </div>

      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((b) => {
          const Icon = ICONS[b.id] ?? Award;
          const s = CAT_STYLE[b.category];
          const registered = state.benefitInterests.includes(b.id);
          return (
            <Card key={b.id} interactive className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <span className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', s.icon)}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold', s.chip)}>{b.tag}</span>
              </div>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
                {BENEFIT_CATEGORIES.find((c) => c.id === b.category)?.label}
              </p>
              <p className="mt-1 text-lg font-extrabold leading-snug text-ink-900">{b.title}</p>
              <p className="mt-1.5 text-sm text-ink-500">{b.description}</p>
              <div className="mt-auto flex items-center gap-2 pt-5">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setOpen(b)}>
                  Ver detalle
                </Button>
                {registered ? (
                  <span className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-mint-50 text-[13px] font-bold text-mint-700">
                    <Check className="h-4 w-4" /> Registrado
                  </span>
                ) : (
                  <Button size="sm" variant="dark" className="flex-1" onClick={() => setOpen(b)}>
                    Me interesa
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-ink-400">Beneficios sujetos a disponibilidad y acuerdos con aliados.</p>

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        title={open?.title ?? ''}
        description={open ? BENEFIT_CATEGORIES.find((c) => c.id === open.category)?.label : undefined}
        footer={
          open &&
          (state.benefitInterests.includes(open.id) ? (
            <Button variant="mint" icon={<BadgeCheck className="h-4 w-4" />} onClick={() => setOpen(null)}>
              Interés registrado
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setOpen(null)}>
                Cerrar
              </Button>
              <Button loading={loading} onClick={() => interest(open)}>
                Me interesa
              </Button>
            </>
          ))
        }
      >
        {open && (
          <div className="space-y-4 pb-2">
            <p className="text-[15px] leading-relaxed text-ink-700">{open.detail}</p>
            <div className="rounded-2xl bg-ink-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Cómo acceder</p>
              <ol className="mt-2 space-y-2">
                {open.howTo.map((h, i) => (
                  <li key={h} className="flex gap-2 text-sm text-ink-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-ink-600">
                      {i + 1}
                    </span>
                    {h}
                  </li>
                ))}
              </ol>
            </div>
            <p className="text-xs text-ink-400">Beneficios sujetos a disponibilidad y acuerdos con aliados.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function BeneficiosPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <BenefitsView />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Gift,
  GraduationCap,
  HeartPulse,
  LifeBuoy,
  MapPin,
  MessageCircle,
  Send,
  Users,
  Wrench,
  Bike,
  Sparkles,
} from 'lucide-react';
import { useCrew, useSelectors, RIDER_THREAD_ID } from '@/lib/store';
import { VEHICLE_LABEL } from '@/lib/labels';
import { cn, monthsLabel } from '@/lib/utils';
import { Card, SectionTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Ring } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/states';
import { ProtocolCard } from '@/components/protocol-card';

export default function InicioPage() {
  const { state } = useCrew();
  const { assigned, published, onboardingPct } = useSelectors();
  const rider = state.rider;
  const doneCount = state.onboarding.filter((o) => o.done).length;
  const nextStep = state.onboarding.find((o) => !o.done);
  const thread = state.threads[RIDER_THREAD_ID] ?? [];
  const lastMine = thread.map((m) => m.from).lastIndexOf('nuevo');
  const unread = thread.slice(lastMine + 1).filter((m) => m.from === 'copiloto').length;
  const recommended = [...published]
    .sort((a, b) => (a.id === 'p-014' ? -1 : b.id === 'p-014' ? 1 : b.helpful - a.helpful))
    .slice(0, 3);
  const latestPosta = state.experiences.find((e) => e.authorRole !== 'nuevo');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="space-y-8">
      {/* Hero saludo + onboarding */}
      <section className="relative animate-fade-up overflow-hidden rounded-[32px] bg-brand-gradient p-6 text-white shadow-glow sm:p-8">
        <div className="bg-dots absolute inset-0 opacity-50" />
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <Badge tone="white" icon={<Sparkles className="h-3 w-3" />}>
              Día {rider.joinedDaysAgo} en la calle
            </Badge>
            <h1 className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[36px]">
              {greeting}, {rider.firstName} 👋
            </h1>
            <p className="mt-2 text-[15px] text-white/85">
              Vas muy bien. Ya llevas {rider.deliveries} entregas y no estás solo: la Crew va contigo.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                <MapPin className="h-3.5 w-3.5" /> {rider.zone}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                <Bike className="h-3.5 w-3.5" /> {VEHICLE_LABEL[rider.vehicle]}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-white/15 p-4 ring-1 ring-white/20 backdrop-blur md:w-[300px]">
            <Ring value={onboardingPct} size={76} stroke={8}>
              <span className="text-lg font-extrabold">{onboardingPct}%</span>
            </Ring>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Tu arranque</p>
              <p className="text-sm font-bold">
                {doneCount} de {state.onboarding.length} pasos
              </p>
              {nextStep ? (
                <Link href={nextStep.href} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold underline-offset-2 hover:underline">
                  Siguiente: {nextStep.title} <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <p className="mt-1 text-xs font-semibold">¡Completaste tu arranque! 🎉</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Copiloto + Necesito una mano */}
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {assigned ? (
          <Card className="animate-fade-up p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-400">Tu Copiloto asignado</p>
              <Badge tone="mint" dot>
                Voluntario
              </Badge>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Avatar initials={assigned.initials} color={assigned.color} size="lg" online />
              <div className="min-w-0">
                <p className="text-xl font-extrabold text-ink-900">{assigned.name}</p>
                <p className="text-sm text-ink-500">
                  {monthsLabel(assigned.monthsOnPlatform)} en Rappi · {assigned.zone} · {VEHICLE_LABEL[assigned.vehicle]}
                </p>
                <p className="mt-1 text-xs font-semibold text-mint-600">{assigned.responseTime}</p>
              </div>
            </div>
            <p className="mt-4 rounded-2xl bg-ink-50 p-3 text-sm leading-relaxed text-ink-600">
              “{assigned.bio.split('.')[0]}.”
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <ButtonLink href="/mi-copiloto/chat" variant="dark" icon={<MessageCircle className="h-4 w-4" />} className="flex-1">
                Hablar con mi Copiloto
                {unread > 0 && (
                  <span className="ml-1 rounded-full bg-brand-500 px-1.5 text-[11px] font-bold">{unread}</span>
                )}
              </ButtonLink>
              <ButtonLink href="/mi-copiloto" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
                Ver perfil
              </ButtonLink>
            </div>
          </Card>
        ) : (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="Aún no tienes Copiloto"
            description="Te proponemos Rappitenderos con experiencia que decidieron acompañar voluntariamente."
            action={<ButtonLink href="/mi-copiloto/match">Encontrar mi Copiloto</ButtonLink>}
          />
        )}

        <Link
          href="/necesito-una-mano"
          className="group relative flex animate-fade-up flex-col justify-between overflow-hidden rounded-3xl bg-ink-gradient p-6 text-white shadow-lift transition hover:-translate-y-0.5"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/40 blur-2xl transition group-hover:bg-brand-500/60" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
            <LifeBuoy className="h-6 w-6" />
          </span>
          <div className="relative mt-8">
            <p className="text-2xl font-extrabold tracking-tight">Necesito una mano</p>
            <p className="mt-1 text-sm text-white/65">
              Cuéntanos qué pasó. Buscamos experiencias similares y el Protocolo Crew que aplica.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-300">
              Pedir ayuda ahora <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* Onboarding checklist */}
      <section>
        <SectionTitle title="Tu arranque en la Crew" subtitle="Pasos cortos para tus primeras semanas." />
        <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.onboarding.map((step, i) => (
            <Link
              key={step.id}
              href={step.href}
              className={cn(
                'group flex items-start gap-3 rounded-2xl p-4 ring-1 transition-all hover:-translate-y-0.5',
                step.done ? 'bg-mint-50/60 ring-mint-100' : 'bg-white shadow-card ring-ink-900/[0.04] hover:shadow-lift',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold',
                  step.done ? 'bg-mint-500 text-white' : 'bg-ink-100 text-ink-500',
                )}
              >
                {step.done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn('block text-sm font-bold', step.done ? 'text-ink-500 line-through decoration-ink-300' : 'text-ink-900')}>
                  {step.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink-500">{step.detail}</span>
              </span>
              {!step.done && <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />}
            </Link>
          ))}
        </div>
      </section>

      {/* Protocolos recomendados */}
      <section>
        <SectionTitle
          title="Protocolos Crew recomendados"
          subtitle="Soluciones construidas con la experiencia de la flota y validadas por Rappi."
          action={
            <Link href="/protocolos" className="hidden shrink-0 text-sm font-bold text-brand-600 hover:text-brand-700 sm:inline-flex sm:items-center sm:gap-1">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="stagger grid gap-4 md:grid-cols-3">
          {recommended.map((p) => (
            <ProtocolCard key={p.id} protocol={p} />
          ))}
        </div>
        <Link href="/protocolos" className="mt-3 flex items-center justify-center gap-1 text-sm font-bold text-brand-600 sm:hidden">
          Ver todos los protocolos <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Pasa la posta + Beneficios */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="relative overflow-hidden p-6">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-100 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Send className="h-5 w-5" />
              </span>
              <p className="text-lg font-extrabold text-ink-900">Pasa la Posta</p>
            </div>
            <p className="mt-4 text-[17px] font-bold leading-snug text-ink-900">
              ¿Qué aprendiste que te hubiera gustado saber cuando comenzaste?
            </p>
            {latestPosta && (
              <div className="mt-4 rounded-2xl bg-ink-50 p-4">
                <p className="text-sm leading-relaxed text-ink-700">“{latestPosta.text}”</p>
                <div className="mt-3 flex items-center gap-2">
                  <Avatar initials={latestPosta.initials} color={latestPosta.color} size="xs" />
                  <p className="text-xs font-semibold text-ink-500">
                    {latestPosta.author} · {monthsLabel(latestPosta.months)} en la calle
                  </p>
                </div>
              </div>
            )}
            <ButtonLink href="/pasa-la-posta" className="mt-5" iconRight={<ArrowRight className="h-4 w-4" />}>
              Compartir mi experiencia
            </ButtonLink>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-50 text-mint-600">
                <Gift className="h-5 w-5" />
              </span>
              <p className="text-lg font-extrabold text-ink-900">Beneficios Crew</p>
            </div>
            <Link href="/beneficios" className="text-sm font-bold text-brand-600 hover:text-brand-700">
              Explorar
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { icon: Wrench, label: 'Movilidad', text: 'Descuento en mantenimiento', c: 'bg-brand-50 text-brand-600' },
              { icon: HeartPulse, label: 'Salud', text: 'Acceso a telemedicina', c: 'bg-sky-50 text-sky-600' },
              { icon: Users, label: 'Familia', text: 'Beneficios educativos', c: 'bg-sun-50 text-sun-700' },
              { icon: GraduationCap, label: 'Aprendizaje', text: 'Cursos y capacitación', c: 'bg-grape-50 text-grape-600' },
            ].map((b) => (
              <Link
                key={b.label}
                href={`/beneficios?c=${b.label.toLowerCase()}`}
                className="rounded-2xl p-3 ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:bg-ink-50"
              >
                <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', b.c)}>
                  <b.icon className="h-[18px] w-[18px]" />
                </span>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-ink-400">{b.label}</p>
                <p className="text-sm font-bold leading-snug text-ink-900">{b.text}</p>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-400">Beneficios sujetos a disponibilidad y acuerdos con aliados.</p>
        </Card>
      </section>

      <section className="flex flex-col items-start gap-4 rounded-3xl bg-white p-5 shadow-card sm:flex-row sm:items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sun-50 text-sun-700">
          <BookOpen className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="font-extrabold text-ink-900">La Voz de la Crew</p>
          <p className="text-sm text-ink-500">
            Conoce a los Rappitenderos cuyas experiencias se convirtieron en Protocolos Crew.
          </p>
        </div>
        <ButtonLink href="/voz-de-la-crew" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
          Ver historias
        </ButtonLink>
      </section>
    </div>
  );
}

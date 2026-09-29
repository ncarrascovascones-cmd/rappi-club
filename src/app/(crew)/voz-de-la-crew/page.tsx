'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Award, BookOpen, ChevronDown, Heart, MapPin, Quote, Users } from 'lucide-react';
import { useCrew } from '@/lib/store';
import type { VoiceStory } from '@/lib/types';
import { cn, monthsLabel, protocolShort } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/field';

const BADGES = [
  { name: 'Copiloto fundador', desc: 'Acompañó a los primeros nuevos de la Crew.' },
  { name: 'Posta de oro', desc: 'Su experiencia fue la más útil del trimestre para la flota.' },
  { name: 'Guardián nocturno', desc: 'Aportó experiencia clave para el turno noche.' },
  { name: 'Voz clara', desc: 'Explicó algo complejo de forma simple.' },
  { name: 'Mapa vivo', desc: 'Conoce su zona como nadie y lo comparte.' },
  { name: 'Primera posta', desc: 'Aportó una experiencia en sus primeras semanas.' },
];

export default function VozPage() {
  const { voices } = useCrew();
  const [filter, setFilter] = useState<'todas' | 'copilotos' | 'protocolos'>('todas');
  const featured = voices[0];
  const rest = voices
    .slice(1)
    .filter((v) => (filter === 'copilotos' ? v.accompanied > 0 : filter === 'protocolos' ? v.protocolIds.length > 0 : true));

  return (
    <div>
      <PageHeader
        eyebrow="La Voz de la Crew"
        title="Las personas detrás de los protocolos"
        description="Reconocemos a quienes comparten lo que saben. Aquí el reconocimiento es público y simbólico: nunca económico."
      />

      <FeaturedStory story={featured} />

      <div className="mb-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-extrabold text-ink-900">Historias de la Crew</p>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <Chip active={filter === 'todas'} onClick={() => setFilter('todas')}>
            Todas
          </Chip>
          <Chip active={filter === 'copilotos'} onClick={() => setFilter('copilotos')}>
            Copilotos
          </Chip>
          <Chip active={filter === 'protocolos'} onClick={() => setFilter('protocolos')}>
            Con protocolos
          </Chip>
        </div>
      </div>

      <div className="stagger grid gap-4 md:grid-cols-2">
        {rest.map((v) => (
          <StoryCard key={v.id} story={v} />
        ))}
      </div>

      <Card className="mt-8 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-sun-500" />
          <p className="text-lg font-extrabold text-ink-900">Insignias de la Crew</p>
        </div>
        <p className="mt-1 text-sm text-ink-500">
          Las insignias reconocen el aporte a la comunidad. No se canjean, no suman puntos y no tienen valor económico.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((b) => (
            <div key={b.name} className="flex items-start gap-3 rounded-2xl bg-ink-50 p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sun-400 to-brand-500 text-white">
                <Award className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink-900">{b.name}</p>
                <p className="text-xs text-ink-500">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ThanksButton({ story, light }: { story: VoiceStory; light?: boolean }) {
  const { state, toggleThanks } = useCrew();
  const thanked = state.thankedIds.includes(story.id);
  return (
    <button
      onClick={() => toggleThanks(story.id)}
      aria-pressed={thanked}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition active:scale-90',
        thanked
          ? 'bg-brand-500 text-white'
          : light
            ? 'bg-white/15 text-white hover:bg-white/25'
            : 'bg-ink-50 text-ink-600 hover:bg-brand-50 hover:text-brand-600',
      )}
    >
      <Heart className={cn('h-3.5 w-3.5', thanked && 'fill-current')} />
      {thanked ? '¡Gracias enviado!' : 'Dar las gracias'} · {story.thanks + (thanked ? 1 : 0)}
    </button>
  );
}

function ProtocolChips({ ids, light }: { ids: string[]; light?: boolean }) {
  const { state } = useCrew();
  const ps = ids.map((id) => state.protocols.find((p) => p.id === id)).filter(Boolean);
  if (!ps.length)
    return <p className={cn('text-xs', light ? 'text-white/60' : 'text-ink-400')}>Su aporte está en revisión para un nuevo protocolo.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {ps.map((p) => (
        <Link
          key={p!.id}
          href={`/protocolos/${p!.id}`}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition',
            light ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-mint-50 text-mint-700 hover:bg-mint-100',
          )}
        >
          <BookOpen className="h-3.5 w-3.5" /> {protocolShort(p!.number)} · {p!.title}
        </Link>
      ))}
    </div>
  );
}

function FeaturedStory({ story }: { story: VoiceStory }) {
  return (
    <section className="relative animate-fade-up overflow-hidden rounded-[32px] bg-ink-gradient p-6 text-white shadow-lift sm:p-8">
      <div className="bg-dots absolute inset-0 opacity-50" />
      <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Avatar initials={story.initials} color={story.color} size="xl" />
          <Badge tone="white" icon={<Award className="h-3 w-3" />}>
            {story.badge}
          </Badge>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-300">Historia destacada del mes</p>
          <p className="mt-2 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px]">{story.name}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-white/60">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {story.zone}
            </span>
            <span>{monthsLabel(story.months)} en la calle</span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {story.accompanied} nuevos acompañados
            </span>
          </p>
          <blockquote className="mt-4 flex gap-2 text-lg font-semibold leading-snug text-white/95">
            <Quote className="h-5 w-5 shrink-0 text-brand-400" />
            {story.quote}
          </blockquote>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{story.story}</p>
          <div className="mt-4 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">Experiencia aportada</p>
            <p className="mt-1 text-sm">{story.contribution}</p>
            <p className="mb-2 mt-3 text-xs font-bold uppercase tracking-wider text-white/50">Protocolos generados</p>
            <ProtocolChips ids={story.protocolIds} light />
          </div>
          <div className="mt-4">
            <ThanksButton story={story} light />
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryCard({ story }: { story: VoiceStory }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start gap-3">
        <Avatar initials={story.initials} color={story.color} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-ink-900">{story.name}</p>
          <p className="text-xs text-ink-400">
            {story.zone} · {monthsLabel(story.months)} en la calle
          </p>
        </div>
        <Badge tone={story.badgeTone} icon={<Award className="h-3 w-3" />}>
          {story.badge}
        </Badge>
      </div>
      <p className="mt-4 text-[15px] font-semibold leading-snug text-ink-900">“{story.quote}”</p>
      <div className="mt-3 rounded-2xl bg-ink-50 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Experiencia aportada</p>
        <p className="mt-0.5 text-sm text-ink-700">{story.contribution}</p>
      </div>
      <div className="mt-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-400">
          Protocolos generados · {story.protocolIds.length}
        </p>
        <ProtocolChips ids={story.protocolIds} />
      </div>
      {open && <p className="mt-3 animate-fade-in text-sm leading-relaxed text-ink-600">{story.story}</p>}
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1 text-xs font-bold text-ink-500 hover:text-ink-900"
          aria-expanded={open}
        >
          {open ? 'Ocultar historia' : 'Leer su historia'}
          <ChevronDown className={cn('h-4 w-4 transition', open && 'rotate-180')} />
        </button>
        <ThanksButton story={story} />
      </div>
    </Card>
  );
}

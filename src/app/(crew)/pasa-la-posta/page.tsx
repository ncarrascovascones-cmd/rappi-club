'use client';

import { useMemo, useState } from 'react';
import { Heart, MessageSquareQuote, PenLine, Send, Sparkles } from 'lucide-react';
import { useCrew } from '@/lib/store';
import { HELP_CATEGORIES, ZONES, categoryLabel } from '@/lib/labels';
import type { Experience, HelpCategory } from '@/lib/types';
import { cn, monthsLabel, timeAgo } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip, Label, Select, TextArea } from '@/components/ui/field';
import { EmptyState, ErrorNote, SuccessPanel } from '@/components/ui/states';
import { Avatar } from '@/components/ui/avatar';
import { CategoryIcon } from '@/components/category-icon';
import { useToast } from '@/components/ui/toast';

const EXP_STATUS: Record<Experience['status'], { label: string; tone: 'sun' | 'sky' | 'mint' }> = {
  nueva: { label: 'Rappi la está leyendo', tone: 'sun' },
  agrupada: { label: 'Agrupada en un patrón', tone: 'sky' },
  en_protocolo: { label: 'Parte de un Protocolo Crew', tone: 'mint' },
};

const ROLE_LABEL: Record<Experience['authorRole'], string> = {
  nuevo: 'Nuevo',
  copiloto: 'Copiloto',
  rappitendero: 'Rappitendero',
};

export default function PasaLaPostaPage() {
  const { state, shareExperience, toggleThanks } = useCrew();
  const { toast } = useToast();
  const defaultZone = state.role === 'copiloto' ? 'Chapinero' : state.rider.zone;
  const [category, setCategory] = useState<HelpCategory | null>(null);
  const [text, setText] = useState('');
  const [zone, setZone] = useState(defaultZone);
  const [errors, setErrors] = useState<{ category?: string; text?: string }>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [filter, setFilter] = useState<HelpCategory | 'todas' | 'mias'>('todas');

  const feed = useMemo(
    () =>
      state.experiences
        .filter((e) => (filter === 'todas' ? true : filter === 'mias' ? e.mine : e.category === filter))
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [state.experiences, filter],
  );

  const submit = async () => {
    const e: typeof errors = {};
    if (!category) e.category = 'Elige de qué trata tu experiencia.';
    if (text.trim().length < 20) e.text = 'Cuéntalo con un poco más de detalle (mínimo 20 caracteres).';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSending(true);
    try {
      await shareExperience({ category: category!, text: text.trim(), zone });
      setSent(true);
      setText('');
      setCategory(null);
    } catch {
      toast({ tone: 'error', title: 'No pudimos compartir tu posta', description: 'Inténtalo de nuevo en un momento.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Campaña · Pasa la Posta"
        title="Compartimos experiencia. Aprendemos todos."
        description="Lo que aprendiste en la calle puede ahorrarle un mal día a quien empieza. Rappi lee cada posta y las mejores se convierten en Protocolos Crew."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Formulario */}
        <div className="lg:sticky lg:top-10 lg:self-start">
          <Card className="animate-fade-up overflow-hidden">
            <div className="relative bg-brand-gradient p-6 text-white">
              <div className="bg-dots absolute inset-0 opacity-40" />
              <MessageSquareQuote className="relative h-8 w-8 text-white/70" />
              <p className="relative mt-3 text-balance text-[22px] font-extrabold leading-snug sm:text-[26px]">
                ¿Qué aprendiste que te hubiera gustado saber cuando comenzaste?
              </p>
            </div>

            <div className="p-5 sm:p-6">
              {sent ? (
                <SuccessPanel
                  title="¡Pasaste la posta!"
                  description="Tu experiencia ya está en la Crew. Rappi la revisará junto con otras similares para convertirla en un Protocolo Crew."
                >
                  <div className="flex flex-col justify-center gap-2 sm:flex-row">
                    <Button variant="dark" icon={<PenLine className="h-4 w-4" />} onClick={() => setSent(false)}>
                      Compartir otra
                    </Button>
                    <Button variant="secondary" onClick={() => setFilter('mias')}>
                      Ver mis postas
                    </Button>
                  </div>
                </SuccessPanel>
              ) : (
                <div className="space-y-5">
                  <div>
                    <Label>¿De qué trata?</Label>
                    <div className="flex flex-wrap gap-2">
                      {HELP_CATEGORIES.map((c) => (
                        <Chip
                          key={c.id}
                          active={category === c.id}
                          onClick={() => {
                            setCategory(c.id);
                            setErrors((x) => ({ ...x, category: undefined }));
                          }}
                        >
                          {c.label}
                        </Chip>
                      ))}
                    </div>
                    {errors.category && <ErrorNote className="mt-2">{errors.category}</ErrorNote>}
                  </div>
                  <div>
                    <Label htmlFor="posta" hint={`${text.length}/500`}>
                      Tu experiencia
                    </Label>
                    <TextArea
                      id="posta"
                      maxLength={500}
                      value={text}
                      invalid={!!errors.text}
                      onChange={(e) => {
                        setText(e.target.value);
                        if (errors.text) setErrors((x) => ({ ...x, text: undefined }));
                      }}
                      placeholder="Ej.: Antes de salir de la tienda, reviso la bolsa contra el pedido. Me ahorra problemas en la entrega…"
                    />
                    {errors.text && <ErrorNote className="mt-2">{errors.text}</ErrorNote>}
                  </div>
                  <div>
                    <Label htmlFor="zona">Zona donde lo aprendiste</Label>
                    <Select id="zona" value={zone} onChange={(e) => setZone(e.target.value)}>
                      {ZONES.map((z) => (
                        <option key={z}>{z}</option>
                      ))}
                    </Select>
                  </div>
                  <Button size="lg" block loading={sending} onClick={submit} icon={<Send className="h-4 w-4" />}>
                    {sending ? 'Pasando la posta…' : 'Pasar la posta'}
                  </Button>
                  <p className="text-center text-xs text-ink-400">
                    No compartas datos personales de clientes. Rappi valida cualquier solución antes de publicarla.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Feed */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-extrabold text-ink-900">Lo que la Crew está pasando</p>
            <span className="text-xs font-semibold text-ink-400">{feed.length} postas</span>
          </div>
          <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            <Chip active={filter === 'todas'} onClick={() => setFilter('todas')}>
              Todas
            </Chip>
            <Chip active={filter === 'mias'} onClick={() => setFilter('mias')}>
              Mis postas
            </Chip>
            {HELP_CATEGORIES.map((c) => (
              <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
                {c.short}
              </Chip>
            ))}
          </div>

          {feed.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="h-6 w-6" />}
              title={filter === 'mias' ? 'Aún no has pasado la posta' : 'Sin postas en esta categoría'}
              description={
                filter === 'mias'
                  ? 'Comparte lo que aprendiste: puede convertirse en un Protocolo Crew.'
                  : 'Sé la primera persona en compartir algo sobre este tema.'
              }
            />
          ) : (
            <div className="stagger space-y-3">
              {feed.map((e) => {
                const thanked = state.thankedIds.includes(e.id);
                return (
                  <Card key={e.id} className={cn('p-5', e.mine && 'ring-2 ring-brand-200')}>
                    <div className="flex items-start gap-3">
                      <Avatar initials={e.initials} color={e.color} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="font-bold text-ink-900">{e.mine ? 'Tú' : e.author}</p>
                          <Badge tone={e.authorRole === 'copiloto' ? 'mint' : e.authorRole === 'nuevo' ? 'brand' : 'ink'}>
                            {ROLE_LABEL[e.authorRole]}
                          </Badge>
                        </div>
                        <p className="text-xs text-ink-400">
                          {e.months > 0 ? `${monthsLabel(e.months)} en la calle · ` : 'Primeras semanas · '}
                          {e.zone} · {timeAgo(e.createdAt)}
                        </p>
                      </div>
                      <CategoryIcon category={e.category} size="sm" />
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-800">{e.text}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-ink-400">{categoryLabel(e.category)}</span>
                      <div className="flex items-center gap-2">
                        {e.mine && <Badge tone={EXP_STATUS[e.status].tone}>{EXP_STATUS[e.status].label}</Badge>}
                        {!e.mine && (
                          <button
                            onClick={() => toggleThanks(e.id)}
                            aria-pressed={thanked}
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-90',
                              thanked ? 'bg-brand-500 text-white' : 'bg-ink-50 text-ink-600 hover:bg-brand-50 hover:text-brand-600',
                            )}
                          >
                            <Heart className={cn('h-3.5 w-3.5', thanked && 'fill-current')} />
                            {thanked ? 'Te sirvió' : 'Me sirvió'} · {e.thanks}
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

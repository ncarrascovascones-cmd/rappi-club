'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Check,
  Eye,
  FileSearch,
  Megaphone,
  Plus,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useCrew } from '@/lib/store';
import { HELP_CATEGORIES, PROTOCOL_STATUS, categoryLabel } from '@/lib/labels';
import type { HelpCategory, Protocol, ProtocolStatus } from '@/lib/types';
import { cn, formatDate, protocolCode } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input, Label, Select, TextArea } from '@/components/ui/field';
import { EmptyState, ErrorNote } from '@/components/ui/states';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

const FLOW: ProtocolStatus[] = ['borrador', 'en_validacion', 'aprobado', 'publicado'];

type Errors = Partial<Record<'title' | 'summary' | 'problem' | 'situation' | 'steps' | 'escalate' | 'origin', string>>;

function validate(p: Protocol): Errors {
  const e: Errors = {};
  if (p.title.trim().length < 5) e.title = 'El título debe tener al menos 5 caracteres.';
  if (p.summary.trim().length < 10) e.summary = 'Agrega un resumen corto (mínimo 10 caracteres).';
  if (p.problem.trim().length < 10) e.problem = 'Describe el problema (mínimo 10 caracteres).';
  if (p.situation.trim().length < 10) e.situation = 'Describe la situación (mínimo 10 caracteres).';
  if (p.steps.filter((s) => s.trim()).length < 2) e.steps = 'Incluye al menos 2 pasos de solución.';
  if (p.escalate.filter((s) => s.trim()).length < 1) e.escalate = 'Indica al menos un caso en el que se debe escalar.';
  if (p.origin.trim().length < 10) e.origin = 'Explica el origen de la solución.';
  return e;
}

export default function ProtocolEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state } = useCrew();
  const protocol = state.protocols.find((p) => p.id === id);
  if (!protocol) {
    return (
      <EmptyState
        className="mt-10"
        icon={<FileSearch className="h-6 w-6" />}
        title="Protocolo no encontrado"
        description="Puede que se haya eliminado."
        action={<ButtonLink href="/admin/protocolos">Volver a protocolos</ButtonLink>}
      />
    );
  }
  return <Editor key={protocol.id} protocol={protocol} />;
}

function ListEditor({
  label,
  items,
  onChange,
  placeholder,
  numbered,
  error,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  numbered?: boolean;
  error?: string;
}) {
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              className={cn(
                'mt-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold',
                numbered ? 'bg-brand-gradient text-white' : 'bg-sun-100 text-sun-700',
              )}
            >
              {numbered ? i + 1 : '!'}
            </span>
            <TextArea
              value={it}
              onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))}
              placeholder={placeholder}
              className="min-h-[52px] py-2.5 text-sm"
              rows={2}
              aria-label={`${label} ${i + 1}`}
            />
            <div className="flex shrink-0 flex-col">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 disabled:opacity-30" aria-label="Subir">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 disabled:opacity-30"
                aria-label="Bajar"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.length > 1 ? items.filter((_, k) => k !== i) : [''])}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-brand-50 hover:text-brand-600"
                aria-label="Eliminar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="mt-2 inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm font-bold text-brand-600 hover:bg-brand-50"
      >
        <Plus className="h-4 w-4" /> Agregar
      </button>
      {error && <ErrorNote className="mt-1">{error}</ErrorNote>}
    </div>
  );
}

function Editor({ protocol }: { protocol: Protocol }) {
  const { state, saveProtocol, setProtocolStatus, deleteProtocol } = useCrew();
  const { toast } = useToast();
  const router = useRouter();
  const [draft, setDraft] = useState<Protocol>(protocol);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [contributors, setContributors] = useState(protocol.contributors.join(', '));

  // Mantener el estado sincronizado cuando cambia desde el store (p. ej. transición de estado).
  useEffect(() => {
    setDraft((d) => ({ ...d, status: protocol.status, updatedAt: protocol.updatedAt }));
  }, [protocol.status, protocol.updatedAt]);

  const current = useMemo<Protocol>(
    () => ({
      ...draft,
      contributors: contributors
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }),
    [draft, contributors],
  );

  const dirty = JSON.stringify({ ...current, status: 0, updatedAt: 0 }) !== JSON.stringify({ ...protocol, status: 0, updatedAt: 0 });
  const cluster = state.clusters.find((c) => c.id === protocol.clusterId);
  const set = <K extends keyof Protocol>(k: K, v: Protocol[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    if (errors[k as keyof Errors]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const clean = (p: Protocol): Protocol => ({
    ...p,
    steps: p.steps.map((s) => s.trim()).filter(Boolean),
    escalate: p.escalate.map((s) => s.trim()).filter(Boolean),
  });

  const save = async (silent = false) => {
    const e = validate(current);
    setErrors(e);
    if (Object.keys(e).length) {
      toast({ tone: 'error', title: 'Revisa los campos marcados', description: 'Faltan datos para guardar el protocolo.' });
      return false;
    }
    setBusy('save');
    const cleaned = clean(current);
    await saveProtocol(cleaned);
    setDraft(cleaned);
    setBusy(null);
    if (!silent) toast({ tone: 'success', title: 'Cambios guardados' });
    return true;
  };

  const transition = async (next: ProtocolStatus, label: string) => {
    if (dirty || next !== 'borrador') {
      const ok = await save(true);
      if (!ok) return;
    }
    setBusy(next);
    await setProtocolStatus(protocol.id, next);
    setBusy(null);
    const msgs: Record<ProtocolStatus, string> = {
      borrador: 'Devuelto a borrador para ajustes.',
      en_validacion: 'Enviado al equipo de validación de Rappi.',
      aprobado: 'Aprobado. Ya puedes publicarlo.',
      publicado: 'Publicado. Ya es visible para toda la Crew.',
    };
    toast({ tone: 'success', title: label, description: msgs[next] });
  };

  const stepIdx = FLOW.indexOf(protocol.status);

  return (
    <div>
      <Link href="/admin/protocolos" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900">
        ← Gestión de protocolos
      </Link>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">{protocolCode(protocol.number)}</p>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[32px]">
            {current.title || 'Nuevo protocolo'}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone={PROTOCOL_STATUS[protocol.status].tone} dot>
              {PROTOCOL_STATUS[protocol.status].label}
            </Badge>
            {dirty && <Badge tone="sun">Cambios sin guardar</Badge>}
            <span className="text-xs text-ink-400">Actualizado {formatDate(protocol.updatedAt)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/protocolos/${protocol.id}`} variant="secondary" size="sm" icon={<Eye className="h-4 w-4" />}>
            Vista previa
          </ButtonLink>
          <Button variant="secondary" size="sm" loading={busy === 'save'} disabled={!dirty || !!busy} icon={<Save className="h-4 w-4" />} onClick={() => save()}>
            Guardar
          </Button>
        </div>
      </div>

      {/* Stepper de estado */}
      <Card className="mb-6 p-4 sm:p-5">
        <ol className="grid grid-cols-4 gap-2">
          {[
            { s: 'borrador', label: 'Crear', icon: Save },
            { s: 'en_validacion', label: 'Validar', icon: ShieldCheck },
            { s: 'aprobado', label: 'Aprobar', icon: BadgeCheck },
            { s: 'publicado', label: 'Publicar', icon: Megaphone },
          ].map((st, i) => {
            const done = i < stepIdx || protocol.status === 'publicado';
            const active = i === stepIdx;
            return (
              <li key={st.s} className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition',
                    done ? 'bg-mint-500 text-white' : active ? 'bg-brand-gradient text-white shadow-glow' : 'bg-ink-100 text-ink-400',
                  )}
                >
                  {done ? <Check className="h-5 w-5" /> : <st.icon className="h-5 w-5" />}
                </span>
                <span className={cn('mt-1.5 text-xs font-bold', active || done ? 'text-ink-900' : 'text-ink-400')}>{st.label}</span>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 flex flex-col gap-2 border-t border-ink-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-500">
            {protocol.status === 'borrador' && 'Completa el contenido y envíalo a validación.'}
            {protocol.status === 'en_validacion' && 'El equipo de Rappi revisa que la solución sea correcta y segura.'}
            {protocol.status === 'aprobado' && 'Validado por Rappi. Publícalo para que lo vea toda la Crew.'}
            {protocol.status === 'publicado' && 'Publicado y visible para los Rappitenderos.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {protocol.status === 'borrador' && (
              <>
                <Button variant="ghost" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmDelete(true)}>
                  Eliminar
                </Button>
                <Button size="sm" loading={busy === 'en_validacion'} disabled={!!busy} icon={<Send className="h-4 w-4" />} onClick={() => transition('en_validacion', 'Enviado a validación')}>
                  Enviar a validación
                </Button>
              </>
            )}
            {protocol.status === 'en_validacion' && (
              <>
                <Button variant="secondary" size="sm" loading={busy === 'borrador'} disabled={!!busy} icon={<RotateCcw className="h-4 w-4" />} onClick={() => transition('borrador', 'Devuelto a borrador')}>
                  Pedir ajustes
                </Button>
                <Button variant="mint" size="sm" loading={busy === 'aprobado'} disabled={!!busy} icon={<BadgeCheck className="h-4 w-4" />} onClick={() => transition('aprobado', 'Protocolo aprobado')}>
                  Aprobar protocolo
                </Button>
              </>
            )}
            {protocol.status === 'aprobado' && (
              <>
                <Button variant="secondary" size="sm" loading={busy === 'borrador'} disabled={!!busy} icon={<RotateCcw className="h-4 w-4" />} onClick={() => transition('borrador', 'Devuelto a borrador')}>
                  Volver a borrador
                </Button>
                <Button size="sm" loading={busy === 'publicado'} disabled={!!busy} icon={<Megaphone className="h-4 w-4" />} onClick={() => transition('publicado', 'Protocolo publicado')}>
                  Publicar protocolo
                </Button>
              </>
            )}
            {protocol.status === 'publicado' && (
              <ButtonLink href={`/protocolos/${protocol.id}`} size="sm" variant="mint" icon={<Eye className="h-4 w-4" />}>
                Ver como Rappitendero
              </ButtonLink>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={draft.title} onChange={(e) => set('title', e.target.value)} invalid={!!errors.title} />
              {errors.title && <ErrorNote className="mt-1">{errors.title}</ErrorNote>}
            </div>
            <div>
              <Label htmlFor="cat">Categoría</Label>
              <Select id="cat" value={draft.category} onChange={(e) => set('category', e.target.value as HelpCategory)}>
                {HELP_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="summary" hint="Aparece en las tarjetas">
              Resumen
            </Label>
            <Input id="summary" value={draft.summary} onChange={(e) => set('summary', e.target.value)} invalid={!!errors.summary} />
            {errors.summary && <ErrorNote className="mt-1">{errors.summary}</ErrorNote>}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="problem">Problema</Label>
              <TextArea id="problem" value={draft.problem} onChange={(e) => set('problem', e.target.value)} invalid={!!errors.problem} />
              {errors.problem && <ErrorNote className="mt-1">{errors.problem}</ErrorNote>}
            </div>
            <div>
              <Label htmlFor="situation">Situación</Label>
              <TextArea id="situation" value={draft.situation} onChange={(e) => set('situation', e.target.value)} invalid={!!errors.situation} />
              {errors.situation && <ErrorNote className="mt-1">{errors.situation}</ErrorNote>}
            </div>
          </div>
          <ListEditor
            label="Solución paso a paso"
            items={draft.steps}
            onChange={(v) => set('steps', v)}
            placeholder="Describe el paso…"
            numbered
            error={errors.steps}
          />
          <ListEditor
            label="Cuándo escalar"
            items={draft.escalate}
            onChange={(v) => set('escalate', v)}
            placeholder="Ej.: Si el pedido contiene medicamentos…"
            error={errors.escalate}
          />
          <div>
            <Label htmlFor="origin">Origen de la solución</Label>
            <TextArea id="origin" value={draft.origin} onChange={(e) => set('origin', e.target.value)} className="min-h-[80px]" invalid={!!errors.origin} />
            {errors.origin && <ErrorNote className="mt-1">{errors.origin}</ErrorNote>}
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
            <div>
              <Label htmlFor="contrib" hint="Separados por coma">
                Rappitenderos que aportaron
              </Label>
              <Input id="contrib" value={contributors} onChange={(e) => setContributors(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="count">Experiencias</Label>
              <Input
                id="count"
                type="number"
                min={0}
                value={draft.experiencesCount}
                onChange={(e) => set('experiencesCount', Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button variant="dark" loading={busy === 'save'} disabled={!dirty || !!busy} icon={<Save className="h-4 w-4" />} onClick={() => save()}>
              Guardar cambios
            </Button>
          </div>
        </Card>

        {/* Vista previa */}
        <div className="space-y-4 xl:sticky xl:top-10 xl:self-start">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Vista previa para Rappitenderos</p>
          <Card className="overflow-hidden">
            <div className="bg-ink-gradient p-5 text-white">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-300">{protocolCode(protocol.number)}</p>
              <p className="mt-1 text-xl font-extrabold leading-tight">{current.title || 'Sin título'}</p>
              <span className="mt-3 inline-flex rounded-full bg-mint-500 px-2.5 py-1 text-[11px] font-bold">✓ Validado por Rappi</span>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <p className="text-ink-500">{categoryLabel(current.category)}</p>
              <p className="text-ink-700">
                <b>Problema:</b> {current.problem || '—'}
              </p>
              <ol className="space-y-1.5">
                {current.steps.filter((s) => s.trim()).map((s, i) => (
                  <li key={i} className="flex gap-2 text-ink-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">{i + 1}</span>
                    <span className="line-clamp-2">{s}</span>
                  </li>
                ))}
              </ol>
              <p className="rounded-xl bg-mint-50 p-2.5 text-xs font-semibold text-mint-700">
                Este protocolo fue construido a partir de experiencias reales y validado por Rappi.
              </p>
            </div>
          </Card>
          {cluster && (
            <Card className="p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Patrón de origen</p>
              <Link href={`/admin/patrones#${cluster.id}`} className="mt-1 block font-bold text-ink-900 hover:text-brand-600">
                {cluster.title}
              </Link>
              <p className="text-xs text-ink-500">
                {cluster.cases} casos · {cluster.zones.join(', ')}
              </p>
            </Card>
          )}
        </div>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="¿Eliminar este borrador?"
        description="El patrón de origen volverá a estado “En análisis”. Esta acción no se puede deshacer."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="dark"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => {
                deleteProtocol(protocol.id);
                toast({ tone: 'success', title: 'Borrador eliminado' });
                router.push('/admin/protocolos');
              }}
            >
              Eliminar
            </Button>
          </>
        }
      />
    </div>
  );
}

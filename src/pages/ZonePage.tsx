import { useState } from 'react';
import { ArrowLeftRight, Check, CircleCheck, Info, MapPin } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Disclaimer, Section } from '../components/Section';
import { useToast } from '../components/Toast';
import { ZoneMap } from '../components/ZoneMap';
import { MAX_PREFERRED_ZONES } from '../data/config';
import { zones } from '../data/mock';

const flow = [
  'Indicas tus zonas preferidas.',
  'Rappi recibe esa información.',
  'Si hay disponibilidad y la operación lo permite, se priorizan pedidos en esas zonas.',
  'Si no hay disponibilidad, la operación continúa normalmente.',
];

interface ZonePageProps {
  saved: number[];
  onSave: (zones: number[]) => void;
}

export function ZonePage({ saved, onSave }: ZonePageProps) {
  const toast = useToast();
  const [draft, setDraft] = useState<number[]>(saved);
  const [justSaved, setJustSaved] = useState(false);

  const dirty = draft.join() !== saved.join();

  const toggle = (id: number) => {
    setJustSaved(false);
    setDraft((current) => {
      if (current.includes(id)) return current.filter((z) => z !== id);
      if (current.length >= MAX_PREFERRED_ZONES) {
        toast(`Puedes elegir máximo ${MAX_PREFERRED_ZONES} zonas`);
        return current;
      }
      return [...current, id];
    });
  };

  const swap = () => {
    setJustSaved(false);
    setDraft((current) => [...current].reverse());
  };

  const save = () => {
    onSave(draft);
    setJustSaved(true);
    toast('✓ Zona actualizada');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Mi zona" subtitle="Elige las zonas donde prefieres trabajar." />

      <div className="card -mt-2 animate-fade-up p-4" style={{ animationDelay: '60ms' }}>
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-[13px] font-bold text-ink-700">Mapa de zonas</p>
          <p className="text-[12px] font-semibold text-ink-400">
            {draft.length}/{MAX_PREFERRED_ZONES} elegidas
          </p>
        </div>
        <ZoneMap selected={draft} onToggle={toggle} />
        <div className="mt-3 flex items-center justify-center gap-4 text-[11.5px] font-semibold text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-brand-500" /> Principal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-brand-300 bg-brand-100" /> Alternativa
          </span>
        </div>
      </div>

      <Section title="Tus zonas preferidas" subtitle={`Máximo ${MAX_PREFERRED_ZONES} zonas.`} delay={120}>
        <div className="space-y-2">
          {zones.map((zone) => {
            const role = draft.indexOf(zone.id);
            const selected = role >= 0;
            return (
              <button
                key={zone.id}
                onClick={() => toggle(zone.id)}
                className={`flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition-all active:scale-[0.99] ${
                  selected ? 'bg-white shadow-card ring-2 ring-brand-400' : 'bg-white/60 ring-1 ring-ink-100 hover:bg-white'
                }`}
                aria-pressed={selected}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-all ${
                    selected ? 'bg-brand-gradient text-white' : 'border-2 border-ink-200'
                  }`}
                >
                  {selected && <Check size={15} strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold">
                    Zona {zone.id} — {zone.name}
                  </span>
                  <span className="block truncate text-[12px] text-ink-400">{zone.area}</span>
                </span>
                {selected && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      role === 0 ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-700'
                    }`}
                  >
                    {role === 0 ? 'Principal' : 'Alternativa'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {draft.length === 0 && (
          <div className="mt-3">
            <EmptyState
              icon={<MapPin size={22} />}
              title="Aún no eliges zonas"
              text="Toca una zona en el mapa o en la lista para marcarla como preferida."
            />
          </div>
        )}

        {draft.length === 2 && (
          <button onClick={swap} className="mt-3 flex w-full items-center justify-center gap-2 py-1 text-[13px] font-bold text-brand-600">
            <ArrowLeftRight size={15} /> Intercambiar principal y alternativa
          </button>
        )}
      </Section>

      <div className="flex gap-3 rounded-2xl bg-sky-50 p-4 text-sky-900 animate-fade-up" style={{ animationDelay: '180ms' }}>
        <Info size={18} className="mt-0.5 shrink-0 text-sky-600" />
        <p className="text-[13px] font-medium leading-relaxed">
          Rappi utilizará tus preferencias para priorizar pedidos dentro de estas zonas cuando exista disponibilidad.
        </p>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '220ms' }}>
        {justSaved && !dirty ? (
          <div className="flex animate-scale-in items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-3.5 text-[15px] font-bold text-emerald-700">
            <CircleCheck size={19} /> Preferencias actualizadas ✓
          </div>
        ) : (
          <button className="btn-primary w-full" disabled={!dirty} onClick={save}>
            Guardar preferencias
          </button>
        )}
        {!dirty && !justSaved && draft.length > 0 && (
          <p className="mt-2 text-center text-[12.5px] font-medium text-ink-400">Tu zona preferida está guardada.</p>
        )}
      </div>

      <Section title="¿Cómo funciona?" delay={260}>
        <ol className="card space-y-0 p-4">
          {flow.map((step, i) => (
            <li key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-extrabold ${
                    i === flow.length - 1 ? 'bg-ink-100 text-ink-500' : 'bg-brand-50 text-brand-600'
                  }`}
                >
                  {i + 1}
                </span>
                {i < flow.length - 1 && <span className="my-1 w-px flex-1 bg-ink-200" />}
              </div>
              <p className={`pb-4 pt-1 text-[13.5px] leading-snug ${i === flow.length - 1 ? 'text-ink-500' : 'text-ink-700'}`}>
                {step}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Disclaimer>Es una preferencia, no una garantía: depende de la operación y la disponibilidad.</Disclaimer>
    </div>
  );
}

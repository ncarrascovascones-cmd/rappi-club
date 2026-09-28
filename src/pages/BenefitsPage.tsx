import { useRef, useState, type ReactNode } from 'react';
import { Check, Handshake, SearchX } from 'lucide-react';
import { BenefitCard } from '../components/Benefit';
import { EmptyState } from '../components/EmptyState';
import { LevelEmblem } from '../components/LevelEmblem';
import { levelTheme } from '../components/levelTheme';
import { PageHeader } from '../components/PageHeader';
import { ConceptTag, Disclaimer } from '../components/Section';
import { LEVELS, type LevelId } from '../data/config';
import { benefits, categories, levelComparison, partners, type Benefit, type CategoryId } from '../data/mock';

type View = 'catalog' | 'levels' | 'partners';

const views: { id: View; label: string }[] = [
  { id: 'catalog', label: 'Catálogo' },
  { id: 'levels', label: 'Por nivel' },
  { id: 'partners', label: 'Aliados' },
];

interface BenefitsPageProps {
  userLevel: LevelId;
  onOpenBenefit: (b: Benefit) => void;
}

export function BenefitsPage({ userLevel, onOpenBenefit }: BenefitsPageProps) {
  const [view, setView] = useState<View>('catalog');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const rootRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => rootRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'smooth' });

  const visibleCategories = category === 'all' ? categories : categories.filter((c) => c.id === category);

  return (
    <div ref={rootRef}>
      <PageHeader title="Tus beneficios" subtitle="Ser parte de Rappi Club tiene beneficios." />

      {/* Selector de vista */}
      <div className="sticky -top-5 z-20 -mx-5 -mt-4 animate-fade-up bg-surface/95 px-5 pb-3 pt-5 backdrop-blur-lg">
        <div className="grid grid-cols-3 rounded-2xl bg-ink-100 p-1">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setView(v.id);
                scrollToTop();
              }}
              className={`rounded-xl py-2 text-[13.5px] font-bold transition-all ${
                view === v.id ? 'bg-white text-ink shadow-card' : 'text-ink-500'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {view === 'catalog' && (
          <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 no-scrollbar">
            <Chip
              active={category === 'all'}
              onClick={() => {
                setCategory('all');
                scrollToTop();
              }}
            >
              ✨ Todos
            </Chip>
            {categories.map((c) => (
              <Chip
                key={c.id}
                active={category === c.id}
                onClick={() => {
                  setCategory(c.id);
                  scrollToTop();
                }}
              >
                {c.emoji} {c.label}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <div key={view} className="mt-3 animate-fade-up">
        {view === 'catalog' && (
          <div className="space-y-6">
            {visibleCategories.map((c) => {
              const items = benefits.filter((b) => b.category === c.id);
              return (
                <div key={c.id}>
                  <p className="mb-2.5 px-1 text-[14px] font-extrabold text-ink-700">
                    {c.emoji} {c.label}
                  </p>
                  {items.length ? (
                    <div className="space-y-2.5">
                      {items.map((b) => (
                        <BenefitCard key={b.id} benefit={b} userLevel={userLevel} onOpen={onOpenBenefit} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<SearchX size={22} />}
                      title="Pronto habrá beneficios aquí"
                      text="Estamos sumando aliados en esta categoría."
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {view === 'levels' && <LevelComparison userLevel={userLevel} />}
        {view === 'partners' && <PartnersNetwork />}
      </div>

      <Disclaimer className="mt-8">Beneficios sujetos a disponibilidad y condiciones de cada aliado.</Disclaimer>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all ${
        active ? 'bg-ink text-white' : 'bg-white text-ink-700 shadow-card'
      }`}
    >
      {children}
    </button>
  );
}

function LevelComparison({ userLevel }: { userLevel: LevelId }) {
  return (
    <div className="space-y-3">
      <p className="px-1 text-[14px] text-ink-500">
        Todos los niveles tienen beneficios. Con tu constancia, se vuelven mejores.
      </p>
      {LEVELS.map((level) => {
        const isCurrent = level.id === userLevel;
        return (
          <div
            key={level.id}
            className={`card p-4 transition ${isCurrent ? `ring-2 ${levelTheme[level.id].ring}` : ''}`}
          >
            <div className="flex items-center gap-3">
              <LevelEmblem level={level} size="sm" />
              <div className="flex-1">
                <p className="text-[15px] font-extrabold uppercase tracking-wide">{level.name}</p>
                <p className="text-[12.5px] text-ink-500">{level.tagline}</p>
              </div>
              {isCurrent && (
                <span className="rounded-full bg-ink px-2.5 py-1 text-[10.5px] font-bold text-white">Tu nivel</span>
              )}
            </div>
            <ul className="mt-3 space-y-1.5 pl-1">
              {levelComparison[level.id].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[13.5px] font-medium text-ink-700">
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${levelTheme[level.id].soft} ${levelTheme[level.id].text}`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <div className="flex justify-center pt-1">
        <ConceptTag />
      </div>
    </div>
  );
}

function PartnersNetwork() {
  return (
    <div>
      <div className="card mb-4 flex items-center gap-3 p-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <Handshake size={21} />
        </div>
        <div>
          <p className="text-[15px] font-extrabold">Red de aliados</p>
          <p className="text-[12.5px] leading-snug text-ink-500">
            Los beneficios pueden desarrollarse mediante alianzas comerciales.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {partners.map((p, i) => (
          <div
            key={p.id}
            className="card flex animate-fade-up flex-col items-center p-4 text-center"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div
              className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${p.tone} text-[17px] font-black text-white shadow-soft`}
            >
              {p.initials}
            </div>
            <p className="mt-2.5 text-[14px] font-extrabold">{p.name}</p>
            <p className="text-[12px] text-ink-500">{p.kind}</p>
          </div>
        ))}
        <div className="grid place-items-center rounded-3xl border-2 border-dashed border-ink-200 p-4 text-center">
          <p className="text-[12.5px] font-semibold text-ink-400">+ Nuevos aliados</p>
        </div>
      </div>

      <p className="mt-4 text-center text-[11.5px] text-ink-400">
        Nombres y logos ficticios, creados solo para este prototipo.
      </p>
    </div>
  );
}

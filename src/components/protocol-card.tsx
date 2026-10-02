import Link from 'next/link';
import { BadgeCheck, Clock, Eye, ThumbsUp } from 'lucide-react';
import type { Protocol } from '@/lib/types';
import { categoryLabel } from '@/lib/labels';
import { cn, formatNumber, protocolShort } from '@/lib/utils';
import { CategoryIcon } from './category-icon';

export function ProtocolCard({ protocol, className, compact }: { protocol: Protocol; className?: string; compact?: boolean }) {
  return (
    <Link
      href={`/protocolos/${protocol.id}`}
      className={cn(
        'group flex flex-col rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink-900/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <CategoryIcon category={protocol.category} />
        <span className="inline-flex items-center gap-1 rounded-full bg-mint-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-mint-700">
          <BadgeCheck className="h-3.5 w-3.5" /> Validado por Rappi
        </span>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
        Protocolo Crew {protocolShort(protocol.number)}
      </p>
      <p className="mt-1 text-[17px] font-extrabold leading-snug text-ink-900 group-hover:text-brand-600">{protocol.title}</p>
      {!compact && <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{protocol.summary}</p>}
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-xs font-semibold text-ink-400">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {protocol.readMinutes} min
        </span>
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" /> {formatNumber(protocol.views)}
        </span>
        <span className="inline-flex items-center gap-1">
          <ThumbsUp className="h-3.5 w-3.5" /> {formatNumber(protocol.helpful)}
        </span>
        {!compact && <span className="ml-auto text-ink-400">{categoryLabel(protocol.category)}</span>}
      </div>
    </Link>
  );
}

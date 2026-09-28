import type { LevelId } from '../data/config';

/** Estilos visuales por nivel (clases estáticas para Tailwind). */
export const levelTheme: Record<
  LevelId,
  { gradient: string; soft: string; text: string; ring: string; bar: string }
> = {
  bronce: {
    gradient: 'from-[#E4A574] via-[#C07A45] to-[#8A4F2A]',
    soft: 'bg-[#FBF1EA]',
    text: 'text-[#9A5A2E]',
    ring: 'ring-[#E4A574]',
    bar: 'from-[#E4A574] to-[#8A4F2A]',
  },
  plata: {
    gradient: 'from-[#E6EAF0] via-[#B3BCC9] to-[#7A8595]',
    soft: 'bg-slate-100',
    text: 'text-slate-600',
    ring: 'ring-slate-300',
    bar: 'from-slate-300 to-slate-500',
  },
  oro: {
    gradient: 'from-[#FFE27A] via-[#F5C030] to-[#C98A08]',
    soft: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-300',
    bar: 'from-amber-300 to-amber-600',
  },
  diamante: {
    gradient: 'from-[#7CF0FF] via-[#7C8CFF] to-[#B46CFF]',
    soft: 'bg-indigo-50',
    text: 'text-indigo-600',
    ring: 'ring-indigo-300',
    bar: 'from-[#7CF0FF] via-[#7C8CFF] to-[#B46CFF]',
  },
};

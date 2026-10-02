import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'dark' | 'secondary' | 'ghost' | 'mint' | 'danger' | 'white';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-gradient text-white shadow-glow hover:brightness-[1.06] hover:-translate-y-px',
  dark: 'bg-ink-900 text-white hover:bg-ink-800 hover:-translate-y-px',
  secondary: 'bg-white text-ink-900 shadow-inset hover:bg-ink-50',
  ghost: 'text-ink-700 hover:bg-ink-100',
  mint: 'bg-mint-500 text-white hover:bg-mint-600 hover:-translate-y-px',
  danger: 'bg-white text-brand-700 shadow-inset hover:bg-brand-50',
  white: 'bg-white text-ink-900 hover:bg-brand-50 hover:-translate-y-px',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] rounded-xl',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

interface Common {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  iconRight,
  block,
  className,
  children,
  disabled,
  ...rest
}: Common & ComponentProps<'button'>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], block && 'w-full', className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  block,
  className,
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], block && 'w-full', className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}

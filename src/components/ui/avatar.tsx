import { cn } from '@/lib/utils';

export function Avatar({
  initials,
  color,
  size = 'md',
  ring,
  online,
  className,
}: {
  initials: string;
  color: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
  online?: boolean;
  className?: string;
}) {
  const sizes = {
    xs: 'h-7 w-7 text-[10px]',
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
  };
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full font-extrabold text-white',
          sizes[size],
          ring && 'ring-4 ring-white',
        )}
        style={{
          background: `linear-gradient(140deg, ${color} 0%, color-mix(in srgb, ${color} 70%, #0C0C11) 100%)`,
        }}
        aria-hidden
      >
        {initials}
      </span>
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-mint-400 ring-2 ring-white" />
      )}
    </span>
  );
}

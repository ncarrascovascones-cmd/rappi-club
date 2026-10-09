'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg';
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
      <button
        aria-label="Cerrar"
        className="absolute inset-0 animate-fade-in bg-ink-950/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative flex max-h-[92dvh] w-full animate-sheet-up flex-col rounded-t-[28px] bg-white shadow-lift sm:animate-scale-in sm:rounded-[28px]',
          size === 'md' ? 'sm:max-w-lg' : 'sm:max-w-2xl',
        )}
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-ink-200 sm:hidden" />
        <div className="flex items-start justify-between gap-4 px-6 pb-2 pt-4 sm:pt-6">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-ink-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="-mr-2 rounded-full p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 pb-4">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-ink-100 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Modal tipo "bottom sheet", contenido dentro del marco del teléfono. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[60] flex items-end" role="dialog" aria-modal="true" aria-label={title}>
      <button
        className="absolute inset-0 animate-fade-in bg-ink/45 backdrop-blur-[2px]"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div className="relative max-h-[88%] w-full animate-slide-up overflow-y-auto rounded-t-[28px] bg-white px-5 pb-8 pt-3 no-scrollbar">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-ink-200" />
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-[19px] font-extrabold tracking-tight">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-ink-100 text-ink-500 transition hover:bg-ink-200"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

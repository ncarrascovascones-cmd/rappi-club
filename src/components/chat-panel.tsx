'use client';

import { useEffect, useRef, useState } from 'react';
import { Info, MessageCircle, SendHorizonal } from 'lucide-react';
import { useCrew } from '@/lib/store';
import { cn, formatTime } from '@/lib/utils';
import { Avatar } from './ui/avatar';
import { Chip } from './ui/field';

export function ChatPanel({
  threadId,
  as,
  counterpart,
  suggestions = [],
  className,
}: {
  threadId: string;
  as: 'nuevo' | 'copiloto';
  counterpart: { name: string; initials: string; color: string; subtitle: string };
  suggestions?: string[];
  className?: string;
}) {
  const { state, sendMessage, typing } = useCrew();
  const messages = state.threads[threadId] ?? [];
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const isTyping = typing[threadId];

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isTyping]);

  const send = (value: string) => {
    const v = value.trim();
    if (!v) {
      setError(true);
      return;
    }
    setError(false);
    sendMessage(threadId, as, v);
    setText('');
  };

  return (
    <div
      className={cn(
        'flex h-[calc(100dvh-230px)] min-h-[440px] flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink-900/[0.04] lg:h-[calc(100dvh-220px)]',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3 sm:px-5">
        <Avatar initials={counterpart.initials} color={counterpart.color} size="sm" online />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-ink-900">{counterpart.name}</p>
          <p className="truncate text-xs text-ink-500">{isTyping ? 'escribiendo…' : counterpart.subtitle}</p>
        </div>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-surface/60 px-4 py-4 sm:px-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-ink-500">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-500 shadow-card">
              <MessageCircle className="h-6 w-6" />
            </span>
            <p className="font-bold text-ink-800">Empieza la conversación</p>
            <p className="mt-1 max-w-xs text-sm">Un saludo corto es suficiente para romper el hielo.</p>
          </div>
        )}
        {messages.map((m) => {
          if (m.from === 'system') {
            return (
              <div key={m.id} className="mx-auto flex max-w-md items-start gap-2 rounded-2xl bg-mint-50 px-3 py-2 text-xs text-mint-700 ring-1 ring-mint-100">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{m.text}</span>
              </div>
            );
          }
          const mine = m.from === as;
          return (
            <div key={m.id} className={cn('flex animate-fade-up items-end gap-2', mine ? 'justify-end' : 'justify-start')}>
              {!mine && <Avatar initials={counterpart.initials} color={counterpart.color} size="xs" />}
              <div
                className={cn(
                  'max-w-[78%] rounded-3xl px-4 py-2.5 text-[14px] leading-relaxed',
                  mine ? 'rounded-br-lg bg-ink-900 text-white' : 'rounded-bl-lg bg-white text-ink-800 shadow-sm ring-1 ring-ink-100',
                )}
              >
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <p className={cn('mt-1 text-right text-[10px]', mine ? 'text-white/50' : 'text-ink-400')}>{formatTime(m.at)}</p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-end gap-2">
            <Avatar initials={counterpart.initials} color={counterpart.color} size="xs" />
            <div className="flex gap-1 rounded-3xl rounded-bl-lg bg-white px-4 py-3.5 shadow-sm ring-1 ring-ink-100">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 animate-typing rounded-full bg-ink-400" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-ink-100 px-4 pt-3 sm:px-5">
          {suggestions.map((s) => (
            <Chip key={s} onClick={() => send(s)}>
              {s}
            </Chip>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
        className="flex items-center gap-2 px-4 py-3 sm:px-5"
      >
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(false);
          }}
          placeholder={error ? 'Escribe un mensaje antes de enviar' : 'Escribe un mensaje…'}
          aria-label="Mensaje"
          maxLength={600}
          className={cn(
            'h-12 flex-1 rounded-2xl bg-ink-50 px-4 text-[15px] ring-1 ring-inset placeholder:text-ink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400',
            error ? 'ring-brand-400 placeholder:text-brand-500' : 'ring-ink-200',
          )}
        />
        <button
          type="submit"
          aria-label="Enviar mensaje"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow transition active:scale-90"
        >
          <SendHorizonal className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

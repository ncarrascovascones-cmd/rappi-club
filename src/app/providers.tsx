'use client';

import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { CrewProvider } from '@/lib/store';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CrewProvider>{children}</CrewProvider>
    </ToastProvider>
  );
}

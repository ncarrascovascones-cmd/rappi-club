'use client';

import { Play } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { PitchSections } from '@/components/pitch-sections';
import { ButtonLink } from '@/components/ui/button';

export default function ComoFuncionaPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Cómo funciona"
        title="Rappi Crew, la escuela de la calle"
        description="Compartimos experiencia. Aprendemos todos. No aprendas a golpes: aprende de los que ya pasaron por ahí."
        actions={
          <ButtonLink href="/presentacion" variant="dark" size="sm" icon={<Play className="h-4 w-4" />}>
            Modo presentación
          </ButtonLink>
        }
      />
      <PitchSections />
    </div>
  );
}

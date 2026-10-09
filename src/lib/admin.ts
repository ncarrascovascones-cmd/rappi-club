import type { CrewState } from './store';
import type { FlowStep } from '@/components/admin-flow';

export function flowSteps(state: CrewState): FlowStep[] {
  const newExp = state.experiences.filter((e) => e.status === 'nueva').length;
  const detected = state.clusters.filter((c) => c.status === 'detectado').length;
  const analysing = state.clusters.filter((c) => c.status === 'en_analisis').length;
  const drafts = state.protocols.filter((p) => p.status === 'borrador').length;
  const validating = state.protocols.filter((p) => p.status === 'en_validacion').length;
  const approved = state.protocols.filter((p) => p.status === 'aprobado').length;
  return [
    { key: 'analizar', label: 'Analizar experiencias', count: newExp, hint: 'Experiencias nuevas sin revisar', href: '/admin/experiencias' },
    { key: 'patron', label: 'Identificar patrón', count: detected, hint: 'Patrones detectados por revisar', href: '/admin/patrones' },
    { key: 'solucion', label: 'Proponer solución', count: analysing, hint: 'Patrones en análisis', href: '/admin/patrones' },
    { key: 'crear', label: 'Crear protocolo', count: drafts, hint: 'Protocolos en borrador', href: '/admin/protocolos?s=borrador' },
    { key: 'validar', label: 'Validar', count: validating, hint: 'Esperando validación', href: '/admin/protocolos?s=en_validacion' },
    { key: 'publicar', label: 'Publicar', count: approved, hint: 'Aprobados listos para publicar', href: '/admin/protocolos?s=aprobado' },
  ];
}

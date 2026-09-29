'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  BENEFITS,
  CLUSTERS,
  COPILOT_REPLIES,
  COPILOTS,
  EXPERIENCES,
  HELP_REQUESTS,
  INITIAL_ONBOARDING,
  INITIAL_THREADS,
  INVITATIONS,
  MENTEES,
  PROTOCOLS,
  DEMO_RIDER,
  PRESENTATION_CLUSTER_ID,
  PRESENTATION_PROTOCOL_PRESET,
  TIMELINE,
  VOICES,
} from './demo-data';
import { isSupabaseEnabled } from './supabase/client';
import { fetchSnapshot, TABLES, upsertRemote, type RemoteTable } from './supabase/repository';
import type {
  ChatMessage,
  Cluster,
  ClusterStatus,
  Copilot,
  CopilotStatus,
  Experience,
  HelpCategory,
  HelpRequest,
  HelpStatus,
  IncidentReport,
  Invitation,
  Mentee,
  OnboardingStep,
  Protocol,
  ProtocolStatus,
  RiderProfile,
  Role,
  TimelineEvent,
} from './types';
import { delay, uid } from './utils';
import { useToast } from '@/components/ui/toast';

const STORAGE_KEY = 'rappi-crew-demo-v2';

export interface PresentationState {
  active: boolean;
  step: number;
  protocolId: string | null;
}

export interface CrewState {
  version: 2;
  role: Role | null;
  rider: RiderProfile;
  onboarding: OnboardingStep[];
  copilots: Copilot[];
  assignedCopilotId: string | null;
  pendingCopilotId: string | null;
  threads: Record<string, ChatMessage[]>;
  helpRequests: HelpRequest[];
  experiences: Experience[];
  clusters: Cluster[];
  protocols: Protocol[];
  savedProtocolIds: string[];
  helpfulProtocolIds: string[];
  benefitInterests: string[];
  thankedIds: string[];
  invitations: Invitation[];
  mentees: Mentee[];
  timeline: TimelineEvent[];
  incidents: IncidentReport[];
  copilotSelfStatus: CopilotStatus;
  presentation: PresentationState;
}

/** El Copiloto que usa el perfil demo "Copiloto" (Andrés). */
export const SELF_COPILOT_ID = 'c-andres';
export const RIDER_THREAD_ID = 'th-valentina';

function initialState(): CrewState {
  return {
    version: 2,
    role: null,
    rider: DEMO_RIDER,
    onboarding: INITIAL_ONBOARDING,
    copilots: COPILOTS,
    assignedCopilotId: 'c-andres',
    pendingCopilotId: null,
    threads: INITIAL_THREADS,
    helpRequests: HELP_REQUESTS,
    experiences: EXPERIENCES,
    clusters: CLUSTERS,
    protocols: PROTOCOLS,
    savedProtocolIds: [],
    helpfulProtocolIds: [],
    benefitInterests: [],
    thankedIds: [],
    invitations: INVITATIONS,
    mentees: MENTEES,
    timeline: TIMELINE,
    incidents: [],
    copilotSelfStatus: 'activo',
    presentation: { active: false, step: 0, protocolId: null },
  };
}

const nowIso = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

interface CrewContextValue {
  state: CrewState;
  hydrated: boolean;
  remoteEnabled: boolean;
  typing: Record<string, boolean>;
  benefits: typeof BENEFITS;
  voices: typeof VOICES;
  login: (role: Role) => void;
  logout: () => void;
  resetDemo: () => void;
  completeStep: (id: string) => void;
  sendMessage: (threadId: string, from: 'nuevo' | 'copiloto', text: string, replyText?: string) => void;
  requestCopilot: (copilotId: string) => Promise<void>;
  submitHelp: (input: { category: HelpCategory; text: string }) => Promise<HelpRequest>;
  rateHelp: (id: string, helpful: boolean) => void;
  shareExperience: (input: { category: HelpCategory; text: string; zone: string }) => Promise<Experience>;
  toggleThanks: (id: string) => void;
  toggleSaveProtocol: (id: string) => void;
  markProtocolHelpful: (id: string) => void;
  viewProtocol: (id: string) => void;
  registerBenefitInterest: (id: string) => Promise<void>;
  reportIncident: (input: { reason: string; text: string }) => Promise<void>;
  respondInvitation: (id: string, accept: boolean) => Promise<void>;
  setCopilotStatus: (status: CopilotStatus) => Promise<void>;
  // Admin
  groupExperiences: (
    ids: string[],
    target: { clusterId: string } | { title: string; category: HelpCategory },
  ) => string;
  setClusterStatus: (id: string, status: ClusterStatus) => void;
  createProtocol: (clusterId?: string, preset?: Partial<Protocol>) => string;
  saveProtocol: (protocol: Protocol) => Promise<void>;
  setProtocolStatus: (id: string, status: ProtocolStatus) => Promise<void>;
  deleteProtocol: (id: string) => void;
  setHelpStatus: (id: string, status: HelpStatus) => void;
  // Modo presentación
  startPresentation: () => void;
  setPresentation: (patch: Partial<PresentationState>) => void;
  stopPresentation: () => void;
}

const CrewContext = createContext<CrewContextValue | null>(null);

export function CrewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CrewState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const stateRef = useRef(state);
  stateRef.current = state;
  const remoteEnabled = isSupabaseEnabled();

  // Hidratación desde sessionStorage + Supabase (si está configurado).
  useEffect(() => {
    let cancelled = false;
    let base: CrewState | null = null;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CrewState;
        if (parsed?.version === 2) base = { ...initialState(), ...parsed };
      }
    } catch {
      // sessionStorage no disponible: seguimos con los datos demo.
    }
    if (base) setState(base);

    (async () => {
      if (remoteEnabled) {
        try {
          const snap = await fetchSnapshot();
          if (!cancelled && snap) {
            setState((s) => ({
              ...s,
              protocols: snap.protocols.length ? snap.protocols : s.protocols,
              experiences: snap.experiences.length ? snap.experiences : s.experiences,
              helpRequests: snap.helpRequests.length ? snap.helpRequests : s.helpRequests,
              clusters: snap.clusters.length ? snap.clusters : s.clusters,
            }));
          }
        } catch {
          if (!cancelled)
            toast({
              tone: 'error',
              title: 'No pudimos conectar con Supabase',
              description: 'Seguimos con los datos demo de esta sesión.',
            });
        }
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignorar: la demo sigue funcionando en memoria.
    }
  }, [state, hydrated]);

  const persist = useCallback(
    (table: RemoteTable, entity: Parameters<typeof upsertRemote>[1]) => {
      if (!remoteEnabled) return;
      upsertRemote(table, entity).catch(() =>
        toast({
          tone: 'error',
          title: 'No se pudo sincronizar',
          description: 'El cambio quedó guardado en esta sesión.',
        }),
      );
    },
    [remoteEnabled, toast],
  );

  const completeStep = useCallback((id: string) => {
    setState((s) =>
      s.onboarding.some((st) => st.id === id && !st.done)
        ? { ...s, onboarding: s.onboarding.map((st) => (st.id === id ? { ...st, done: true } : st)) }
        : s,
    );
  }, []);

  const login = useCallback((role: Role) => setState((s) => ({ ...s, role })), []);
  const logout = useCallback(() => setState((s) => ({ ...s, role: null })), []);
  const resetDemo = useCallback(() => {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setState((s) => ({ ...initialState(), role: s.role }));
    toast({ tone: 'success', title: 'Demo reiniciada', description: 'Volvimos a los datos iniciales.' });
  }, [toast]);

  const appendMessage = (threadId: string, msg: ChatMessage) =>
    setState((s) => ({
      ...s,
      threads: { ...s.threads, [threadId]: [...(s.threads[threadId] ?? []), msg] },
    }));

  const sendMessage = useCallback(
    (threadId: string, from: 'nuevo' | 'copiloto', text: string, replyText?: string) => {
      appendMessage(threadId, { id: uid('msg'), from, text, at: nowIso() });
      if (from === 'nuevo') completeStep('chat');
      const replier = from === 'nuevo' ? 'copiloto' : 'nuevo';
      setTyping((t) => ({ ...t, [threadId]: true }));
      window.setTimeout(() => {
        const count = stateRef.current.threads[threadId]?.length ?? 0;
        const reply = replyText
          ? replyText
          : replier === 'copiloto'
            ? COPILOT_REPLIES[count % COPILOT_REPLIES.length]
            : ['¡Gracias! Me sirve mucho 🙏', 'Listo, lo intento así en el próximo pedido.', 'Qué bueno saberlo, no tenía idea.'][
                count % 3
              ];
        appendMessage(threadId, { id: uid('msg'), from: replier, text: reply, at: nowIso() });
        setTyping((t) => ({ ...t, [threadId]: false }));
      }, 1800);
    },
    [completeStep],
  );

  const requestCopilot = useCallback(async (copilotId: string) => {
    setState((s) => ({ ...s, pendingCopilotId: copilotId }));
    await delay(2600);
    const cp = stateRef.current.copilots.find((c) => c.id === copilotId);
    setState((s) => ({
      ...s,
      pendingCopilotId: null,
      assignedCopilotId: copilotId,
      onboarding: s.onboarding.map((st) => (st.id === 'copiloto' ? { ...st, done: true } : st)),
      threads:
        copilotId === s.assignedCopilotId
          ? s.threads
          : {
              ...s.threads,
              [RIDER_THREAD_ID]: [
                {
                  id: uid('msg'),
                  from: 'system',
                  text: `${cp?.firstName ?? 'Tu Copiloto'} aceptó acompañarte como Copiloto de forma voluntaria. Recuerda: comparte experiencia práctica, no es soporte oficial.`,
                  at: nowIso(),
                },
                {
                  id: uid('msg'),
                  from: 'copiloto',
                  text: `¡Hola ${s.rider.firstName}! Soy ${cp?.firstName}. Me alegra acompañarte en estas primeras semanas. Escríbeme cuando quieras.`,
                  at: nowIso(),
                },
              ],
            },
      timeline: [
        {
          id: uid('t'),
          date: today(),
          title: `Match con ${cp?.firstName ?? 'tu Copiloto'}`,
          detail: `${cp?.firstName} aceptó acompañarte voluntariamente.`,
          kind: 'inicio',
        },
        ...s.timeline,
      ],
    }));
  }, []);

  const submitHelp = useCallback(
    async ({ category, text }: { category: HelpCategory; text: string }) => {
      await delay(2800);
      const s = stateRef.current;
      const protocol = s.protocols.find((p) => p.category === category && p.status === 'publicado');
      const cluster =
        s.clusters.find((c) => c.category === category && c.status !== 'publicado') ??
        s.clusters.find((c) => c.category === category);
      const similar =
        s.experiences.filter((e) => e.category === category).length + (cluster?.cases ?? 0);
      const req: HelpRequest = {
        id: uid('h'),
        category,
        text,
        createdAt: nowIso(),
        status: protocol ? 'resuelto' : 'recibido',
        riderName: s.role === 'copiloto' ? 'Andrés Rojas' : s.rider.name,
        zone: s.rider.zone,
        matchedProtocolId: protocol?.id,
        similarCount: similar,
        clusterId: cluster?.id,
      };
      setState((st) => ({
        ...st,
        helpRequests: [req, ...st.helpRequests],
        clusters: cluster
          ? st.clusters.map((c) => (c.id === cluster.id ? { ...c, cases: c.cases + 1 } : c))
          : st.clusters,
      }));
      persist(TABLES.helpRequests, req);
      return req;
    },
    [persist],
  );

  const rateHelp = useCallback((id: string, helpful: boolean) => {
    setState((s) => ({
      ...s,
      helpRequests: s.helpRequests.map((h) => (h.id === id ? { ...h, helpful } : h)),
    }));
  }, []);

  const shareExperience = useCallback(
    async ({ category, text, zone }: { category: HelpCategory; text: string; zone: string }) => {
      await delay(1500);
      const s = stateRef.current;
      const isCopilot = s.role === 'copiloto';
      const cp = s.copilots.find((c) => c.id === SELF_COPILOT_ID)!;
      const exp: Experience = {
        id: uid('e'),
        author: isCopilot ? cp.name : s.rider.name,
        initials: isCopilot ? cp.initials : s.rider.initials,
        color: isCopilot ? cp.color : s.rider.color,
        authorRole: isCopilot ? 'copiloto' : 'nuevo',
        months: isCopilot ? cp.monthsOnPlatform : 0,
        zone,
        category,
        text,
        createdAt: nowIso(),
        thanks: 0,
        status: 'nueva',
        mine: true,
      };
      setState((st) => ({
        ...st,
        experiences: [exp, ...st.experiences],
        onboarding: st.onboarding.map((o) => (o.id === 'posta' ? { ...o, done: true } : o)),
        copilots: isCopilot
          ? st.copilots.map((c) =>
              c.id === SELF_COPILOT_ID ? { ...c, experiencesShared: c.experiencesShared + 1 } : c,
            )
          : st.copilots,
      }));
      persist(TABLES.experiences, exp);
      return exp;
    },
    [persist],
  );

  const toggleThanks = useCallback((id: string) => {
    setState((s) => {
      const has = s.thankedIds.includes(id);
      return {
        ...s,
        thankedIds: has ? s.thankedIds.filter((x) => x !== id) : [...s.thankedIds, id],
        experiences: s.experiences.map((e) =>
          e.id === id ? { ...e, thanks: e.thanks + (has ? -1 : 1) } : e,
        ),
      };
    });
  }, []);

  const toggleSaveProtocol = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      savedProtocolIds: s.savedProtocolIds.includes(id)
        ? s.savedProtocolIds.filter((x) => x !== id)
        : [...s.savedProtocolIds, id],
    }));
  }, []);

  const markProtocolHelpful = useCallback((id: string) => {
    setState((s) =>
      s.helpfulProtocolIds.includes(id)
        ? s
        : {
            ...s,
            helpfulProtocolIds: [...s.helpfulProtocolIds, id],
            protocols: s.protocols.map((p) => (p.id === id ? { ...p, helpful: p.helpful + 1 } : p)),
          },
    );
  }, []);

  const viewProtocol = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      protocols: s.protocols.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p)),
      onboarding: s.onboarding.map((o) => (o.id === 'protocolo' ? { ...o, done: true } : o)),
    }));
  }, []);

  const registerBenefitInterest = useCallback(async (id: string) => {
    await delay(900);
    setState((s) => ({
      ...s,
      benefitInterests: s.benefitInterests.includes(id) ? s.benefitInterests : [...s.benefitInterests, id],
    }));
  }, []);

  const reportIncident = useCallback(
    async ({ reason, text }: { reason: string; text: string }) => {
      await delay(1400);
      const inc: IncidentReport = { id: uid('inc'), reason, text, createdAt: nowIso() };
      setState((s) => ({ ...s, incidents: [inc, ...s.incidents] }));
      persist(TABLES.incidents, inc);
    },
    [persist],
  );

  const respondInvitation = useCallback(async (id: string, accept: boolean) => {
    await delay(900);
    setState((s) => {
      const inv = s.invitations.find((i) => i.id === id);
      if (!inv) return s;
      const threadId = `th-${inv.id}`;
      const mentee: Mentee = {
        id: `me-${inv.id}`,
        name: inv.riderName,
        initials: inv.initials,
        color: inv.color,
        zone: inv.zone,
        vehicle: inv.vehicle,
        week: 1,
        progress: 10,
        lastContact: 'ahora',
        threadId,
        mood: 'dudas',
      };
      return {
        ...s,
        invitations: s.invitations.map((i) =>
          i.id === id ? { ...i, status: accept ? 'aceptada' : 'rechazada' } : i,
        ),
        mentees: accept ? [mentee, ...s.mentees] : s.mentees,
        threads: accept
          ? {
              ...s.threads,
              [threadId]: [
                {
                  id: uid('msg'),
                  from: 'system',
                  text: `Aceptaste acompañar a ${inv.riderName.split(' ')[0]}. Puedes pausar o dejar de participar cuando quieras.`,
                  at: nowIso(),
                },
              ],
            }
          : s.threads,
        copilots: accept
          ? s.copilots.map((c) =>
              c.id === SELF_COPILOT_ID ? { ...c, accompanied: c.accompanied + 1 } : c,
            )
          : s.copilots,
      };
    });
  }, []);

  const setCopilotStatus = useCallback(async (status: CopilotStatus) => {
    await delay(900);
    setState((s) => ({
      ...s,
      copilotSelfStatus: status,
      copilots: s.copilots.map((c) => (c.id === SELF_COPILOT_ID ? { ...c, status } : c)),
    }));
  }, []);

  // ---------- Admin ----------

  const groupExperiences = useCallback<CrewContextValue['groupExperiences']>(
    (ids, target) => {
      const clusterId = 'clusterId' in target ? target.clusterId : uid('cl');
      setState((s) => {
        let clusters = s.clusters;
        if ('clusterId' in target) {
          clusters = clusters.map((c) =>
            c.id === clusterId
              ? {
                  ...c,
                  experienceIds: Array.from(new Set([...c.experienceIds, ...ids])),
                  cases: c.cases + ids.length,
                }
              : c,
          );
        } else {
          const zones = Array.from(
            new Set(s.experiences.filter((e) => ids.includes(e.id)).map((e) => e.zone)),
          );
          const created: Cluster = {
            id: clusterId,
            title: target.title,
            category: target.category,
            cases: ids.length,
            experienceIds: ids,
            status: 'en_analisis',
            trend: 0,
            zones,
            createdAt: today(),
          };
          clusters = [created, ...clusters];
        }
        const updated = clusters.find((c) => c.id === clusterId);
        if (updated) persist(TABLES.clusters, updated);
        return {
          ...s,
          clusters,
          experiences: s.experiences.map((e) =>
            ids.includes(e.id) ? { ...e, status: 'agrupada', clusterId } : e,
          ),
        };
      });
      return clusterId;
    },
    [persist],
  );

  const setClusterStatus = useCallback(
    (id: string, status: ClusterStatus) => {
      setState((s) => ({
        ...s,
        clusters: s.clusters.map((c) => (c.id === id ? { ...c, status } : c)),
      }));
      const c = stateRef.current.clusters.find((x) => x.id === id);
      if (c) persist(TABLES.clusters, { ...c, status });
    },
    [persist],
  );

  const createProtocol = useCallback(
    (clusterId?: string, preset?: Partial<Protocol>) => {
      const s = stateRef.current;
      const cluster = s.clusters.find((c) => c.id === clusterId);
      if (clusterId === PRESENTATION_CLUSTER_ID && !preset) preset = PRESENTATION_PROTOCOL_PRESET;
      const exps = cluster ? s.experiences.filter((e) => cluster.experienceIds.includes(e.id)) : [];
      const number = Math.max(0, ...s.protocols.map((p) => p.number)) + 1;
      const protocol: Protocol = {
        id: uid('p'),
        number,
        title: cluster?.title ?? 'Nuevo protocolo',
        category: cluster?.category ?? 'otro',
        summary: '',
        problem: cluster ? `Rappitenderos reportan: ${cluster.title.toLowerCase()}.` : '',
        situation: cluster
          ? `Patrón detectado en ${cluster.zones.join(', ') || 'varias zonas'} con ${cluster.cases} casos reportados.`
          : '',
        steps: exps.length ? exps.slice(0, 3).map((e) => e.text) : [''],
        escalate: [''],
        origin: cluster
          ? `Construido a partir de ${cluster.cases} experiencias reales de la Crew.`
          : 'Construido a partir de experiencias reales de la Crew.',
        contributors: Array.from(new Set(exps.map((e) => e.author))),
        experiencesCount: cluster?.cases ?? 0,
        updatedAt: today(),
        status: 'borrador',
        views: 0,
        helpful: 0,
        readMinutes: 2,
        clusterId: cluster?.id,
        ...preset,
      };
      setState((st) => ({
        ...st,
        protocols: [protocol, ...st.protocols],
        clusters: st.clusters.map((c) =>
          c.id === clusterId ? { ...c, status: 'protocolo_en_borrador', protocolId: protocol.id } : c,
        ),
      }));
      persist(TABLES.protocols, protocol);
      return protocol.id;
    },
    [persist],
  );

  const saveProtocol = useCallback(
    async (protocol: Protocol) => {
      await delay(700);
      const next = { ...protocol, updatedAt: today() };
      setState((s) => ({ ...s, protocols: s.protocols.map((p) => (p.id === next.id ? next : p)) }));
      persist(TABLES.protocols, next);
    },
    [persist],
  );

  const setProtocolStatus = useCallback(
    async (id: string, status: ProtocolStatus) => {
      await delay(900);
      const clusterStatus: Record<ProtocolStatus, ClusterStatus> = {
        borrador: 'protocolo_en_borrador',
        en_validacion: 'en_validacion',
        aprobado: 'en_validacion',
        publicado: 'publicado',
      };
      setState((s) => {
        const p = s.protocols.find((x) => x.id === id);
        if (!p) return s;
        const next = { ...p, status, updatedAt: today() };
        persist(TABLES.protocols, next);
        const cluster = p.clusterId ? s.clusters.find((c) => c.id === p.clusterId) : undefined;
        return {
          ...s,
          protocols: s.protocols.map((x) => (x.id === id ? next : x)),
          clusters: s.clusters.map((c) =>
            c.id === p.clusterId ? { ...c, status: clusterStatus[status] } : c,
          ),
          experiences:
            status === 'publicado' && cluster
              ? s.experiences.map((e) =>
                  cluster.experienceIds.includes(e.id) ? { ...e, status: 'en_protocolo' } : e,
                )
              : s.experiences,
        };
      });
    },
    [persist],
  );

  const deleteProtocol = useCallback((id: string) => {
    setState((s) => {
      const p = s.protocols.find((x) => x.id === id);
      return {
        ...s,
        protocols: s.protocols.filter((x) => x.id !== id),
        clusters: s.clusters.map((c) =>
          p?.clusterId === c.id ? { ...c, status: 'en_analisis', protocolId: undefined } : c,
        ),
      };
    });
  }, []);

  const setHelpStatus = useCallback(
    (id: string, status: HelpStatus) => {
      setState((s) => ({
        ...s,
        helpRequests: s.helpRequests.map((h) => (h.id === id ? { ...h, status } : h)),
      }));
      const h = stateRef.current.helpRequests.find((x) => x.id === id);
      if (h) persist(TABLES.helpRequests, { ...h, status });
    },
    [persist],
  );

  const startPresentation = useCallback(() => {
    setState(() => ({
      ...initialState(),
      role: 'nuevo',
      presentation: { active: true, step: 0, protocolId: null },
    }));
  }, []);

  const setPresentation = useCallback((patch: Partial<PresentationState>) => {
    setState((s) => ({ ...s, presentation: { ...s.presentation, ...patch } }));
  }, []);

  const stopPresentation = useCallback(() => {
    setState((s) => ({ ...s, presentation: { ...s.presentation, active: false } }));
  }, []);

  const value = useMemo<CrewContextValue>(
    () => ({
      state,
      hydrated,
      remoteEnabled,
      typing,
      benefits: BENEFITS,
      voices: VOICES,
      login,
      logout,
      resetDemo,
      completeStep,
      sendMessage,
      requestCopilot,
      submitHelp,
      rateHelp,
      shareExperience,
      toggleThanks,
      toggleSaveProtocol,
      markProtocolHelpful,
      viewProtocol,
      registerBenefitInterest,
      reportIncident,
      respondInvitation,
      setCopilotStatus,
      groupExperiences,
      setClusterStatus,
      createProtocol,
      saveProtocol,
      setProtocolStatus,
      deleteProtocol,
      setHelpStatus,
      startPresentation,
      setPresentation,
      stopPresentation,
    }),
    [
      state,
      hydrated,
      remoteEnabled,
      typing,
      login,
      logout,
      resetDemo,
      completeStep,
      sendMessage,
      requestCopilot,
      submitHelp,
      rateHelp,
      shareExperience,
      toggleThanks,
      toggleSaveProtocol,
      markProtocolHelpful,
      viewProtocol,
      registerBenefitInterest,
      reportIncident,
      respondInvitation,
      setCopilotStatus,
      groupExperiences,
      setClusterStatus,
      createProtocol,
      saveProtocol,
      setProtocolStatus,
      deleteProtocol,
      setHelpStatus,
      startPresentation,
      setPresentation,
      stopPresentation,
    ],
  );

  return <CrewContext.Provider value={value}>{children}</CrewContext.Provider>;
}

export function useCrew() {
  const ctx = useContext(CrewContext);
  if (!ctx) throw new Error('useCrew debe usarse dentro de <CrewProvider>');
  return ctx;
}

/** Datos derivados de uso frecuente. */
export function useSelectors() {
  const { state } = useCrew();
  return useMemo(() => {
    const assigned = state.copilots.find((c) => c.id === state.assignedCopilotId) ?? null;
    const selfCopilot = state.copilots.find((c) => c.id === SELF_COPILOT_ID)!;
    const published = state.protocols.filter((p) => p.status === 'publicado');
    const onboardingPct = Math.round(
      (state.onboarding.filter((o) => o.done).length / state.onboarding.length) * 100,
    );
    return { assigned, selfCopilot, published, onboardingPct };
  }, [state]);
}

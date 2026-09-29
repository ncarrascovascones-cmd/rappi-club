'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import {
  BarChart3,
  BookOpen,
  Gift,
  Home,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Megaphone,
  Menu,
  Compass,
  Eye,
  Presentation,
  RotateCcw,
  Send,
  UserCheck,
  Users,
  Layers,
  Database,
  type LucideIcon,
} from 'lucide-react';
import { useCrew, useSelectors } from '@/lib/store';
import { DEMO_ADMIN } from '@/lib/demo-data';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Logo, LogoMark } from './logo';
import { Avatar } from './ui/avatar';
import { Modal } from './ui/modal';
import { PageSkeleton } from './ui/states';
import { DemoBadge } from './demo-badge';
import { PresentationBar } from './presentation-bar';

interface NavItem {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface RoleNav {
  /** Acciones principales, destacadas visualmente. */
  primary: NavItem[];
  /** Secciones de apoyo, más discretas. */
  secondary: NavItem[];
  mobile: string[];
  center?: string;
}

const HOW: NavItem = { href: '/como-funciona', label: 'Cómo funciona', short: 'Cómo funciona', icon: Compass };
const BENEFITS: NavItem = { href: '/beneficios', label: 'Beneficios Crew', short: 'Beneficios', icon: Gift };
const VOICE: NavItem = { href: '/voz-de-la-crew', label: 'La Voz de la Crew', short: 'La Voz', icon: Megaphone };
const HELP: NavItem = { href: '/necesito-una-mano', label: 'Necesito una mano', short: 'Una mano', icon: LifeBuoy };
const PROTOCOLS: NavItem = { href: '/protocolos', label: 'Protocolos Crew', short: 'Protocolos', icon: BookOpen };
const POSTA: NavItem = { href: '/pasa-la-posta', label: 'Pasa la Posta', short: 'Posta', icon: Send };

const NAV: Record<Role, RoleNav> = {
  nuevo: {
    primary: [
      { href: '/inicio', label: 'Inicio', short: 'Inicio', icon: Home },
      { href: '/mi-copiloto', label: 'Mi Copiloto', short: 'Copiloto', icon: Users },
      HELP,
      PROTOCOLS,
      POSTA,
    ],
    secondary: [HOW, BENEFITS, VOICE],
    mobile: ['/inicio', '/mi-copiloto', '/necesito-una-mano', '/protocolos', '/pasa-la-posta'],
    center: '/necesito-una-mano',
  },
  copiloto: {
    primary: [
      { href: '/copiloto', label: 'Mi panel de Copiloto', short: 'Panel', icon: LayoutDashboard, exact: true },
      POSTA,
      PROTOCOLS,
      HELP,
    ],
    secondary: [{ href: '/copiloto/perfil', label: 'Mi perfil', short: 'Perfil', icon: UserCheck }, HOW, BENEFITS, VOICE],
    mobile: ['/copiloto', '/protocolos', '/pasa-la-posta', '/necesito-una-mano', '/copiloto/perfil'],
    center: '/pasa-la-posta',
  },
  admin: {
    primary: [
      { href: '/admin', label: 'Resumen', short: 'Resumen', icon: LayoutDashboard, exact: true },
      { href: '/admin/experiencias', label: 'Experiencias y casos', short: 'Casos', icon: Inbox },
      { href: '/admin/patrones', label: 'Problemas recurrentes', short: 'Patrones', icon: Layers },
      { href: '/admin/protocolos', label: 'Gestión de protocolos', short: 'Protocolos', icon: BookOpen },
      { href: '/admin/analitica', label: 'Analítica', short: 'Analítica', icon: BarChart3 },
    ],
    secondary: [HOW, { href: '/protocolos', label: 'Ver como Rappitendero', short: 'Vista rider', icon: Eye }],
    mobile: ['/admin', '/admin/experiencias', '/admin/patrones', '/admin/protocolos', '/admin/analitica'],
  },
};

const ROLE_LABEL: Record<Role, string> = {
  nuevo: 'Nuevo Rappitendero',
  copiloto: 'Copiloto voluntario',
  admin: 'Administrador Rappi',
};

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const { state, hydrated, logout, resetDemo, remoteEnabled } = useCrew();
  const { selfCopilot } = useSelectors();
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const role = state.role;
  const presenting = state.presentation.active;

  useEffect(() => {
    if (hydrated && !role) router.replace('/');
  }, [hydrated, role, router]);

  useEffect(() => setMoreOpen(false), [pathname]);

  const nav = role ? NAV[role] : null;
  const all = nav ? [...nav.primary, ...nav.secondary] : [];
  const user =
    role === 'admin'
      ? { name: DEMO_ADMIN.name, initials: DEMO_ADMIN.initials, color: '#15151C' }
      : role === 'copiloto'
        ? { name: selfCopilot.name, initials: selfCopilot.initials, color: selfCopilot.color }
        : { name: state.rider.name, initials: state.rider.initials, color: state.rider.color };

  const switchProfile = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-dvh bg-surface">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col border-r border-ink-100 bg-white lg:flex">
        <div className="px-6 pb-3 pt-6">
          <Link href={nav ? nav.primary[0].href : '/'} aria-label="Ir al inicio">
            <Logo />
          </Link>
          <DemoBadge className="mt-3" />
        </div>
        {role === 'admin' && (
          <p className="mx-6 mb-1 mt-1 rounded-xl bg-ink-900 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white">
            Panel Rappi Crew
          </p>
        )}
        <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Navegación principal">
          <div className="space-y-1">
            {nav?.primary.map((item) => {
              const active = isActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] font-bold transition-all',
                    active ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl transition-all',
                      active ? 'bg-brand-gradient text-white shadow-glow' : 'bg-ink-50 text-ink-600 group-hover:bg-white',
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
          <p className="mb-1 mt-5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">También</p>
          <div className="space-y-0.5">
            {nav?.secondary.map((item) => {
              const active = isActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold transition',
                    active ? 'bg-ink-100 text-ink-900' : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="border-t border-ink-100 p-4">
          <Link
            href="/presentacion"
            className="mb-3 flex items-center gap-2.5 rounded-2xl bg-ink-900 px-3 py-2.5 text-[13px] font-bold text-white transition hover:bg-ink-800"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient">
              <Presentation className="h-4 w-4" />
            </span>
            <span className="whitespace-nowrap">Modo presentación</span>
            {presenting && <span className="ml-auto whitespace-nowrap rounded-full bg-brand-500 px-1.5 text-[10px]">EN CURSO</span>}
          </Link>
          <div className="flex items-center gap-3 rounded-2xl bg-ink-50 p-3">
            <Avatar initials={user.initials} color={user.color} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-900">{user.name}</p>
              <p className="truncate text-xs text-ink-500">{role ? ROLE_LABEL[role] : ''}</p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={switchProfile}
              className="flex items-center justify-center gap-1 whitespace-nowrap rounded-xl px-1 py-2 text-[11px] font-semibold text-ink-600 transition hover:bg-ink-100"
            >
              <LogOut className="h-3.5 w-3.5" /> Cambiar perfil
            </button>
            <button
              onClick={resetDemo}
              className="flex items-center justify-center gap-1 whitespace-nowrap rounded-xl px-1 py-2 text-[11px] font-semibold text-ink-600 transition hover:bg-ink-100"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reiniciar demo
            </button>
          </div>
          {remoteEnabled && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              <Database className="h-3 w-3" /> Conectado a Supabase
            </p>
          )}
        </div>
      </aside>

      {/* Header mobile */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-ink-100/70 bg-white/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href={nav ? nav.primary[0].href : '/'} aria-label="Ir al inicio">
          <Logo compact />
        </Link>
        <div className="flex items-center gap-2">
          <DemoBadge align="right" />
          <button
            onClick={() => setMoreOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-ink-50 py-1 pl-1 pr-2.5 text-xs font-semibold text-ink-700 transition active:scale-95"
            aria-label="Abrir menú"
          >
            <Avatar initials={user.initials} color={user.color} size="xs" />
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="lg:pl-[272px]">
        <div
          className={cn(
            'mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-10 lg:pt-10',
            presenting ? 'pb-64 lg:pb-48' : 'pb-32 lg:pb-16',
          )}
        >
          {!hydrated || !role ? <PageSkeleton /> : children}
        </div>
      </main>

      {hydrated && presenting && <PresentationBar />}

      {/* Bottom nav mobile */}
      {nav && (
        <nav
          aria-label="Navegación inferior"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto grid max-w-md grid-cols-5 px-2">
            {nav.mobile.map((href) => {
              const item = all.find((i) => i.href === href)!;
              const active = isActive(pathname, item);
              if (href === nav.center) {
                return (
                  <Link key={href} href={href} className="flex flex-col items-center justify-end pb-2" aria-label={item.label}>
                    <span
                      className={cn(
                        '-mt-5 flex h-14 w-14 items-center justify-center rounded-[20px] bg-brand-gradient text-white shadow-glow ring-4 ring-surface transition-transform active:scale-90',
                        active && 'scale-105',
                      )}
                    >
                      <item.icon className="h-6 w-6" />
                    </span>
                    <span className={cn('mt-1 text-[10px] font-bold', active ? 'text-brand-600' : 'text-ink-500')}>{item.short}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold transition',
                    active ? 'text-brand-600' : 'text-ink-400',
                  )}
                >
                  {active && <span className="absolute top-0 h-[3px] w-6 rounded-full bg-brand-500" />}
                  <item.icon className={cn('h-[22px] w-[22px] transition-transform', active && 'scale-110')} />
                  {item.short}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} title="Rappi Crew" description={role ? ROLE_LABEL[role] : undefined}>
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-ink-50 p-3">
          <Avatar initials={user.initials} color={user.color} size="md" />
          <div className="min-w-0">
            <p className="truncate font-bold text-ink-900">{user.name}</p>
            <p className="text-xs text-ink-500">{remoteEnabled ? 'Conectado a Supabase' : 'Modo demo · datos de ejemplo'}</p>
          </div>
          <LogoMark className="ml-auto h-8 w-8 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {nav?.primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className={cn(
                'flex items-center gap-2.5 rounded-2xl p-3 text-[13px] font-bold transition',
                isActive(pathname, item) ? 'bg-brand-50 text-brand-700' : 'bg-white text-ink-800 ring-1 ring-ink-100 hover:bg-ink-50',
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>
        <p className="mb-1 mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">También</p>
        <div className="divide-y divide-ink-100 rounded-2xl ring-1 ring-ink-100">
          {nav?.secondary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-semibold text-ink-600 hover:bg-ink-50"
            >
              <item.icon className="h-4 w-4 shrink-0" /> {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/presentacion"
          onClick={() => setMoreOpen(false)}
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-brand-gradient p-3 text-sm font-bold text-white shadow-glow"
        >
          <Presentation className="h-4 w-4" /> Modo presentación
        </Link>
        <div className="mt-2 grid grid-cols-2 gap-2 pb-2">
          <button onClick={switchProfile} className="flex items-center justify-center gap-2 rounded-2xl bg-ink-900 p-3 text-sm font-semibold text-white">
            <LogOut className="h-4 w-4" /> Cambiar perfil
          </button>
          <button
            onClick={() => {
              resetDemo();
              setMoreOpen(false);
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-ink-100 p-3 text-sm font-semibold text-ink-800"
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar demo
          </button>
        </div>
      </Modal>
    </div>
  );
}

/** Restringe una sección a ciertos perfiles, con salida clara si no corresponde. */
export function RoleGate({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { state, login } = useCrew();
  const router = useRouter();
  if (!state.role || allow.includes(state.role)) return <>{children}</>;
  const target = allow[0];
  const home: Record<Role, string> = { nuevo: '/inicio', copiloto: '/copiloto', admin: '/admin' };
  return (
    <div className="mx-auto max-w-md animate-fade-up rounded-3xl bg-white p-8 text-center shadow-card">
      <LogoMark className="mx-auto mb-4" />
      <p className="text-lg font-extrabold text-ink-900">Esta sección es para {ROLE_LABEL[target]}</p>
      <p className="mt-2 text-sm text-ink-500">
        Estás navegando como {ROLE_LABEL[state.role]}. Puedes cambiar de perfil demo para verla.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          onClick={() => login(target)}
          className="rounded-2xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
        >
          Entrar como {ROLE_LABEL[target]}
        </button>
        <button
          onClick={() => router.push(home[state.role!])}
          className="rounded-2xl bg-ink-100 px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-ink-200"
        >
          Volver a mi inicio
        </button>
      </div>
    </div>
  );
}

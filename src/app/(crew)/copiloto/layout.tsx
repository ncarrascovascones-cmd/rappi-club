import { RoleGate } from '@/components/app-shell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RoleGate allow={['copiloto']}>{children}</RoleGate>;
}

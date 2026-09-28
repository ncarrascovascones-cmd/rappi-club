import { useEffect, useMemo, useRef, useState } from 'react';
import { BenefitSheet } from './components/Benefit';
import { BottomNav, type TabId } from './components/BottomNav';
import { LevelUpModal } from './components/LevelUpModal';
import { PhoneFrame } from './components/PhoneFrame';
import { ToastProvider, useToast } from './components/Toast';
import { ordersCompleted, type LevelConfig } from './data/config';
import { initialPreferredZones, type Benefit } from './data/mock';
import { getLevelStatus } from './lib/levels';
import { BenefitsPage } from './pages/BenefitsPage';
import { HomePage } from './pages/HomePage';
import { LevelPage } from './pages/LevelPage';
import { ProfilePage } from './pages/ProfilePage';
import { RouteHomePage } from './pages/RouteHomePage';
import { WelcomePage } from './pages/WelcomePage';
import { ZonePage } from './pages/ZonePage';

type Overlay = 'profile' | 'route' | null;

export default function App() {
  const [entered, setEntered] = useState(false);

  return (
    <PhoneFrame statusBar={entered ? 'dark' : 'light'}>
      <ToastProvider>
        {entered ? <ClubApp onExit={() => setEntered(false)} /> : <WelcomePage onEnter={() => setEntered(true)} />}
      </ToastProvider>
    </PhoneFrame>
  );
}

function ClubApp({ onExit }: { onExit: () => void }) {
  const toast = useToast();
  const [tab, setTab] = useState<TabId>('home');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [orders, setOrders] = useState(ordersCompleted);
  const [preferredZones, setPreferredZones] = useState<number[]>(initialPreferredZones);
  const [routeActive, setRouteActive] = useState(false);
  const [benefit, setBenefit] = useState<Benefit | null>(null);
  const [levelUp, setLevelUp] = useState<LevelConfig | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const status = useMemo(() => getLevelStatus(orders), [orders]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [tab]);

  const changeOrders = (next: number) => {
    const before = getLevelStatus(orders);
    const after = getLevelStatus(next);
    setOrders(next);
    if (after.index > before.index) setLevelUp(after.level);
  };

  const toggleRoute = () => {
    toast(routeActive ? 'Ruta a Casa desactivada' : '🏠 Ruta a Casa activada');
    setRouteActive(!routeActive);
  };

  return (
    <div className="absolute inset-0 animate-fade-in md:top-11">
      <main ref={scrollRef} className="h-full overflow-y-auto px-5 pb-32 pt-5 no-scrollbar">
        <div key={tab}>
          {tab === 'home' && (
            <HomePage
              status={status}
              orders={orders}
              preferredZones={preferredZones}
              routeActive={routeActive}
              onNavigate={setTab}
              onOpenProfile={() => setOverlay('profile')}
              onOpenRoute={() => setOverlay('route')}
              onOpenBenefit={setBenefit}
            />
          )}
          {tab === 'benefits' && <BenefitsPage userLevel={status.level.id} onOpenBenefit={setBenefit} />}
          {tab === 'level' && <LevelPage status={status} orders={orders} onChangeOrders={changeOrders} />}
          {tab === 'zone' && <ZonePage saved={preferredZones} onSave={setPreferredZones} />}
        </div>
      </main>

      <BottomNav active={tab} onChange={setTab} />

      {overlay && (
        <div className="absolute inset-0 z-50 animate-slide-in-right overflow-y-auto bg-surface px-5 pb-12 pt-5 no-scrollbar">
          {overlay === 'route' && (
            <RouteHomePage active={routeActive} onToggle={toggleRoute} onBack={() => setOverlay(null)} />
          )}
          {overlay === 'profile' && (
            <ProfilePage
              status={status}
              preferredZones={preferredZones}
              onBack={() => setOverlay(null)}
              onRestartDemo={onExit}
            />
          )}
        </div>
      )}

      <BenefitSheet benefit={benefit} userLevel={status.level.id} onClose={() => setBenefit(null)} />

      <LevelUpModal
        level={levelUp}
        onClose={() => setLevelUp(null)}
        onSeeBenefits={() => {
          setLevelUp(null);
          setTab('benefits');
        }}
      />
    </div>
  );
}

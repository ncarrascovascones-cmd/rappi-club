import { useState } from 'react';
import { DemoPanel, type ViewMode } from './components/DemoPanel';
import { Phone, useFitScale } from './components/Phone';
import { PresentationPanel } from './components/PresentationPanel';
import { DriverApp } from './screens/driver/DriverApp';
import { ParentApp } from './screens/parent/ParentApp';
import { ProfileSelect, type Profile } from './screens/ProfileSelect';
import { StoreProvider } from './state/store';

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

function Shell() {
  // null = pantalla de selección de perfil
  const [view, setView] = useState<ViewMode | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const scale = useFitScale(view === 'dual' ? 120 : 48);

  const pick = (p: Profile) => setView(p);
  const toSelector = () => setView(null);

  return (
    <div className="min-h-[100dvh] w-full bg-surface md:bg-[radial-gradient(ellipse_at_top_left,#E6EEFF_0%,#F5F7FA_45%,#EEF1F6_100%)]">
      {view === 'dual' ? (
        <div className={`flex min-h-[100dvh] items-center justify-center gap-12 p-6 transition-[padding] duration-300 ${demoOpen ? 'xl:pr-[380px]' : ''}`}>
          <Phone variant="framed" scale={scale} label="App del conductor" tone="light">
            <DriverApp onSwitchProfile={toSelector} />
          </Phone>
          <Phone variant="framed" scale={scale} label="App del padre">
            <ParentApp onSwitchProfile={toSelector} />
          </Phone>
        </div>
      ) : (
        <div
          className={`flex min-h-[100dvh] items-center justify-center transition-[padding] duration-300 md:gap-16 md:p-6 ${demoOpen ? 'lg:pr-[380px]' : ''}`}
        >
          <PresentationPanel narrow={demoOpen} />
          <Phone scale={scale} tone={view === 'parent' ? 'dark' : 'light'}>
            {view === null && <ProfileSelect onPick={pick} />}
            {view === 'parent' && <ParentApp onSwitchProfile={toSelector} />}
            {view === 'driver' && <DriverApp onSwitchProfile={toSelector} />}
          </Phone>
        </div>
      )}

      <DemoPanel open={demoOpen} setOpen={setDemoOpen} view={view} setView={setView} />
    </div>
  );
}

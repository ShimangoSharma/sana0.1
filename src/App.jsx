import { AppProvider, useApp } from './store/AppContext';
import { useReminders } from './hooks/useReminders';

import Splash from './screens/Splash';
import OnboardingName from './screens/OnboardingName';
import OnboardingBasics from './screens/OnboardingBasics';
import OnboardingTreatments from './screens/OnboardingTreatments';
import Home from './screens/Home';
import LogEntry from './screens/LogEntry';
import EntrySaved from './screens/EntrySaved';
import Calendar from './screens/Calendar';
import EntryDetail from './screens/EntryDetail';
import Insights from './screens/Insights';
import Visits from './screens/Visits';
import Appointment from './screens/Appointment';
import Summary from './screens/Summary';
import Settings from './screens/Settings';
import Profile from './screens/Profile';

import BottomNav from './components/BottomNav';
import ConfirmModal from './components/ConfirmModal';
import LogoutModal from './components/LogoutModal';

const SCREENS = {
  splash: Splash,
  name: OnboardingName,
  basics: OnboardingBasics,
  treat: OnboardingTreatments,
  home: Home,
  log: LogEntry,
  saved: EntrySaved,
  calendar: Calendar,
  detail: EntryDetail,
  insights: Insights,
  visits: Visits,
  appt: Appointment,
  summary: Summary,
  settings: Settings,
  profile: Profile,
};

const MAIN_TABS = ['home', 'calendar', 'insights', 'visits', 'settings'];
const GREEN_SCREENS = ['splash', 'home', 'saved'];

function Shell() {
  const { state, set } = useApp();
  useReminders(state, set);

  const Screen = SCREENS[state.screen] || Home;
  const screenBg = GREEN_SCREENS.includes(state.screen) ? '#117468' : '#f3efe4';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 460,
        margin: '0 auto',
        height: '100dvh',
        background: screenBg,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Screen />
      </div>
      {MAIN_TABS.includes(state.screen) && <BottomNav />}
      <ConfirmModal />
      <LogoutModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

import { useApp } from '../store/AppContext';
import { NavHomeIcon, CalendarIcon, NavInsightsIcon, NavVisitsIcon, NavSettingsIcon } from './icons';
import { HomeBar } from './ui';

const TABS = [
  { key: 'home', label: 'Home', Icon: (a) => <NavHomeIcon stroke={a.stroke} fill={a.fill} /> },
  { key: 'calendar', label: 'Calendar', Icon: (a) => <CalendarIcon stroke={a.stroke} fill={a.fill} strokeWidth="1.9" /> },
  { key: 'insights', label: 'Insights', Icon: (a) => <NavInsightsIcon stroke={a.stroke} /> },
  { key: 'visits', label: 'Visits', Icon: (a) => <NavVisitsIcon stroke={a.stroke} fill={a.fill} /> },
  { key: 'settings', label: 'Settings', Icon: (a) => <NavSettingsIcon stroke={a.stroke} /> },
];

export default function BottomNav() {
  const { state, set } = useApp();

  return (
    <div style={{ flexShrink: 0, background: '#fbfaf6', borderTop: '1px solid #e7e0d0', padding: '11px 14px 4px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        {TABS.map((t) => {
          const active = state.screen === t.key;
          const stroke = active ? '#117468' : '#a9b0ab';
          const fill = active ? (t.key === 'calendar' || t.key === 'visits' ? '#dcefe9' : '#117468') : 'none';
          return (
            <div
              key={t.key}
              data-testid={'nav-' + t.key}
              onClick={() => set({ screen: t.key })}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, cursor: 'pointer' }}
            >
              {t.Icon({ stroke, fill })}
              <span style={{ fontSize: 10, color: stroke, fontWeight: active ? 700 : 600 }}>{t.label}</span>
            </div>
          );
        })}
      </div>
      <HomeBar />
    </div>
  );
}

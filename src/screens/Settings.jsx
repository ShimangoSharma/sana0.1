import { useApp } from '../store/AppContext';
import { ChevronRight, BellIcon } from '../components/icons';
import { Toggle } from '../components/ui';
import { requestNotificationPermission } from '../lib/notifications';

export default function Settings() {
  const { state, set } = useApp();
  const initial = (state.firstName || 'A').charAt(0).toUpperCase();
  const fullName = (state.firstName + ' ' + state.lastName).trim() || 'Your name';

  const toggleDailyReminder = async () => {
    const next = !state.settings.dailyReminder;
    if (next) await requestNotificationPermission();
    set((s) => ({ settings: { ...s.settings, dailyReminder: next } }));
  };

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, padding: '8px 22px 4px' }}>
        <div className="serif" style={{ fontSize: 32, fontWeight: 500, color: '#26322e', letterSpacing: '-0.01em' }}>
          Settings
        </div>
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '14px 22px 22px' }}>
        <div onClick={() => set({ screen: 'profile' })} style={{ display: 'flex', alignItems: 'center', gap: 15, background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 20, padding: '16px 18px', cursor: 'pointer' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#117468', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="serif" style={{ fontSize: 24, color: '#fbfdfb' }}>{initial}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#26322e' }}>{fullName}</div>
            <div style={{ fontSize: 13.5, color: '#8a938e', marginTop: 2 }}>{state.sex || 'Sex not set'}{state.ageRange ? ', ' + state.ageRange + ' yr' : ''}</div>
          </div>
          <ChevronRight stroke="#b3ab99" />
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '24px 2px 11px' }}>CARE</div>
        <div style={{ background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 18, overflow: 'hidden' }}>
          <div onClick={toggleDailyReminder} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 16px', cursor: 'pointer' }}>
            <BellIcon stroke="#117468" />
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#37433d' }}>Daily check-in reminder</span>
            <Toggle on={state.settings.dailyReminder} onClick={toggleDailyReminder} />
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#b3ab99', margin: '8px 2px 0', lineHeight: 1.5 }}>
          Sends a gentle evening nudge if you haven't logged anything that day. Only works while SANA is installed on this device.
        </div>

        <div onClick={() => set({ showLogout: true })} style={{ textAlign: 'center', marginTop: 28, fontSize: 15, fontWeight: 700, color: '#b0473a', cursor: 'pointer' }}>
          Log out
        </div>
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#b3ab99' }}>SANA · v1.0.0</div>
      </div>
    </div>
  );
}

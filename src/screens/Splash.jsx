import { useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { SparkIcon } from '../components/icons';

export default function Splash() {
  const { state, set } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      set((s) => (s.screen === 'splash' ? { screen: s.onboarded ? 'home' : 'name' } : {}));
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advance = () => set({ screen: state.onboarded ? 'home' : 'name' });

  return (
    <div className="scr" onClick={advance} style={{ cursor: 'pointer' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 30px' }}>
        <SparkIcon size={40} fill="#cdeae3" />
        <div className="serif" style={{ fontSize: 72, fontWeight: 500, color: '#fbfdfb', letterSpacing: '0.18em', margin: '22px 0 0 0.18em', lineHeight: 1 }}>
          SANA
        </div>
        <div style={{ width: 44, height: 2, background: 'rgba(234,253,247,0.45)', marginTop: 24 }} />
      </div>
      <div style={{ flexShrink: 0, padding: '0 0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fbfdfb' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 128, height: 5, borderRadius: 3, background: '#fbfdfb', opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );
}

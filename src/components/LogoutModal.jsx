import { useApp } from '../store/AppContext';
import { LogoutIcon } from './icons';

export default function LogoutModal() {
  const { state, set } = useApp();
  if (!state.showLogout) return null;

  const close = () => set({ showLogout: false });
  const confirmLogout = () => set({ showLogout: false, screen: 'splash' });

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,25,22,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 20 }}>
      <div onClick={close} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'relative', width: '100%', background: '#f3efe4', borderRadius: '32px 32px 0 0', padding: '26px 24px 30px' }}>
        <div style={{ width: 44, height: 5, borderRadius: 3, background: '#d8d0bf', margin: '0 auto 20px' }} />
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fae6e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <LogoutIcon />
        </div>
        <div className="serif" style={{ fontSize: 26, fontWeight: 500, color: '#26322e', textAlign: 'center', marginTop: 18 }}>
          Log out of SANA?
        </div>
        <div style={{ fontSize: 14.5, color: '#7a8078', textAlign: 'center', marginTop: 8, lineHeight: 1.5, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
          Your entries stay safely saved. You'll need to sign back in to view them.
        </div>
        <button onClick={confirmLogout} style={{ width: '100%', border: 'none', background: '#b0473a', color: '#fbfdfb', fontSize: 16, fontWeight: 700, padding: 16, borderRadius: 100, cursor: 'pointer', marginTop: 24 }}>
          Log out
        </button>
        <button onClick={close} style={{ width: '100%', border: 'none', background: 'transparent', color: '#37433d', fontSize: 15, fontWeight: 700, padding: 14, borderRadius: 100, cursor: 'pointer', marginTop: 4 }}>
          Stay logged in
        </button>
      </div>
    </div>
  );
}

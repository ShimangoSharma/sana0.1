import { useApp } from '../store/AppContext';
import { AlertIcon } from './icons';

export default function ConfirmModal() {
  const { state, set } = useApp();
  const c = state.confirm;
  if (!c) return null;

  const cancel = () => set({ confirm: null });

  const doIt = () => {
    if (c.kind === 'entry') {
      set((s) => ({ entries: s.entries.filter((x) => x.id !== c.id), confirm: null, screen: 'calendar' }));
    } else if (c.kind === 'appt') {
      set((s) => ({ appts: s.appts.filter((a) => a.id !== c.id), confirm: null, screen: 'visits' }));
    } else if (c.kind === 'symptom') {
      set((s) => ({
        customSymptoms: s.customSymptoms.filter((n) => n !== c.name),
        logSymptoms: s.logSymptoms.filter((n) => n !== c.name),
        confirm: null,
      }));
    } else {
      set({ confirm: null });
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,25,22,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 22 }}>
      <div onClick={cancel} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'relative', width: '100%', background: '#f8f4ea', borderRadius: '26px 26px 0 0', padding: '22px 22px 26px' }}>
        <div style={{ width: 44, height: 5, borderRadius: 3, background: '#d8d0bf', margin: '0 auto 20px' }} />
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fae6e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <AlertIcon />
        </div>
        <div className="serif" style={{ fontSize: 26, fontWeight: 500, color: '#26322e', textAlign: 'center', marginTop: 18 }}>
          {c.title}
        </div>
        <div style={{ fontSize: 14.5, color: '#7a8078', textAlign: 'center', marginTop: 8, lineHeight: 1.5, maxWidth: 290, marginLeft: 'auto', marginRight: 'auto' }}>
          {c.msg}
        </div>
        <button onClick={doIt} style={{ width: '100%', border: 'none', background: '#b0473a', color: '#fbfdfb', fontSize: 16, fontWeight: 700, padding: 16, borderRadius: 100, cursor: 'pointer', marginTop: 22 }}>
          {c.cta}
        </button>
        <button onClick={cancel} style={{ width: '100%', border: 'none', background: 'transparent', color: '#37433d', fontSize: 15, fontWeight: 700, padding: 14, borderRadius: 100, cursor: 'pointer', marginTop: 6 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

import { useApp } from '../store/AppContext';
import { todayKey, fmtDM } from '../lib/dateUtils';
import { CheckIcon } from '../components/icons';

export default function EntrySaved() {
  const { state, set } = useApp();
  const tk = todayKey();
  const e = state.entries.find((x) => x.id === state.selectedEntryId) || state.entries[0] || {};
  const savedMonthCount = state.entries.filter((x) => Math.floor(x.dateKey / 100) === Math.floor(tk / 100)).length;
  const loggedLine = (e.dateKey === tk || !e.dateKey ? 'Today' : fmtDM(e.dateKey)) + ' · ' + (e.time || '');

  const startLog = () =>
    set({ screen: 'log', logDateKey: tk, logSymptoms: [], symptomQuery: '', severity: 'Moderate', since: 'Today', note: '', hasPhoto: false, photoData: null, logEditingId: null, sinceCalOpen: false });

  return (
    <div className="scr">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 30px', textAlign: 'center' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 66, height: 66, borderRadius: '50%', background: '#fbfdfb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckIcon size={34} stroke="#117468" strokeWidth="3" />
          </div>
        </div>
        <div className="serif" style={{ fontSize: 34, fontWeight: 500, color: '#fbfdfb', marginTop: 28, letterSpacing: '-0.01em' }}>
          Entry saved
        </div>
        <div style={{ fontSize: 15, color: '#bfe0d9', marginTop: 10, lineHeight: 1.5, maxWidth: 260 }}>
          That's {savedMonthCount} {savedMonthCount === 1 ? 'entry' : 'entries'} this month — you're keeping a clear record.
        </div>
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.10)', borderRadius: 20, padding: 18, marginTop: 30, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: e.color || '#e6b86a' }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fbfdfb' }}>
              {e.symptom} · {e.sev}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#9cccc2' }}>SINCE</div>
              <div style={{ fontSize: 14, color: '#eafdf7', marginTop: 3 }}>{e.since}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#9cccc2' }}>LOGGED</div>
              <div style={{ fontSize: 14, color: '#eafdf7', marginTop: 3 }}>{loggedLine}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '0 26px 16px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        <button onClick={() => set({ screen: 'calendar' })} style={{ width: '100%', border: 'none', background: '#fbfdfb', color: '#0f6a5f', fontSize: 16, fontWeight: 700, padding: 17, borderRadius: 100, cursor: 'pointer' }}>
          Done
        </button>
        <button onClick={startLog} style={{ width: '100%', border: '1.5px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#eafdf7', fontSize: 15, fontWeight: 600, padding: 14, borderRadius: 100, cursor: 'pointer' }}>
          Log another symptom
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 0' }}>
          <div style={{ width: 128, height: 5, borderRadius: 3, background: '#fbfdfb', opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );
}

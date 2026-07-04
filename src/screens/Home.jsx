import { useApp } from '../store/AppContext';
import { todayKey } from '../lib/dateUtils';
import { aggregateBySymptom, findRising, presetRangeDays, rangeFromPreset } from '../lib/analytics';
import { SparkIcon, PlusIcon, DocIcon, ChevronRight, TrendIcon } from '../components/icons';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'GOOD MORNING';
  if (h < 18) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export default function Home() {
  const { state, set } = useApp();
  const tk = todayKey();

  const startLog = () =>
    set({ screen: 'log', logDateKey: tk, logSymptoms: [], symptomQuery: '', severity: 'Moderate', since: 'Today', note: '', hasPhoto: false, photoData: null, logEditingId: null, sinceCalOpen: false });

  const sorted = state.entries.slice().sort((a, b) => b.dateKey - a.dateKey || b.id - a.id);
  const recent = sorted.slice(0, 2);

  const { from, to } = state.insightCustom && state.insFrom && state.insTo ? { from: state.insFrom, to: state.insTo } : rangeFromPreset(tk, presetRangeDays('insight', state.insightRange));
  const { list } = aggregateBySymptom(state.entries, from, to);
  const rising = findRising(list);

  return (
    <div className="scr no-scrollbar" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ position: 'relative', padding: '6px 24px 30px' }}>
        <div style={{ position: 'absolute', top: 10, right: 24, width: 84, height: 84, borderRadius: '50%', background: 'rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SparkIcon size={34} fill="#cdeae3" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SparkIcon size={16} fill="#7fc4ba" />
          <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.14em', color: '#a8d7ce' }}>
            {greeting()}{state.firstName ? ', ' + state.firstName.toUpperCase() : ''}
          </span>
        </div>
        <div className="serif" style={{ fontSize: 42, lineHeight: 1.04, fontWeight: 500, color: '#fbfdfb', letterSpacing: '-0.01em', marginTop: 18, maxWidth: 290 }}>
          How are you feeling today?
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.5, color: '#bfe0d9', marginTop: 14, maxWidth: 270 }}>
          Log a symptom in about 30 seconds, <br />
          it all adds to your next summary.
        </div>
        <button
          onClick={startLog}
          style={{ marginTop: 24, width: '100%', border: 'none', background: '#fbfdfb', color: '#0f6a5f', fontSize: 16, fontWeight: 700, padding: 17, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, cursor: 'pointer', boxShadow: '0 12px 22px -12px rgba(0,0,0,0.4)' }}
        >
          <PlusIcon stroke="#0f6a5f" strokeWidth="2.6" />
          Log symptoms
        </button>
      </div>
      <div style={{ background: '#efe9dd', borderRadius: '28px 28px 0 0', padding: '24px 20px 22px', flex: 1 }}>
        <div
          onClick={() => set({ screen: 'summary' })}
          style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fbfdfb', border: '1px solid #e4dccb', borderRadius: 20, padding: '16px 17px', boxShadow: '0 16px 30px -22px rgba(20,40,36,0.5)', cursor: 'pointer' }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#e7f1ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <DocIcon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#26322e' }}>Create summary</div>
            <div style={{ fontSize: 13, color: '#8a938e', marginTop: 2 }}>{state.entries.length} entries ready to summarise</div>
          </div>
          <ChevronRight />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '26px 4px 13px' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384' }}>RECENT ENTRIES</span>
          <span onClick={() => set({ screen: 'calendar' })} style={{ fontSize: 13.5, fontWeight: 600, color: '#117468', cursor: 'pointer' }}>
            View all
          </span>
        </div>

        {recent.length === 0 ? (
          <div style={{ background: '#fbf8f1', border: '1.5px dashed #c9c0ac', borderRadius: 18, padding: '22px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#37433d' }}>Nothing logged yet</div>
            <div style={{ fontSize: 13, color: '#8a938e', marginTop: 5, lineHeight: 1.5 }}>Your first entry takes about 30 seconds.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {recent.map((e) => (
              <div
                key={e.id}
                onClick={() => set({ selectedEntryId: e.id, screen: 'detail' })}
                style={{ background: '#f6f1e8', border: '1px solid #e4dccb', borderRadius: 18, padding: '15px 16px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#9a9384' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.color }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em' }}>{(e.symptom + ' · ' + e.sev).toUpperCase()}</span>
                </div>
                <div style={{ fontSize: 14.5, lineHeight: 1.45, color: '#33403a', marginTop: 9 }}>{e.note}</div>
                <div style={{ fontSize: 12, color: '#a39c8c', marginTop: 8 }}>{e.time}</div>
              </div>
            ))}
          </div>
        )}

        <div
          onClick={() => set({ screen: 'insights' })}
          style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#f6f1e8', border: '1px solid #e4dccb', borderRadius: 18, padding: '14px 16px', marginTop: 16, cursor: 'pointer' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 13, background: '#fbeee4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendIcon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#26322e' }}>{rising ? rising.name + ' — appearing more often' : 'Symptoms look steady'}</div>
            <div style={{ fontSize: 13, color: '#8a938e', marginTop: 1 }}>{rising ? 'See the pattern in Insights' : 'No rising patterns right now'}</div>
          </div>
          <ChevronRight stroke="#b3ab99" />
        </div>
      </div>
    </div>
  );
}

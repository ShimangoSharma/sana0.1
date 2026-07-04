import { useApp } from '../store/AppContext';
import { todayKey, fmtDM, fmtLong } from '../lib/dateUtils';
import { BackIcon, EditIcon, TrashIcon, PhotoIcon } from '../components/icons';

const SEV_BARS = {
  Mild: ['#5a8f6f', '#e6ddd0', '#e6ddd0'],
  Moderate: ['#c98a3e', '#c98a3e', '#eccfa0'],
  Severe: ['#cc6a44', '#cc6a44', '#cc6a44'],
};

export default function EntryDetail() {
  const { state, set } = useApp();
  const tk = todayKey();
  const e = state.entries.find((x) => x.id === state.selectedEntryId) || {};
  const sb = SEV_BARS[e.sev] || SEV_BARS.Moderate;
  const sevColor = e.sev === 'Mild' ? '#3f7a5b' : e.sev === 'Severe' ? '#b0473a' : '#9a6a22';
  const dateLine = (e.dateKey === tk ? 'Today, ' + fmtDM(e.dateKey) : fmtLong(e.dateKey || tk)) + ' · ' + (e.time || '');

  const startEdit = () =>
    set({
      screen: 'log',
      logEditingId: e.id,
      logSymptoms: [e.symptom],
      symptomQuery: '',
      severity: e.sev,
      since: e.since,
      note: e.note === 'No note added.' ? '' : e.note,
      hasPhoto: !!e.hasPhoto,
      photoData: e.photoData || null,
      logDateKey: e.dateKey,
      sinceCalOpen: false,
    });

  const askDelete = () =>
    set({ confirm: { kind: 'entry', id: e.id, title: 'Delete this entry?', msg: 'This entry will be removed from your record and summaries. This cannot be undone.', cta: 'Delete entry' } });

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 4px' }}>
        <div data-testid="detail-back" onClick={() => set({ screen: 'calendar' })} style={{ width: 40, height: 40, borderRadius: '50%', background: '#ebe4d5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <BackIcon />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div data-testid="entry-edit" onClick={startEdit} style={{ width: 40, height: 40, borderRadius: '50%', background: '#ebe4d5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <EditIcon />
          </div>
          <div data-testid="entry-delete" onClick={askDelete} style={{ width: 40, height: 40, borderRadius: '50%', background: '#ebe4d5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <TrashIcon />
          </div>
        </div>
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ width: 13, height: 13, borderRadius: '50%', background: e.color }} />
          <span className="serif" style={{ fontSize: 36, fontWeight: 500, color: '#26322e', letterSpacing: '-0.01em' }}>
            {e.symptom}
          </span>
        </div>
        <div style={{ fontSize: 14, color: '#8a938e', marginTop: 6 }}>{dateLine}</div>

        <div style={{ background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 20, padding: 18, marginTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384' }}>SEVERITY</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              <span style={{ width: 11, height: 30, borderRadius: 4, background: sb[0] }} />
              <span style={{ width: 11, height: 30, borderRadius: 4, background: sb[1] }} />
              <span style={{ width: 11, height: 30, borderRadius: 4, background: sb[2] }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: sevColor }}>{e.sev}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 11, marginTop: 12 }}>
          <div style={{ flex: 1, background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 18, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#9a9384' }}>SINCE</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#26322e', marginTop: 7 }}>{e.since}</div>
          </div>
          <div style={{ flex: 1, background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 18, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#9a9384' }}>LOGGED</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#26322e', marginTop: 7 }}>{e.time}</div>
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '24px 2px 11px' }}>NOTE</div>
        <div style={{ background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 18, padding: '16px 17px', fontSize: 15.5, lineHeight: 1.55, color: '#37433d' }}>{e.note}</div>

        {e.hasPhoto && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '24px 2px 11px' }}>PHOTO</div>
            {e.photoData ? (
              <img src={e.photoData} alt="Logged symptom" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 18 }} />
            ) : (
              <div style={{ height: 150, borderRadius: 18, background: 'linear-gradient(135deg,#e7ddca,#d8cdb4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhotoIcon size={34} stroke="#a9a085" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

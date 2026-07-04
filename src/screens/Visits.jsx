import { useApp } from '../store/AppContext';
import { todayKey, diffDays, fmtLong, MO, pad2 } from '../lib/dateUtils';
import { PlusIcon, ClockIcon, DoctorIcon, EditIcon, DocIcon, CalendarIcon } from '../components/icons';

function timeLabel(a) {
  return a.hour + ':' + pad2(a.min) + ' ' + a.ampm;
}
function timeSort(a) {
  return (a.ampm === 'PM' ? 12 : 0) + (a.hour % 12);
}
function countdown(tk, k) {
  const n = diffDays(tk, k);
  return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : 'In ' + n + ' days';
}

export default function Visits() {
  const { state, set } = useApp();
  const tk = todayKey();

  const startAppt = () => {
    const d = new Date();
    set({ screen: 'appt', apptId: null, apptTitle: '', apptType: 'Consultation', editDoctor: '', doctorQuery: '', apptDateKey: null, apptHour: 10, apptMin: 0, apptAmpm: 'AM', remind: true, prep: true, apptCalOpen: false, apptTimeOpen: false, apptCalY: d.getFullYear(), apptCalM: d.getMonth() });
  };

  const loadAppt = (a) => {
    const d = new Date(Math.floor(a.dateKey / 10000), (Math.floor(a.dateKey / 100) % 100) - 1, a.dateKey % 100);
    set({ screen: 'appt', apptId: a.id, apptType: a.type, apptTitle: a.title, editDoctor: a.doctor, doctorQuery: '', apptDateKey: a.dateKey, apptHour: a.hour, apptMin: a.min, apptAmpm: a.ampm, remind: a.remind, prep: a.prep, apptCalOpen: false, apptTimeOpen: false, apptCalY: d.getFullYear(), apptCalM: d.getMonth() });
  };

  const upcoming = state.appts.filter((a) => a.dateKey >= tk).sort((a, b) => a.dateKey - b.dateKey || timeSort(a) - timeSort(b));
  const nextAppt = upcoming[0] || null;
  const others = upcoming.slice(1);
  const past = state.appts
    .filter((a) => a.dateKey < tk)
    .sort((a, b) => b.dateKey - a.dateKey)
    .slice(0, 5);

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 22px 4px' }}>
        <span className="serif" style={{ fontSize: 32, fontWeight: 500, color: '#26322e', letterSpacing: '-0.01em' }}>
          Visits
        </span>
        <div data-testid="visits-add" onClick={startAppt} style={{ width: 40, height: 40, borderRadius: '50%', background: '#117468', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <PlusIcon size={19} strokeWidth="2.6" />
        </div>
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 22px' }}>
        {nextAppt ? (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '0 2px 11px' }}>NEXT UP</div>
            <div style={{ background: '#117468', borderRadius: 22, padding: 20, color: '#eafdf7', boxShadow: '0 18px 34px -20px rgba(17,116,104,0.9)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', color: '#a8d7ce' }}>{(nextAppt.type || '').toUpperCase()}</span>
                <span style={{ fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.16)', padding: '4px 11px', borderRadius: 100 }}>{countdown(tk, nextAppt.dateKey)}</span>
              </div>
              <div className="serif" style={{ fontSize: 27, fontWeight: 500, marginTop: 12 }}>
                {fmtLong(nextAppt.dateKey)}
              </div>
              <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ClockIcon size={16} stroke="#bfe0d9" />
                  <span style={{ fontSize: 14, color: '#eafdf7' }}>{timeLabel(nextAppt)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DoctorIcon size={16} stroke="#bfe0d9" />
                  <span style={{ fontSize: 14, color: '#eafdf7' }}>{nextAppt.doctor || 'No doctor set'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <div onClick={() => loadAppt(nextAppt)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 11, cursor: 'pointer' }}>
                  <EditIcon size={16} stroke="#eafdf7" />
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#eafdf7' }}>Edit</span>
                </div>
                <div onClick={() => set({ screen: 'summary' })} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fbfdfb', borderRadius: 12, padding: 11, cursor: 'pointer' }}>
                  <DocIcon size={16} stroke="#0f6a5f" />
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0f6a5f' }}>Summary</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ background: '#fbfdfb', border: '1px solid #e8e1d2', borderRadius: 22, padding: '26px 20px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#e7f1ea', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <CalendarIcon size={24} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#26322e', marginTop: 12 }}>No upcoming visits</div>
            <div style={{ fontSize: 13.5, color: '#8a938e', marginTop: 5, lineHeight: 1.5 }}>Add your next appointment so SANA can prepare a summary in time.</div>
          </div>
        )}

        {others.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '22px 2px 11px' }}>ALSO COMING UP</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {others.map((a) => {
                const d = new Date(Math.floor(a.dateKey / 10000), (Math.floor(a.dateKey / 100) % 100) - 1, a.dateKey % 100);
                return (
                  <div key={a.id} onClick={() => loadAppt(a)} style={{ display: 'flex', gap: 13, background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 18, padding: '14px 16px', cursor: 'pointer' }}>
                    <div style={{ width: 48, textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#9a9384', letterSpacing: '0.06em' }}>{MO[d.getMonth()].toUpperCase()}</div>
                      <div className="serif" style={{ fontSize: 24, color: '#26322e', lineHeight: 1 }}>{d.getDate()}</div>
                    </div>
                    <div style={{ flex: 1, borderLeft: '1px solid #e8e1d2', paddingLeft: 14, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#26322e' }}>{a.title}</div>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#117468', background: '#e7f1ea', padding: '3px 9px', borderRadius: 100 }}>{countdown(tk, a.dateKey)}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#8a938e', marginTop: 2 }}>{timeLabel(a) + ' · ' + (a.doctor || 'No doctor set')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <button
          onClick={startAppt}
          style={{ width: '100%', border: '1.5px dashed #c1b9a5', background: '#fbf8f1', borderRadius: 18, padding: 16, marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, cursor: 'pointer' }}
        >
          <PlusIcon size={19} stroke="#117468" strokeWidth="2.4" />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#117468' }}>Add an appointment</span>
        </button>

        {past.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '24px 2px 11px' }}>PAST</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {past.map((a) => {
                const d = new Date(Math.floor(a.dateKey / 10000), (Math.floor(a.dateKey / 100) % 100) - 1, a.dateKey % 100);
                return (
                  <div key={a.id} onClick={() => loadAppt(a)} style={{ display: 'flex', gap: 13, background: '#f6f1e8', border: '1px solid #e8e1d2', borderRadius: 18, padding: '14px 16px', cursor: 'pointer' }}>
                    <div style={{ width: 48, textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#9a9384', letterSpacing: '0.06em' }}>{MO[d.getMonth()].toUpperCase()}</div>
                      <div className="serif" style={{ fontSize: 24, color: '#7a7464', lineHeight: 1 }}>{d.getDate()}</div>
                    </div>
                    <div style={{ flex: 1, borderLeft: '1px solid #e8e1d2', paddingLeft: 14 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#5b6a64' }}>{a.title}</div>
                      <div style={{ fontSize: 13, color: '#a39c8c', marginTop: 2 }}>{a.doctor || 'No doctor set'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

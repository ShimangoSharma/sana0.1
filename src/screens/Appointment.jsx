import { useApp } from '../store/AppContext';
import { todayKey, fmtDM, MOF, pad2 } from '../lib/dateUtils';
import { DEFAULT_APPT_TYPES } from '../lib/symptoms';
import { DoctorIcon, CloseIcon, PlusIcon, CalendarIcon, ClockIcon, BellIcon, DocIcon, CheckIcon } from '../components/icons';
import { Pill } from '../components/ui';
import { CalendarNavHeader, MonthGrid } from '../components/MonthCalendar';
import TimeWheelPicker from '../components/TimeWheelPicker';

export default function Appointment() {
  const { state, set } = useApp();
  const tk = todayKey();
  const isEdit = !!state.apptId;

  const dq = state.doctorQuery.trim();
  const dql = dq.toLowerCase();
  const dsource = dq ? state.knownDoctors.filter((d) => d.toLowerCase().includes(dql)) : state.knownDoctors;
  const dexact = state.knownDoctors.some((d) => d.toLowerCase() === dql);
  const showAddDoctor = dq.length > 0 && !dexact;
  const chosenDoctorVisible = !!state.editDoctor && state.doctorQuery === '';

  const askDelete = () =>
    set({ confirm: { kind: 'appt', id: state.apptId, title: 'Delete this appointment?', msg: 'The appointment and its reminders will be removed. This cannot be undone.', cta: 'Delete appointment' } });

  const saveAppt = () => {
    if (!state.apptDateKey) {
      set({ apptCalOpen: true, apptTimeOpen: false });
      return;
    }
    set((s) => {
      const rec = {
        id: s.apptId || s.nextApptId,
        type: s.apptType,
        title: (s.apptTitle || '').trim() || s.apptType,
        doctor: s.editDoctor || (s.doctorQuery || '').trim(),
        dateKey: s.apptDateKey,
        hour: s.apptHour,
        min: s.apptMin,
        ampm: s.apptAmpm,
        remind: s.remind,
        prep: s.prep,
      };
      const rest = s.appts.filter((a) => a.id !== rec.id);
      const knownDoctors = rec.doctor && !s.knownDoctors.includes(rec.doctor) ? s.knownDoctors.concat([rec.doctor]) : s.knownDoctors;
      return { appts: rest.concat([rec]), nextApptId: s.apptId ? s.nextApptId : s.nextApptId + 1, knownDoctors, screen: 'visits' };
    });
  };

  const whenBoxStyle = (open, flex) => ({ flex, background: '#fdfbf6', border: open ? '1.5px solid #117468' : '1px solid #e4dccb', borderRadius: 16, padding: '14px 15px', display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' });

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 4px' }}>
        <div data-testid="appt-close" onClick={() => set({ screen: 'visits' })} style={{ width: 40, height: 40, borderRadius: '50%', background: '#ebe4d5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <CloseIcon size={18} strokeWidth="2.4" />
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#26322e' }}>{isEdit ? 'Edit appointment' : 'New appointment'}</span>
        <div style={{ width: 40 }} />
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '4px 2px 11px' }}>TYPE OF VISIT</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {DEFAULT_APPT_TYPES.map((t) => (
            <Pill key={t} small active={state.apptType === t} onClick={() => set({ apptType: t })}>
              {t}
            </Pill>
          ))}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '22px 2px 10px' }}>TITLE</div>
        <input
          value={state.apptTitle}
          onInput={(e) => set({ apptTitle: e.target.value })}
          placeholder="e.g. PET scan review"
          style={{ width: '100%', background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 16, padding: '15px 16px', fontSize: 16, fontWeight: 600, color: '#26322e' }}
        />

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '22px 2px 10px' }}>DOCTOR</div>
        {chosenDoctorVisible ? (
          <div style={{ background: '#eef4ef', border: '1px solid #d7e6dc', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#117468', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <DoctorIcon size={18} stroke="#fbfdfb" />
            </div>
            <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: '#26322e' }}>{state.editDoctor}</span>
            <div onClick={() => set({ editDoctor: '', doctorQuery: '' })} style={{ width: 30, height: 30, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <CloseIcon size={15} stroke="#5b6a64" strokeWidth="2.2" />
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fdfbf6', border: '1.5px solid #117468', borderRadius: 16, padding: '13px 15px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a9384" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4" />
              </svg>
              <input
                value={state.doctorQuery}
                onInput={(e) => set({ doctorQuery: e.target.value })}
                placeholder="Type your doctor's name"
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 16, fontWeight: 600, color: '#26322e' }}
              />
            </div>
            {(dsource.length > 0 || showAddDoctor) && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#9a9384', margin: '14px 2px 8px' }}>{dq ? 'MATCHING DOCTORS' : 'PREVIOUSLY ADDED'}</div>
                <div style={{ background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 16, overflow: 'hidden' }}>
                  {dsource.map((d) => (
                    <div key={d} onClick={() => set({ editDoctor: d, doctorQuery: '' })} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 16px', borderBottom: '1px solid #f0ebe0', cursor: 'pointer' }}>
                      <DoctorIcon />
                      <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#37433d' }}>{d}</span>
                    </div>
                  ))}
                  {showAddDoctor && (
                    <div onClick={() => set({ knownDoctors: state.knownDoctors.concat([dq]), editDoctor: dq, doctorQuery: '' })} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 16px', cursor: 'pointer' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: '#117468', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PlusIcon size={15} strokeWidth="2.8" />
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#117468' }}>Add "{dq}" as a new doctor</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '22px 2px 10px' }}>WHEN</div>
        <div style={{ display: 'flex', gap: 11 }}>
          <div data-testid="appt-date-box" onClick={() => set((s) => ({ apptCalOpen: !s.apptCalOpen, apptTimeOpen: false }))} style={whenBoxStyle(state.apptCalOpen, 1.4)}>
            <CalendarIcon />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9a9384' }}>Date</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: state.apptDateKey ? '#26322e' : '#9a9384', marginTop: 1 }}>{state.apptDateKey ? fmtDM(state.apptDateKey) : 'Pick a date'}</div>
            </div>
          </div>
          <div data-testid="appt-time-box" onClick={() => set((s) => ({ apptTimeOpen: !s.apptTimeOpen, apptCalOpen: false }))} style={whenBoxStyle(state.apptTimeOpen, 1)}>
            <ClockIcon />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9a9384' }}>Time</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#26322e', marginTop: 1 }}>{state.apptHour + ':' + pad2(state.apptMin) + ' ' + state.apptAmpm}</div>
            </div>
          </div>
        </div>

        {state.apptCalOpen && (
          <div style={{ background: '#fbfdfb', border: '1px solid #e8e1d2', borderRadius: 16, padding: '12px 12px 10px', marginTop: 10 }}>
            <CalendarNavHeader
              label={MOF[state.apptCalM] + ' ' + state.apptCalY}
              onPrev={() => set((s) => (s.apptCalM === 0 ? { apptCalM: 11, apptCalY: s.apptCalY - 1 } : { apptCalM: s.apptCalM - 1 }))}
              onNext={() => set((s) => (s.apptCalM === 11 ? { apptCalM: 0, apptCalY: s.apptCalY + 1 } : { apptCalM: s.apptCalM + 1 }))}
            />
            <MonthGrid
              year={state.apptCalY}
              month={state.apptCalM}
              getDayMeta={(k) => ({ disabled: k < tk, selected: k === state.apptDateKey })}
              onPick={(k) => set({ apptDateKey: k, apptCalOpen: false })}
            />
          </div>
        )}

        {state.apptTimeOpen && (
          <div style={{ background: '#fbfdfb', border: '1px solid #e8e1d2', borderRadius: 16, padding: 14, marginTop: 10 }}>
            <TimeWheelPicker
              hour={state.apptHour}
              minute={state.apptMin}
              ampm={state.apptAmpm}
              onChangeHour={(v) => set({ apptHour: v })}
              onChangeMinute={(v) => set({ apptMin: v })}
              onChangeAmpm={(v) => set({ apptAmpm: v })}
            />
            <button onClick={() => set({ apptTimeOpen: false })} style={{ width: '100%', border: 'none', background: '#117468', color: '#fbfdfb', fontSize: 14, fontWeight: 700, padding: 12, borderRadius: 100, cursor: 'pointer', marginTop: 12 }}>
              Set time · {state.apptHour + ':' + pad2(state.apptMin) + ' ' + state.apptAmpm}
            </button>
          </div>
        )}

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '22px 2px 10px' }}>REMINDER</div>
        <div style={{ background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 16, overflow: 'hidden' }}>
          <div onClick={() => set((s) => ({ remind: !s.remind }))} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #eee6d7', cursor: 'pointer' }}>
            <BellIcon />
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#37433d' }}>Remind me 2 days before</span>
            <div style={{ width: 44, height: 26, borderRadius: 100, background: state.remind ? '#117468' : '#d8d0bf', padding: 3, display: 'flex', justifyContent: state.remind ? 'flex-end' : 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
            </div>
          </div>
          <div onClick={() => set((s) => ({ prep: !s.prep }))} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }}>
            <DocIcon size={19} stroke="#5b6a64" />
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#37433d' }}>Prepare summary beforehand</span>
            <div style={{ width: 44, height: 26, borderRadius: 100, background: state.prep ? '#117468' : '#d8d0bf', padding: 3, display: 'flex', justifyContent: state.prep ? 'flex-end' : 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
            </div>
          </div>
        </div>

        {isEdit && (
          <div onClick={askDelete} style={{ textAlign: 'center', marginTop: 22, fontSize: 14, fontWeight: 700, color: '#b0473a', cursor: 'pointer' }}>
            Delete appointment
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0, background: '#f3efe4', padding: '12px 22px 12px', borderTop: '1px solid #e8e1d2' }}>
        <button onClick={saveAppt} style={{ width: '100%', border: 'none', background: '#117468', color: '#fbfdfb', fontSize: 16, fontWeight: 700, padding: 17, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, cursor: 'pointer' }}>
          <CheckIcon />
          Save appointment
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '9px 0 2px' }}>
          <div style={{ width: 128, height: 5, borderRadius: 3, background: '#23332f', opacity: 0.28 }} />
        </div>
      </div>
    </div>
  );
}

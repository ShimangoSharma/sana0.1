import { useApp } from '../store/AppContext';
import { todayKey, fmtDM, DW, MO, MOF } from '../lib/dateUtils';
import { CalendarNavHeader, MonthGrid } from '../components/MonthCalendar';
import { SearchIcon, PlusIcon, EditIcon } from '../components/icons';

export default function Calendar() {
  const { state, set } = useApp();
  const tk = todayKey();

  const dotsByKey = {};
  state.entries.forEach((e) => {
    (dotsByKey[e.dateKey] = dotsByKey[e.dateKey] || []).push(e.color);
  });

  const startLogSelected = () =>
    set({ screen: 'log', logDateKey: state.selectedKey, logSymptoms: [], symptomQuery: '', severity: 'Moderate', since: 'Today', note: '', hasPhoto: false, photoData: null, logEditingId: null, sinceCalOpen: false });

  const sorted = state.entries.slice().sort((a, b) => b.dateKey - a.dateKey || b.id - a.id);
  const dayEntries = sorted.filter((e) => e.dateKey === state.selectedKey);

  const selD = new Date(Math.floor(state.selectedKey / 10000), ((Math.floor(state.selectedKey / 100) % 100) - 1), state.selectedKey % 100);
  const dcount = dayEntries.length;
  const selectedDayLabel = DW[selD.getDay()].toUpperCase() + ', ' + MO[selD.getMonth()].toUpperCase() + ' ' + selD.getDate() + ' · ' + (dcount === 1 ? '1 ENTRY' : dcount + ' ENTRIES');

  const sevPill = (sev) => {
    const map = { Mild: ['#3f7a5b', '#e7f1ea'], Moderate: ['#9a6a22', '#fbeede'], Severe: ['#b0473a', '#fae6e2'] };
    const c = map[sev] || map.Moderate;
    return { fontSize: 11.5, fontWeight: 700, color: c[0], background: c[1], padding: '3px 9px', borderRadius: 100 };
  };

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 22px 6px' }}>
        <div className="serif" style={{ fontSize: 32, fontWeight: 500, color: '#26322e', letterSpacing: '-0.01em' }}>
          Calendar
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ebe4d5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SearchIcon size={19} stroke="#37433d" />
        </div>
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '6px 22px 20px' }}>
        <div style={{ background: '#fbfdfb', border: '1px solid #e8e1d2', borderRadius: 22, padding: '16px 16px 14px', boxShadow: '0 18px 36px -28px rgba(20,40,36,0.4)' }}>
          <CalendarNavHeader
            size={32}
            label={MOF[state.calM] + ' ' + state.calY}
            onPrev={() => set((s) => (s.calM === 0 ? { calM: 11, calY: s.calY - 1 } : { calM: s.calM - 1 }))}
            onNext={() => set((s) => (s.calM === 11 ? { calM: 0, calY: s.calY + 1 } : { calM: s.calM + 1 }))}
          />
          <MonthGrid
            year={state.calY}
            month={state.calM}
            cellHeight={44}
            getDayMeta={(k) => ({
              selected: k === state.selectedKey,
              today: k === tk,
              showDots: true,
              dots: dotsByKey[k],
            })}
            onPick={(k) => set({ selectedKey: k })}
          />
        </div>
        <button
          onClick={startLogSelected}
          style={{ width: '100%', border: 'none', background: '#117468', color: '#fbfdfb', fontSize: 15.5, fontWeight: 700, padding: 16, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, cursor: 'pointer', marginTop: 14, boxShadow: '0 14px 26px -16px rgba(17,116,104,0.9)' }}
        >
          <PlusIcon strokeWidth="2.6" />
          {state.selectedKey === tk ? 'Log symptoms for today' : 'Log symptoms for ' + fmtDM(state.selectedKey)}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 2px 12px' }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384' }}>{selectedDayLabel}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#117468' }}>{state.selectedKey === tk ? 'Today' : fmtDM(state.selectedKey)}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dayEntries.map((e) => (
            <div
              key={e.id}
              onClick={() => set({ selectedEntryId: e.id, screen: 'detail' })}
              style={{ background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 18, padding: '15px 16px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: e.color }} />
                  <span style={{ fontSize: 15.5, fontWeight: 700, color: '#26322e' }}>{e.symptom}</span>
                  <span style={sevPill(e.sev)}>{e.sev}</span>
                </div>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#efe9dd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EditIcon size={15} />
                </div>
              </div>
              <div style={{ fontSize: 14, color: '#5b6a64', marginTop: 9, lineHeight: 1.45 }}>{e.note}</div>
              <div style={{ fontSize: 12, color: '#a39c8c', marginTop: 8 }}>{e.time}</div>
            </div>
          ))}
        </div>
        <div
          onClick={startLogSelected}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fbf8f1', border: '1.5px dashed #c9c0ac', borderRadius: 16, padding: 14, marginTop: 12, cursor: 'pointer' }}
        >
          <PlusIcon size={17} stroke="#117468" strokeWidth="2.4" />
          <span style={{ fontSize: 14.5, fontWeight: 700, color: '#117468' }}>Add entry for this day</span>
        </div>
      </div>
    </div>
  );
}

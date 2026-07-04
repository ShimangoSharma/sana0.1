import { useRef, useState } from 'react';
import { useApp } from '../store/AppContext';
import { todayKey, fmtDM, MOF } from '../lib/dateUtils';
import { GRID_SYMPTOMS, SYMPTOM_LIBRARY, symbolColor } from '../lib/symptoms';
import { fileToCompressedDataUrl } from '../lib/photo';
import { CloseIcon, PainIcon, FatigueIcon, NauseaIcon, HeadacheIcon, CheckIcon, SearchIcon, PlusIcon, PhotoIcon, BackIcon } from '../components/icons';
import { CalendarNavHeader, MonthGrid } from '../components/MonthCalendar';

const SEV_DEFS = [
  { label: 'Mild', on: ['#5a8f6f', '#d8e2d8', '#d8e2d8'], text: '#3f7a5b', bg: '#e7f1ea', border: '#5a8f6f' },
  { label: 'Moderate', on: ['#c98a3e', '#c98a3e', '#eccfa0'], text: '#9a6a22', bg: '#fbeede', border: '#c98a3e' },
  { label: 'Severe', on: ['#cc6a44', '#cc6a44', '#e2c5bb'], text: '#b0473a', bg: '#fae6e2', border: '#cc6a44' },
];
const SINCE_PRESETS = ['Today', 'A few days ago', '2–4 weeks', '1–3 months'];
const GRID_ICONS = { Pain: PainIcon, Fatigue: FatigueIcon, Nausea: NauseaIcon, Headache: HeadacheIcon };

export default function LogEntry() {
  const { state, set } = useApp();
  const fileInputRef = useRef(null);
  const [confirmPhotoRemove, setConfirmPhotoRemove] = useState(false);
  const tk = todayKey();
  const isEditing = state.logEditingId != null;

  const selectSymptom = (name) => {
    if (isEditing) {
      set({ logSymptoms: [name] });
    } else {
      set((s) => ({ logSymptoms: s.logSymptoms.includes(name) ? s.logSymptoms.filter((n) => n !== name) : s.logSymptoms.concat([name]) }));
    }
  };

  const extraNames = state.customSymptoms.slice();
  state.logSymptoms.forEach((n) => {
    if (!GRID_SYMPTOMS.includes(n) && !extraNames.includes(n)) extraNames.push(n);
  });

  const pool = SYMPTOM_LIBRARY.concat(state.customSymptoms);
  const q = state.symptomQuery.trim();
  const ql = q.toLowerCase();
  const results = ql ? pool.filter((n) => n.toLowerCase().includes(ql)).slice(0, 6) : [];
  const exact = pool.some((n) => n.toLowerCase() === ql);
  const showAddSymptom = q.length > 0 && !exact;

  const addSymptom = () => {
    const n = state.symptomQuery.trim();
    if (!n) return;
    set((s) => {
      const exists = s.customSymptoms.some((x) => x.toLowerCase() === n.toLowerCase());
      const nextCustom = exists ? s.customSymptoms : s.customSymptoms.concat([n]);
      const nextLog = isEditing ? [n] : s.logSymptoms.includes(n) ? s.logSymptoms : s.logSymptoms.concat([n]);
      return { customSymptoms: nextCustom, logSymptoms: nextLog, symptomQuery: '' };
    });
  };

  const removeCustomSymptom = (name, ev) => {
    ev.stopPropagation();
    set({ confirm: { kind: 'symptom', name, title: 'Remove "' + name + '"?', msg: 'This removes it from your symptom list. Entries you already logged with it are kept.', cta: 'Remove symptom' } });
  };

  const openFilePicker = () => fileInputRef.current && fileInputRef.current.click();
  const onFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const dataUrl = await fileToCompressedDataUrl(file);
    set({ hasPhoto: true, photoData: dataUrl });
  };
  const removePhoto = () => {
    set({ hasPhoto: false, photoData: null });
    setConfirmPhotoRemove(false);
  };

  const goBack = () => set({ screen: isEditing ? 'detail' : 'home' });

  const saveEntry = () => {
    if (!state.logSymptoms.length) return;
    const now = new Date();
    let hh = now.getHours();
    const ap = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12 || 12;
    const tstr = hh + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ' ' + ap;
    const note = (state.note || '').trim() || 'No note added.';
    const dateKey = state.logDateKey || tk;

    if (isEditing) {
      const name = state.logSymptoms[0];
      set((s) => ({
        entries: s.entries.map((e) =>
          e.id === s.logEditingId
            ? { ...e, symptom: name, sev: s.severity, since: s.since, note, hasPhoto: s.hasPhoto, photoData: s.photoData, color: symbolColor(name) }
            : e
        ),
        screen: 'detail',
      }));
      return;
    }

    set((s) => {
      const news = s.logSymptoms.map((nm, i) => ({
        id: s.nextEntryId + i,
        symptom: nm,
        sev: s.severity,
        since: s.since,
        note,
        time: tstr,
        dateKey,
        color: symbolColor(nm),
        hasPhoto: s.hasPhoto,
        photoData: s.photoData,
      }));
      const d = new Date(Math.floor(dateKey / 10000), ((Math.floor(dateKey / 100) % 100) - 1), dateKey % 100);
      return {
        entries: news.slice().reverse().concat(s.entries),
        nextEntryId: s.nextEntryId + news.length,
        selectedEntryId: news[0].id,
        selectedKey: dateKey,
        calY: d.getFullYear(),
        calM: d.getMonth(),
        screen: 'saved',
      };
    });
  };

  const sinceIsCustom = !SINCE_PRESETS.includes(state.since);

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 4px' }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#26322e' }}>{isEditing ? 'Edit entry' : 'New entry'}</span>
        <div data-testid="log-close" onClick={goBack} style={{ width: 38, height: 38, borderRadius: '50%', background: '#ebe4d5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {isEditing ? <BackIcon /> : <CloseIcon />}
        </div>
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px 22px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '6px 2px 12px' }}>WHAT ARE YOU NOTICING?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
          {GRID_SYMPTOMS.map((name) => {
            const active = state.logSymptoms.includes(name);
            const Icon = GRID_ICONS[name];
            return (
              <div
                key={name}
                onClick={() => selectSymptom(name)}
                style={{
                  background: active ? '#117468' : '#fdfbf6',
                  border: active ? '1px solid #117468' : '1px solid #e4dccb',
                  borderRadius: 16,
                  padding: '13px 4px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 7,
                  cursor: 'pointer',
                  boxShadow: active ? '0 12px 22px -14px rgba(17,116,104,0.9)' : 'none',
                }}
              >
                <Icon stroke={active ? '#fbfdfb' : '#5b6a64'} />
                <span style={{ fontSize: 12, fontWeight: 600, color: active ? '#fbfdfb' : '#37433d' }}>{name}</span>
              </div>
            );
          })}
        </div>

        {extraNames.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {extraNames.map((n) => {
              const on = state.logSymptoms.includes(n);
              const removable = state.customSymptoms.includes(n);
              return (
                <div
                  key={n}
                  onClick={() => selectSymptom(n)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    background: on ? '#117468' : '#fdfbf6',
                    border: on ? '1px solid #117468' : '1px solid #e4dccb',
                    borderRadius: 100,
                    padding: '7px 14px',
                    fontSize: 13,
                    fontWeight: on ? 700 : 600,
                    color: on ? '#fbfdfb' : '#37433d',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {on && <CheckIcon size={13} stroke="#fbfdfb" strokeWidth="3" />}
                  {n}
                  {removable && (
                    <span onClick={(ev) => removeCustomSymptom(n, ev)} style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 3, cursor: 'pointer' }}>
                      <CloseIcon size={12} stroke={on ? '#fbfdfb' : '#8a938e'} strokeWidth="2.6" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '14px 2px 10px' }}>
          SELECTED · <span style={{ color: '#117468' }}>{state.logSymptoms.length ? state.logSymptoms.join(' + ') : 'None selected'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 14, padding: '11px 14px' }}>
            <SearchIcon />
            <input
              value={state.symptomQuery}
              onInput={(e) => set({ symptomQuery: e.target.value })}
              placeholder="Search or add a symptom"
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, color: '#37433d' }}
            />
          </div>
          <div data-testid="symptom-add-btn" onClick={addSymptom} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 14, padding: '11px 14px', color: '#117468', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <PlusIcon size={14} stroke="#117468" strokeWidth="2.6" />
            Add
          </div>
        </div>

        {q.length > 0 && (
          <div style={{ background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 14, marginTop: 9, overflow: 'hidden' }}>
            {results.map((r) => (
              <div
                key={r}
                onClick={() => {
                  const nextLog = isEditing ? [r] : state.logSymptoms.includes(r) ? state.logSymptoms : state.logSymptoms.concat([r]);
                  set({ logSymptoms: nextLog, symptomQuery: '' });
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid #f0ebe0', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 14.5, color: '#37433d', fontWeight: 600 }}>{r}</span>
                <PlusIcon size={16} stroke="#117468" strokeWidth="2.2" />
              </div>
            ))}
            {showAddSymptom && (
              <div onClick={addSymptom} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 16px', cursor: 'pointer' }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: '#117468', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlusIcon size={14} strokeWidth="2.8" />
                </div>
                <span style={{ fontSize: 14.5, color: '#117468', fontWeight: 700 }}>Add "{q}"</span>
              </div>
            )}
          </div>
        )}

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '18px 2px 12px' }}>HOW BAD IS IT?</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {SEV_DEFS.map((d) => {
            const active = state.severity === d.label;
            return (
              <div
                key={d.label}
                onClick={() => set({ severity: d.label })}
                style={{
                  flex: 1,
                  background: active ? d.bg : '#fdfbf6',
                  border: active ? '1.5px solid ' + d.border : '1px solid #e4dccb',
                  borderRadius: 16,
                  padding: '14px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', gap: 3 }}>
                  <span style={{ width: 7, height: 16, borderRadius: 3, background: active ? d.on[0] : '#d8e2d8' }} />
                  <span style={{ width: 7, height: 16, borderRadius: 3, background: active ? d.on[1] : '#d8e2d8' }} />
                  <span style={{ width: 7, height: 16, borderRadius: 3, background: active ? d.on[2] : '#d8e2d8' }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: active ? d.text : '#37433d' }}>{d.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '24px 2px 12px' }}>SINCE WHEN?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {SINCE_PRESETS.map((o) => (
            <span
              key={o}
              onClick={() => set({ since: o, sinceCalOpen: false })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: !sinceIsCustom && state.since === o ? '#117468' : '#fdfbf6',
                border: !sinceIsCustom && state.since === o ? '1px solid #117468' : '1px solid #e4dccb',
                borderRadius: 100,
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: !sinceIsCustom && state.since === o ? 700 : 600,
                color: !sinceIsCustom && state.since === o ? '#fbfdfb' : '#37433d',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {o}
            </span>
          ))}
          <span
            onClick={() => set((s) => ({ sinceCalOpen: !s.sinceCalOpen }))}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: sinceIsCustom ? '#117468' : '#fdfbf6',
              border: sinceIsCustom ? '1px solid #117468' : '1px solid #e4dccb',
              borderRadius: 100,
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: sinceIsCustom ? 700 : 600,
              color: sinceIsCustom ? '#fbfdfb' : '#37433d',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {sinceIsCustom ? state.since : 'Pick date'}
          </span>
        </div>
        {state.sinceCalOpen && (
          <div style={{ background: '#fbfdfb', border: '1px solid #e8e1d2', borderRadius: 16, padding: '12px 12px 10px', marginTop: 10 }}>
            <CalendarNavHeader
              label={MOF[state.sinceCalM] + ' ' + state.sinceCalY}
              onPrev={() => set((s) => (s.sinceCalM === 0 ? { sinceCalM: 11, sinceCalY: s.sinceCalY - 1 } : { sinceCalM: s.sinceCalM - 1 }))}
              onNext={() => set((s) => (s.sinceCalM === 11 ? { sinceCalM: 0, sinceCalY: s.sinceCalY + 1 } : { sinceCalM: s.sinceCalM + 1 }))}
            />
            <MonthGrid
              year={state.sinceCalY}
              month={state.sinceCalM}
              getDayMeta={(k) => ({
                disabled: k > tk,
                selected: sinceIsCustom && state.since === fmtDM(k),
              })}
              onPick={(k) => set({ since: fmtDM(k), sinceCalOpen: false })}
            />
          </div>
        )}

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '26px 2px 12px' }}>
          PHOTO <span style={{ fontWeight: 600, color: '#b3ab99' }}>· OPTIONAL</span>
        </div>
        <div style={{ display: 'flex', gap: 11 }}>
          <input ref={fileInputRef} data-testid="photo-file-input" type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={onFileChange} />
          <div
            data-testid="photo-box"
            onClick={state.hasPhoto ? () => setConfirmPhotoRemove(true) : openFilePicker}
            style={{
              width: 82,
              height: 82,
              borderRadius: 16,
              border: state.hasPhoto ? '1.5px solid #117468' : '1.5px dashed #c9c0ac',
              background: state.hasPhoto && state.photoData ? `url(${state.photoData}) center/cover` : state.hasPhoto ? '#eef4ef' : '#fbf8f1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              flexShrink: 0,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {!state.hasPhoto && <PhotoIcon />}
            {!state.photoData && <span style={{ fontSize: 11, color: state.hasPhoto ? '#117468' : '#9a9384', fontWeight: 600 }}>{state.hasPhoto ? 'Added' : 'Add photo'}</span>}
            {state.hasPhoto && (
              <div style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(15,25,22,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CloseIcon size={11} stroke="#fff" strokeWidth="2.6" />
              </div>
            )}
          </div>
          <div onClick={openFilePicker} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 11, background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 16, padding: '0 16px', cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: '#efe9dd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PhotoIcon size={21} stroke="#5b6a64" />
            </div>
            <span style={{ fontSize: 14, color: '#5b6a64', lineHeight: 1.4 }}>{state.hasPhoto ? 'Photo attached — tap to replace' : 'Take a photo of a rash, swelling or symptom'}</span>
          </div>
        </div>
        {confirmPhotoRemove && (
          <div style={{ display: 'flex', gap: 9, marginTop: 9 }}>
            <button onClick={() => setConfirmPhotoRemove(false)} style={{ flex: 1, border: '1.5px solid #c9c0ac', background: '#fdfbf6', color: '#37433d', fontSize: 13, fontWeight: 700, padding: 10, borderRadius: 100, cursor: 'pointer' }}>
              Keep photo
            </button>
            <button onClick={removePhoto} style={{ flex: 1, border: 'none', background: '#b0473a', color: '#fbfdfb', fontSize: 13, fontWeight: 700, padding: 10, borderRadius: 100, cursor: 'pointer' }}>
              Remove photo
            </button>
          </div>
        )}

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '24px 2px 12px' }}>
          NOTES <span style={{ fontWeight: 600, color: '#b3ab99' }}>· OPTIONAL</span>
        </div>
        <textarea
          value={state.note}
          onInput={(e) => set({ note: e.target.value })}
          placeholder="Add a note — sore on the stairs, eased after sitting…"
          style={{ width: '100%', background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 16, padding: '15px 16px', minHeight: 92, fontSize: 14.5, color: '#37433d', lineHeight: 1.5, resize: 'none' }}
        />
      </div>
      <div style={{ flexShrink: 0, background: '#f3efe4', padding: '12px 22px 12px', borderTop: '1px solid #e8e1d2' }}>
        <button
          onClick={saveEntry}
          style={{
            width: '100%',
            border: 'none',
            background: state.logSymptoms.length ? '#117468' : '#bcd0ca',
            color: '#fbfdfb',
            fontSize: 16,
            fontWeight: 700,
            padding: 17,
            borderRadius: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            cursor: state.logSymptoms.length ? 'pointer' : 'not-allowed',
          }}
        >
          <CheckIcon />
          {isEditing ? 'Save changes' : 'Save entry'}
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '9px 0 2px' }}>
          <div style={{ width: 128, height: 5, borderRadius: 3, background: '#23332f', opacity: 0.28 }} />
        </div>
      </div>
    </div>
  );
}

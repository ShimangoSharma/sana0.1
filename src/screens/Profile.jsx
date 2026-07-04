import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { BackIcon, FemaleIcon, MaleIcon, CheckIcon, PlusIcon } from '../components/icons';
import { Pill, PrimaryButton } from '../components/ui';

const AGE_OPTIONS = ['0–10', '10–20', '20–30', '30–40', '40–50', '50–60', '60+'];

export default function Profile() {
  const { state, set } = useApp();
  const [newTreatment, setNewTreatment] = useState('');

  const toggleTreatment = (name) => set((s) => ({ treatments: { ...s.treatments, [name]: !s.treatments[name] } }));
  const addTreatment = () => {
    const n = newTreatment.trim();
    if (!n) return;
    set((s) => ({ treatments: { ...s.treatments, [n]: true } }));
    setNewTreatment('');
  };

  const sexBoxStyle = (active) => ({
    flex: 1,
    background: active ? '#117468' : '#fdfbf6',
    border: active ? '1.5px solid #117468' : '1px solid #e4dccb',
    borderRadius: 18,
    padding: '20px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
  });

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 4px' }}>
        <div onClick={() => set({ screen: 'settings' })} style={{ width: 40, height: 40, borderRadius: '50%', background: '#ebe4d5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <BackIcon />
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#26322e' }}>Profile</span>
        <div style={{ width: 40 }} />
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '4px 2px 10px' }}>FIRST NAME</div>
        <input
          value={state.firstName}
          onInput={(e) => set({ firstName: e.target.value })}
          placeholder="First name"
          style={{ width: '100%', background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 16, padding: '15px 16px', fontSize: 16, fontWeight: 600, color: '#26322e' }}
        />
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '18px 2px 10px' }}>LAST NAME</div>
        <input
          value={state.lastName}
          onInput={(e) => set({ lastName: e.target.value })}
          placeholder="Last name"
          style={{ width: '100%', background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 16, padding: '15px 16px', fontSize: 16, fontWeight: 600, color: '#26322e' }}
        />
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '18px 2px 12px' }}>SEX</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div onClick={() => set({ sex: 'Female' })} style={sexBoxStyle(state.sex === 'Female')}>
            <FemaleIcon size={24} stroke={state.sex === 'Female' ? '#fbfdfb' : '#5b6a64'} />
            <span style={{ fontSize: 15, fontWeight: 700, color: state.sex === 'Female' ? '#fbfdfb' : '#5b6a64' }}>Female</span>
          </div>
          <div onClick={() => set({ sex: 'Male' })} style={sexBoxStyle(state.sex === 'Male')}>
            <MaleIcon size={24} stroke={state.sex === 'Male' ? '#fbfdfb' : '#5b6a64'} />
            <span style={{ fontSize: 15, fontWeight: 700, color: state.sex === 'Male' ? '#fbfdfb' : '#5b6a64' }}>Male</span>
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '18px 2px 12px' }}>AGE RANGE</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {AGE_OPTIONS.map((o) => (
            <Pill key={o} active={state.ageRange === o} onClick={() => set({ ageRange: o })}>
              {o}
            </Pill>
          ))}
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '18px 2px 12px' }}>ONGOING TREATMENTS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.keys(state.treatments).map((name) => {
            const on = state.treatments[name];
            return (
              <div
                key={name}
                onClick={() => toggleTreatment(name)}
                style={{ display: 'flex', alignItems: 'center', gap: 13, background: on ? '#117468' : '#fdfbf6', border: on ? '1.5px solid #117468' : '1px solid #e4dccb', borderRadius: 16, padding: '15px 16px', cursor: 'pointer' }}
              >
                <div style={{ width: 24, height: 24, borderRadius: 8, background: on ? '#fbfdfb' : 'transparent', border: on ? 'none' : '1.6px solid #cdc6b4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {on && <CheckIcon size={15} stroke="#117468" strokeWidth="3.4" />}
                </div>
                <span style={{ flex: 1, fontSize: 15.5, fontWeight: on ? 700 : 600, color: on ? '#fbfdfb' : '#37433d' }}>{name}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 10 }}>
          <input
            value={newTreatment}
            onInput={(e) => setNewTreatment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTreatment()}
            placeholder="Add your own treatment"
            style={{ flex: 1, background: '#fbf8f1', border: '1.5px dashed #c9c0ac', borderRadius: 16, padding: '14px 16px', fontSize: 14.5, color: '#37433d' }}
          />
          <div data-testid="add-treatment" onClick={addTreatment} style={{ width: 52, borderRadius: 16, background: '#117468', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <PlusIcon size={20} strokeWidth="2.6" />
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, background: '#f3efe4', padding: '12px 24px 12px', borderTop: '1px solid #e8e1d2' }}>
        <PrimaryButton onClick={() => set({ screen: 'settings' })}>
          <CheckIcon />
          Save changes
        </PrimaryButton>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '9px 0 2px' }}>
          <div style={{ width: 128, height: 5, borderRadius: 3, background: '#23332f', opacity: 0.28 }} />
        </div>
      </div>
    </div>
  );
}

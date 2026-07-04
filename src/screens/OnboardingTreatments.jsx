import { useApp } from '../store/AppContext';
import { useState } from 'react';
import { BackIcon, CheckIcon, PlusIcon } from '../components/icons';
import { PrimaryButton, HomeBar } from '../components/ui';

export default function OnboardingTreatments() {
  const { state, set } = useApp();
  const [newTreatment, setNewTreatment] = useState('');

  const toggle = (name) => set((s) => ({ treatments: { ...s.treatments, [name]: !s.treatments[name] } }));
  const addTreatment = () => {
    const n = newTreatment.trim();
    if (!n) return;
    set((s) => ({ treatments: { ...s.treatments, [n]: true } }));
    setNewTreatment('');
  };
  const finish = () => set({ screen: 'home', onboarded: true });

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, padding: '8px 24px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ height: 5, flex: 1, borderRadius: 3, background: '#117468' }} />
        <span style={{ height: 5, flex: 1, borderRadius: 3, background: '#117468' }} />
        <span style={{ height: 5, flex: 1, borderRadius: 3, background: '#117468' }} />
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px 4px' }}>
        <div onClick={() => set({ screen: 'basics' })} style={{ width: 40, height: 40, borderRadius: '50%', background: '#ebe4d5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <BackIcon />
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#8a938e' }}>Step 3 of 3</span>
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '18px 26px 20px' }}>
        <div className="serif" style={{ fontSize: 34, lineHeight: 1.1, fontWeight: 500, color: '#26322e', letterSpacing: '-0.01em' }}>
          Any ongoing treatments?
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: '#7a8078', marginTop: 12, maxWidth: 290 }}>
          Pick any that apply; you can change these later.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 26 }}>
          {Object.keys(state.treatments).map((name) => {
            const on = state.treatments[name];
            return (
              <div
                key={name}
                onClick={() => toggle(name)}
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
      <div style={{ flexShrink: 0, padding: '12px 26px 12px' }}>
        <PrimaryButton onClick={finish}>
          <CheckIcon />
          Finish setup
        </PrimaryButton>
        <HomeBar />
      </div>
    </div>
  );
}

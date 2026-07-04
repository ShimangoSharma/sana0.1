import { useApp } from '../store/AppContext';
import { ArrowRightIcon, BackIcon, FemaleIcon, MaleIcon } from '../components/icons';
import { Pill, HomeBar } from '../components/ui';

const AGE_OPTIONS = ['0–10', '10–20', '20–30', '30–40', '40–50', '50–60', '60+'];

export default function OnboardingBasics() {
  const { state, set } = useApp();
  const canContinue = !!state.sex && !!state.ageRange;

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
    boxShadow: active ? '0 14px 26px -16px rgba(17,116,104,0.9)' : 'none',
  });

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, padding: '8px 24px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ height: 5, flex: 1, borderRadius: 3, background: '#117468' }} />
        <span style={{ height: 5, flex: 1, borderRadius: 3, background: '#117468' }} />
        <span style={{ height: 5, flex: 1, borderRadius: 3, background: '#e2dccc' }} />
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px 4px' }}>
        <div onClick={() => set({ screen: 'name' })} style={{ width: 40, height: 40, borderRadius: '50%', background: '#ebe4d5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <BackIcon />
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#8a938e' }}>Step 2 of 3</span>
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px 26px 20px' }}>
        <div className="serif" style={{ fontSize: 34, lineHeight: 1.1, fontWeight: 500, color: '#26322e', letterSpacing: '-0.01em' }}>
          A few basics
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: '#7a8078', marginTop: 12, maxWidth: 290 }}>
          Some symptoms mean different things at different ages — this gives your doctor the right context in your summaries.
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '34px 2px 12px' }}>SEX</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div onClick={() => set({ sex: 'Female' })} style={sexBoxStyle(state.sex === 'Female')}>
            <FemaleIcon stroke={state.sex === 'Female' ? '#fbfdfb' : '#5b6a64'} />
            <span style={{ fontSize: 16, fontWeight: 700, color: state.sex === 'Female' ? '#fbfdfb' : '#5b6a64' }}>Female</span>
          </div>
          <div onClick={() => set({ sex: 'Male' })} style={sexBoxStyle(state.sex === 'Male')}>
            <MaleIcon stroke={state.sex === 'Male' ? '#fbfdfb' : '#5b6a64'} />
            <span style={{ fontSize: 16, fontWeight: 700, color: state.sex === 'Male' ? '#fbfdfb' : '#5b6a64' }}>Male</span>
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '34px 2px 12px' }}>AGE RANGE</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {AGE_OPTIONS.map((o) => (
            <Pill key={o} active={state.ageRange === o} onClick={() => set({ ageRange: o })}>
              {o}
            </Pill>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '12px 26px 12px' }}>
        <button
          onClick={() => canContinue && set({ screen: 'treat' })}
          style={{
            width: '100%',
            border: 'none',
            color: '#fbfdfb',
            fontSize: 16,
            fontWeight: 700,
            padding: 17,
            borderRadius: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            background: canContinue ? '#117468' : '#bcd0ca',
            cursor: canContinue ? 'pointer' : 'not-allowed',
          }}
        >
          Continue
          <ArrowRightIcon stroke="#fbfdfb" />
        </button>
        <HomeBar />
      </div>
    </div>
  );
}

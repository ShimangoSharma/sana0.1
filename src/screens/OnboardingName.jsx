import { useApp } from '../store/AppContext';
import { SparkIcon, ArrowRightIcon } from '../components/icons';
import { HomeBar } from '../components/ui';

export default function OnboardingName() {
  const { state, set } = useApp();
  const canContinue = state.firstName.trim().length > 0;

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, padding: '8px 24px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ height: 5, flex: 1, borderRadius: 3, background: '#117468' }} />
        <span style={{ height: 5, flex: 1, borderRadius: 3, background: '#e2dccc' }} />
        <span style={{ height: 5, flex: 1, borderRadius: 3, background: '#e2dccc' }} />
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '34px 26px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <SparkIcon size={20} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', color: '#117468' }}>WELCOME TO SANA</span>
        </div>
        <div className="serif" style={{ fontSize: 38, lineHeight: 1.08, fontWeight: 500, color: '#26322e', letterSpacing: '-0.01em', marginTop: 20 }}>
          What should we call you?
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: '#7a8078', marginTop: 14, maxWidth: 290 }}>
          This is your private space to track how you feel between visits.
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '38px 2px 10px' }}>FIRST NAME</div>
        <input
          value={state.firstName}
          onInput={(e) => set({ firstName: e.target.value })}
          placeholder="Your first name"
          style={{ width: '100%', background: '#fdfbf6', border: '1.5px solid #117468', borderRadius: 16, padding: '16px 18px', fontSize: 18, fontWeight: 600, color: '#26322e' }}
        />
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '20px 2px 10px' }}>
          LAST NAME <span style={{ fontWeight: 600, color: '#b3ab99' }}>· OPTIONAL</span>
        </div>
        <input
          value={state.lastName}
          onInput={(e) => set({ lastName: e.target.value })}
          placeholder="Your last name"
          style={{ width: '100%', background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 16, padding: '16px 18px', fontSize: 18, fontWeight: 600, color: '#26322e' }}
        />
      </div>
      <div style={{ flexShrink: 0, padding: '12px 26px 12px' }}>
        <button
          onClick={() => canContinue && set({ screen: 'basics' })}
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

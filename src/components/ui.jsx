export function Pill({ active, small, children, onClick, style }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: active ? '#117468' : '#fdfbf6',
        border: active ? '1px solid #117468' : '1px solid #e4dccb',
        borderRadius: 100,
        padding: small ? '7px 14px' : '10px 16px',
        fontSize: small ? 13 : 14,
        fontWeight: active ? 700 : 600,
        color: active ? '#fbfdfb' : '#37433d',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function RoundIconButton({ onClick, size = 40, bg = '#ebe4d5', children }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children, style }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: '#9a9384',
        margin: '18px 2px 12px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({ onClick, disabled, children, style }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        width: '100%',
        border: 'none',
        background: disabled ? '#bcd0ca' : '#117468',
        color: '#fbfdfb',
        fontSize: 16,
        fontWeight: 700,
        padding: 17,
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function HomeBar() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '9px 0 2px' }}>
      <div style={{ width: 128, height: 5, borderRadius: 3, background: '#23332f', opacity: 0.28 }} />
    </div>
  );
}

export function TextInput(props) {
  const { style, ...rest } = props;
  return (
    <input
      {...rest}
      style={{
        width: '100%',
        background: '#fdfbf6',
        border: '1px solid #e4dccb',
        borderRadius: 16,
        padding: '15px 16px',
        fontSize: 16,
        fontWeight: 600,
        color: '#26322e',
        ...style,
      }}
    />
  );
}

export function Toggle({ on, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 44,
        height: 26,
        borderRadius: 100,
        background: on ? '#117468' : '#d8d0bf',
        padding: 3,
        display: 'flex',
        justifyContent: on ? 'flex-end' : 'flex-start',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
    </div>
  );
}

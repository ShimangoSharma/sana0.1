import { monthCells, MOF } from '../lib/dateUtils';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function CalendarNavHeader({ label, onPrev, onNext, size = 28 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px 8px' }}>
      <div
        onClick={onPrev}
        style={{ width: size, height: size, borderRadius: '50%', background: '#efe9dd', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#37433d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#26322e' }}>{label}</span>
      <div
        onClick={onNext}
        style={{ width: size, height: size, borderRadius: '50%', background: '#efe9dd', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#37433d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>
    </div>
  );
}

export function monthLabel(y, m) {
  return MOF[m] + ' ' + y;
}

// Generic month grid. `getDayMeta(key, day)` decides how each day renders:
// { selected, inRange, disabled, dots: [colors] }. `onPick(key)` fires for
// enabled days only.
export function MonthGrid({ year, month, cellHeight = 38, getDayMeta, onPick }) {
  const cells = monthCells(year, month, (k, d) => {
    const meta = getDayMeta(k, d) || {};
    return { key: k, day: d, ...meta };
  });

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1, marginBottom: 3 }}>
        {WEEKDAYS.map((w, i) => (
          <span key={i} style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: '#b3ab99' }}>
            {w}
          </span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1 }}>
        {cells.map((c) => {
          if (c.blank) return <div key={c.key} style={{ height: cellHeight }} />;
          const numStyle = c.selected
            ? { width: 30, height: 30, borderRadius: '50%', background: '#117468', color: '#fbfdfb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13.5, fontWeight: 700, margin: '0 auto' }
            : c.today
              ? { width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #117468', color: '#117468', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13.5, fontWeight: 700, boxSizing: 'border-box', margin: '0 auto' }
              : { fontSize: 13.5, color: c.disabled ? '#cbc3b1' : '#37433d' };
          return (
            <div
              key={c.key}
              onClick={c.disabled ? undefined : () => onPick(c.key)}
              style={{
                height: cellHeight,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                cursor: c.disabled ? 'default' : 'pointer',
                background: c.inRange ? '#e7f1ea' : 'transparent',
                borderRadius: c.inRange ? 8 : 0,
              }}
            >
              <span style={numStyle}>{c.day}</span>
              {c.showDots && (
                <div style={{ display: 'flex', gap: 2, height: 5 }}>
                  {(c.dots || []).slice(0, 3).map((color, i) => (
                    <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

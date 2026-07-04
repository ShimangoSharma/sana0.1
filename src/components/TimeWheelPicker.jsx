import { useEffect, useRef } from 'react';

const ITEM_H = 40;
const PAD_H = 80;

function WheelColumn({ values, value, format, onChange }) {
  const elRef = useRef(null);
  const timerRef = useRef(null);
  const initedRef = useRef(false);

  useEffect(() => {
    const idx = Math.max(0, values.indexOf(value));
    const el = elRef.current;
    if (el && !initedRef.current) {
      initedRef.current = true;
      el.scrollTop = idx * ITEM_H;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = (ev) => {
    const el = ev.target;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const i = Math.max(0, Math.min(values.length - 1, Math.round(el.scrollTop / ITEM_H)));
      if (Math.abs(el.scrollTop - i * ITEM_H) > 1) el.scrollTo({ top: i * ITEM_H, behavior: 'smooth' });
      if (values[i] !== value) onChange(values[i]);
    }, 130);
  };

  const pick = (i) => {
    const el = elRef.current;
    if (el) el.scrollTo({ top: i * ITEM_H, behavior: 'smooth' });
    onChange(values[i]);
  };

  return (
    <div ref={elRef} onScroll={onScroll} className="no-scrollbar" style={{ flex: 1, height: 200, overflowY: 'auto' }}>
      <div style={{ height: PAD_H }} />
      {values.map((v, i) => (
        <div
          key={v}
          onClick={() => pick(i)}
          style={{
            height: ITEM_H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: v === value ? 19 : 16,
            fontWeight: 700,
            color: v === value ? '#117468' : '#b3ab99',
            cursor: 'pointer',
          }}
        >
          {format(v)}
        </div>
      ))}
      <div style={{ height: PAD_H }} />
    </div>
  );
}

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const AMPM = ['AM', 'PM'];
const pad2 = (n) => (n < 10 ? '0' : '') + n;

export default function TimeWheelPicker({ hour, minute, ampm, onChangeHour, onChangeMinute, onChangeAmpm }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: PAD_H, height: ITEM_H, background: '#eef4ef', borderRadius: 10, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', gap: 4, position: 'relative' }}>
        <WheelColumn values={HOURS} value={hour} format={String} onChange={onChangeHour} />
        <div style={{ width: 14, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#26322e' }}>:</div>
        <WheelColumn values={MINUTES} value={minute} format={pad2} onChange={onChangeMinute} />
        <WheelColumn values={AMPM} value={ampm} format={(x) => x} onChange={onChangeAmpm} />
      </div>
    </div>
  );
}

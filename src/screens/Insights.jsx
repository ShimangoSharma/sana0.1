import { useApp } from '../store/AppContext';
import { todayKey, fmtDM, fmtDMY, diffDays, MOF } from '../lib/dateUtils';
import { aggregateBySymptom, findRising, presetRangeDays, rangeFromPreset } from '../lib/analytics';
import { Pill } from '../components/ui';
import { CalendarIcon, TrendIcon, ChevronRight } from '../components/icons';
import { CalendarNavHeader, MonthGrid } from '../components/MonthCalendar';

const PRESETS = ['4 weeks', '6 weeks', '3 months'];

function barColor(r) {
  return r >= 0.85 ? '#117468' : r >= 0.6 ? '#5a8f6f' : r >= 0.35 ? '#9bbfa9' : r > 0 ? '#cdd9cf' : '#dfe7df';
}

export default function Insights() {
  const { state, set } = useApp();
  const tk = todayKey();
  const insSaved = !!(state.insFrom && state.insTo);

  const applied = state.insightCustom && insSaved ? { from: state.insFrom, to: state.insTo } : rangeFromPreset(tk, presetRangeDays('insight', state.insightRange));
  const { list, inRange, span } = aggregateBySymptom(state.entries, applied.from, applied.to);
  const rising = findRising(list);

  const bucketOf = (k) => Math.min(5, Math.floor((diffDays(applied.from, k) * 6) / span));
  const wk = [0, 0, 0, 0, 0, 0];
  inRange.forEach((x) => wk[bucketOf(x.dateKey)]++);
  const wkMax = Math.max.apply(null, wk.concat([1]));

  const insDF = state.insDraftFrom;
  const insDT = state.insDraftTo;

  const toggleCustom = () =>
    state.insightCustom
      ? set({ insightCustom: false, insCalOpen: false })
      : set({ insightCustom: true, insCalOpen: !insSaved, insDraftFrom: state.insFrom, insDraftTo: state.insTo });

  const pickDay = (k) => {
    if (!insDF || (insDF && insDT)) set({ insDraftFrom: k, insDraftTo: null });
    else if (k < insDF) set({ insDraftFrom: k, insDraftTo: insDF });
    else set({ insDraftTo: k });
  };

  const reset = () => set({ insDraftFrom: null, insDraftTo: null, insFrom: null, insTo: null, insightCustom: false, insCalOpen: false, insightRange: '6 weeks' });
  const save = () => insDF && insDT && set({ insFrom: insDF, insTo: insDT, insCalOpen: false });

  const draftHint = insDF && insDT ? fmtDM(insDF) + ' – ' + fmtDM(insDT) + ' · ' + (diffDays(insDF, insDT) + 1) + ' days' : insDF ? fmtDM(insDF) + ' — now pick an end date' : 'Pick a start date';

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, padding: '8px 22px 0' }}>
        <div className="serif" style={{ fontSize: 32, fontWeight: 500, color: '#26322e', letterSpacing: '-0.01em' }}>
          Insights
        </div>
        <div style={{ display: 'flex', gap: 7, marginTop: 14, flexWrap: 'wrap' }}>
          {PRESETS.map((o) => (
            <Pill key={o} small active={!state.insightCustom && state.insightRange === o} onClick={() => set({ insightRange: o, insightCustom: false, insCalOpen: false })}>
              {o}
            </Pill>
          ))}
          <Pill small active={state.insightCustom} onClick={toggleCustom}>
            <CalendarIcon size={13} stroke={state.insightCustom ? '#fbfdfb' : '#37433d'} strokeWidth="2" />
            Custom range
          </Pill>
        </div>

        {state.insightCustom && (
          <div style={{ background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 14, padding: '9px 10px', marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div onClick={() => set({ insCalOpen: true })} style={{ flex: 1, background: '#f6f1e8', borderRadius: 10, padding: '8px 12px', cursor: 'pointer' }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: '#9a9384' }}>FROM</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#26322e', marginTop: 1 }}>{insDF ? fmtDMY(insDF) : state.insFrom ? fmtDMY(state.insFrom) : 'Start date'}</div>
              </div>
              <ChevronRight size={16} stroke="#b3ab99" />
              <div onClick={() => set({ insCalOpen: true })} style={{ flex: 1, background: '#f6f1e8', borderRadius: 10, padding: '8px 12px', cursor: 'pointer' }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: '#9a9384' }}>TO</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#26322e', marginTop: 1 }}>{insDT ? fmtDMY(insDT) : insDF ? 'End date' : state.insTo ? fmtDMY(state.insTo) : 'End date'}</div>
              </div>
              <div onClick={() => set({ insCalOpen: true })} style={{ width: 38, height: 38, borderRadius: 11, background: '#117468', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                <CalendarIcon size={18} stroke="#fbfdfb" />
              </div>
            </div>
            {state.insCalOpen && (
              <div style={{ marginTop: 10, borderTop: '1px solid #eee6d7', paddingTop: 10 }}>
                <CalendarNavHeader
                  label={MOF[state.insCalM] + ' ' + state.insCalY}
                  onPrev={() => set((s) => (s.insCalM === 0 ? { insCalM: 11, insCalY: s.insCalY - 1 } : { insCalM: s.insCalM - 1 }))}
                  onNext={() => set((s) => (s.insCalM === 11 ? { insCalM: 0, insCalY: s.insCalY + 1 } : { insCalM: s.insCalM + 1 }))}
                />
                <MonthGrid
                  year={state.insCalY}
                  month={state.insCalM}
                  getDayMeta={(k) => ({
                    disabled: k > tk,
                    selected: k === insDF || k === insDT,
                    inRange: !!(insDF && insDT && k > insDF && k < insDT),
                  })}
                  onPick={pickDay}
                />
                <div style={{ fontSize: 11.5, color: '#8a938e', margin: '8px 2px 0' }}>{draftHint}</div>
                <div style={{ display: 'flex', gap: 9, marginTop: 10 }}>
                  <button onClick={reset} style={{ flex: 1, border: '1.5px solid #c9c0ac', background: '#fdfbf6', color: '#37433d', fontSize: 13.5, fontWeight: 700, padding: 11, borderRadius: 100, cursor: 'pointer' }}>
                    Reset
                  </button>
                  <button
                    onClick={save}
                    style={{ flex: 1, border: 'none', color: '#fbfdfb', fontSize: 13.5, fontWeight: 700, padding: 11, borderRadius: 100, background: insDF && insDT ? '#117468' : '#bcd0ca', cursor: insDF && insDT ? 'pointer' : 'not-allowed' }}
                  >
                    Save range
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px 22px 22px' }}>
        {inRange.length > 0 ? (
          <>
            <div style={{ background: '#fbeee4', border: '1px solid #f0d6c4', borderRadius: 18, padding: '16px 17px', display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <TrendIcon />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#9a4a2c' }}>{rising ? rising.name + ' is trending up' : 'Symptoms look steady'}</div>
                <div style={{ fontSize: 13, color: '#a86a4e', marginTop: 1 }}>{rising ? 'From ' + rising.first + '× to ' + rising.second + '× across this range' : 'Nothing is rising in this range'}</div>
              </div>
            </div>

            <div style={{ background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 20, padding: 18, marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#26322e' }}>Entries over time</span>
                <span style={{ fontSize: 13, color: '#8a938e' }}>{inRange.length} total</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 130, marginTop: 18 }}>
                {wk.map((c, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 7, height: '100%' }}>
                    <div style={{ width: '100%', height: Math.max(6, Math.round((c / wkMax) * 108)), background: barColor(c / wkMax), borderRadius: 6 }} />
                    <span style={{ fontSize: 10, color: i === 5 ? '#37433d' : '#a39c8c', fontWeight: i === 5 ? 700 : 400 }}>{'W' + (i + 1)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '24px 2px 12px' }}>BY SYMPTOM</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {list.slice(0, 3).map((a) => {
                const bmax = Math.max.apply(null, a.buckets.concat([1]));
                const arrow = a.second > a.first ? '↑ ' : a.second < a.first ? '↓ ' : '→ ';
                const countColor = a.second > a.first ? '#b07c2f' : a.second < a.first ? '#3f7a5b' : '#8a938e';
                return (
                  <div key={a.name} style={{ background: '#fdfbf6', border: '1px solid #e4dccb', borderRadius: 16, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: a.color }} />
                        <span style={{ fontSize: 14.5, fontWeight: 700, color: '#26322e' }}>{a.name}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: countColor }}>{arrow + a.total + '×'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 30 }}>
                      {a.buckets.map((c, i) => (
                        <span key={i} style={{ flex: 1, height: Math.max(8, Math.round((c / bmax) * 100)) + '%', background: a.color, opacity: i >= 4 ? 1 : 0.45, borderRadius: 2 }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ background: '#fbf8f1', border: '1.5px dashed #c9c0ac', borderRadius: 18, padding: '28px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#37433d' }}>No entries in this range</div>
            <div style={{ fontSize: 13.5, color: '#8a938e', marginTop: 6, lineHeight: 1.5 }}>Pick a different range, or log a symptom to start seeing patterns.</div>
          </div>
        )}
      </div>
    </div>
  );
}

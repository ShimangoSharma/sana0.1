import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { todayKey, fmtDM, fmtDMY, diffDays, shiftKey, MOF } from '../lib/dateUtils';
import { aggregateBySymptom } from '../lib/analytics';
import { buildSummaryPdf, shareSummary } from '../lib/exportSummary';
import { BackIcon, SparkIcon, CalendarIcon, ChevronRight, ShareIcon } from '../components/icons';
import { Pill } from '../components/ui';
import { CalendarNavHeader, MonthGrid } from '../components/MonthCalendar';

const PERIODS = ['Last week', 'Last month', 'Last 3 months', '6 months'];
const HEADINGS = { 'Last week': 'Last week, summarised', 'Last month': 'Last month, summarised', 'Last 3 months': 'Last 3 months, summarised', '6 months': '6 months, summarised' };
const SPANS = { 'Last week': 7, 'Last month': 30, 'Last 3 months': 91, '6 months': 182 };

export default function Summary() {
  const { state, set } = useApp();
  const tk = todayKey();
  const [toast, setToast] = useState('');

  const sumSaved = !!(state.sumFrom && state.sumTo);
  const presetDays = SPANS[state.summaryPeriod] || 30;
  const range = state.summaryCustom && sumSaved ? { from: state.sumFrom, to: state.sumTo } : { from: shiftKey(tk, -(presetDays - 1)), to: tk };

  const { list: sumSyms, inRange: sumList, span: sumSpan } = aggregateBySymptom(state.entries, range.from, range.to);
  const sumMax = sumSyms.length ? sumSyms[0].total : 1;
  const sumTop = sumSyms.slice(0, 3).map((a) => ({
    name: a.name,
    color: a.color,
    count: a.total,
    trend: a.second > a.first ? '↑ trending' : a.second < a.first ? '↓ easing' : '→ steady',
    trendColor: a.second > a.first ? '#b07c2f' : a.second < a.first ? '#3f7a5b' : '#8a938e',
    barPct: Math.max(8, Math.round((a.total / sumMax) * 100)),
  }));

  const pname = (state.firstName + ' ' + state.lastName).trim() || 'Patient';
  const treats = Object.keys(state.treatments).filter((k) => state.treatments[k]);
  const patientLine = pname + (state.sex ? ' · ' + state.sex : '') + (state.ageRange ? ', ' + state.ageRange + ' yr' : '');
  const treatLine = treats.length ? 'Ongoing treatment: ' + treats.join(', ') : 'No ongoing treatments recorded';

  const firstSeen = {};
  state.entries.forEach((x) => {
    if (!firstSeen[x.symptom] || x.dateKey < firstSeen[x.symptom]) firstSeen[x.symptom] = x.dateKey;
  });
  const askItems = [];
  const rising = sumSyms.filter((a) => a.second > a.first)[0];
  if (rising) askItems.push(rising.name + ' is appearing more often (' + rising.first + '× → ' + rising.second + '× in this period)' + (treats.length ? ' — expected with ' + treats[0].toLowerCase() + '?' : ' — is this expected?'));
  sumSyms.forEach((a) => {
    if (firstSeen[a.name] >= range.from && askItems.length < 4) askItems.push('New ' + a.name.toLowerCase() + ' since ' + fmtDM(firstSeen[a.name]) + ' — worth looking at?');
  });
  const sevLast = sumList.filter((x) => x.sev === 'Severe').sort((a, b) => b.dateKey - a.dateKey)[0];
  if (sevLast && askItems.length < 4) askItems.push('Severe ' + sevLast.symptom.toLowerCase() + ' on ' + fmtDM(sevLast.dateKey) + ' — discuss managing flare-ups?');
  const photoCount = sumList.filter((x) => x.hasPhoto).length;
  if (photoCount > 0 && askItems.length < 4) askItems.push(photoCount + (photoCount === 1 ? ' photo' : ' photos') + ' attached — review together during the visit.');

  const upcoming = state.appts.filter((a) => a.dateKey >= tk).sort((a, b) => a.dateKey - b.dateKey);
  const doctorUpper = (upcoming[0] && upcoming[0].doctor ? upcoming[0].doctor : 'your doctor').toUpperCase();

  const sumDF = state.sumDraftFrom;
  const sumDT = state.sumDraftTo;
  const toggleCustom = () =>
    state.summaryCustom ? set({ summaryCustom: false, sumCalOpen: false }) : set({ summaryCustom: true, sumCalOpen: !sumSaved, sumDraftFrom: state.sumFrom, sumDraftTo: state.sumTo });
  const pickDay = (k) => {
    if (!sumDF || (sumDF && sumDT)) set({ sumDraftFrom: k, sumDraftTo: null });
    else if (k < sumDF) set({ sumDraftFrom: k, sumDraftTo: sumDF });
    else set({ sumDraftTo: k });
  };
  const reset = () => set({ sumDraftFrom: null, sumDraftTo: null, sumFrom: null, sumTo: null, summaryCustom: false, sumCalOpen: false, summaryPeriod: 'Last month' });
  const save = () => sumDF && sumDT && set({ sumFrom: sumDF, sumTo: sumDT, sumCalOpen: false });
  const draftHint = sumDF && sumDT ? fmtDM(sumDF) + ' – ' + fmtDM(sumDT) + ' · ' + (diffDays(sumDF, sumDT) + 1) + ' days' : sumDF ? fmtDM(sumDF) + ' — now pick an end date' : 'Pick a start date';

  const buildSummaryObject = () => ({
    heading: state.summaryCustom && sumSaved ? 'Custom range, summarised' : HEADINGS[state.summaryPeriod],
    rangeLabel: fmtDM(range.from) + ' – ' + fmtDMY(range.to) + ' · ' + sumSpan + ' days',
    doctor: doctorUpper,
    patientLine,
    treatLine,
    entriesCount: sumList.length,
    days: sumSpan,
    symptomsCount: sumSyms.length,
    top: sumTop.map((t) => ({ name: t.name, count: t.count, trend: t.trend })),
    askItems,
    entryList: sumList
      .slice()
      .sort((a, b) => b.dateKey - a.dateKey)
      .map((e) => ({ dateLabel: fmtDM(e.dateKey), symptom: e.symptom, sev: e.sev, since: e.since, note: e.note, hasPhoto: e.hasPhoto })),
  });

  const savePdf = () => {
    const doc = buildSummaryPdf(buildSummaryObject());
    doc.save('SANA-summary-' + tk + '.pdf');
  };

  const doShare = async () => {
    const summaryObj = buildSummaryObject();
    const doc = buildSummaryPdf(summaryObj);
    const result = await shareSummary(summaryObj, doc);
    if (result === 'copied') setToast('Summary copied to clipboard');
    else if (result === 'unsupported') setToast('Sharing isn’t supported on this device');
    if (result !== 'cancelled') setTimeout(() => setToast(''), 2600);
  };

  return (
    <div className="scr">
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 6px' }}>
        <div data-testid="summary-back" onClick={() => set({ screen: 'home' })} style={{ width: 40, height: 40, borderRadius: '50%', background: '#ebe4d5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <BackIcon />
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#26322e' }}>Create summary</span>
        <div style={{ width: 40 }} />
      </div>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 18px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384', margin: '0 2px 11px' }}>SUMMARISE WHICH PERIOD?</div>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {PERIODS.map((o) => (
            <Pill key={o} active={!state.summaryCustom && state.summaryPeriod === o} onClick={() => set({ summaryPeriod: o, summaryCustom: false })}>
              {o}
            </Pill>
          ))}
          <Pill active={state.summaryCustom} onClick={toggleCustom}>
            <CalendarIcon size={13} stroke={state.summaryCustom ? '#fbfdfb' : '#37433d'} strokeWidth="2" />
            Custom range
          </Pill>
        </div>

        {state.summaryCustom && (
          <div style={{ background: '#fbfdfb', border: '1px solid #e8e1d2', borderRadius: 18, padding: '12px 12px 10px', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div onClick={() => set({ sumCalOpen: true })} style={{ flex: 1, background: '#f6f1e8', borderRadius: 10, padding: '8px 12px', cursor: 'pointer' }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: '#9a9384' }}>FROM</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#26322e', marginTop: 1 }}>{sumDF ? fmtDMY(sumDF) : state.sumFrom ? fmtDMY(state.sumFrom) : 'Start date'}</div>
              </div>
              <ChevronRight size={16} stroke="#b3ab99" />
              <div onClick={() => set({ sumCalOpen: true })} style={{ flex: 1, background: '#f6f1e8', borderRadius: 10, padding: '8px 12px', cursor: 'pointer' }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: '#9a9384' }}>TO</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#26322e', marginTop: 1 }}>{sumDT ? fmtDMY(sumDT) : sumDF ? 'End date' : state.sumTo ? fmtDMY(state.sumTo) : 'End date'}</div>
              </div>
              <div onClick={() => set({ sumCalOpen: true })} style={{ width: 38, height: 38, borderRadius: 11, background: '#117468', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                <CalendarIcon size={18} stroke="#fbfdfb" />
              </div>
            </div>
            {state.sumCalOpen && (
              <div style={{ marginTop: 10, borderTop: '1px solid #eee6d7', paddingTop: 10 }}>
                <CalendarNavHeader
                  label={MOF[state.sumCalM] + ' ' + state.sumCalY}
                  onPrev={() => set((s) => (s.sumCalM === 0 ? { sumCalM: 11, sumCalY: s.sumCalY - 1 } : { sumCalM: s.sumCalM - 1 }))}
                  onNext={() => set((s) => (s.sumCalM === 11 ? { sumCalM: 0, sumCalY: s.sumCalY + 1 } : { sumCalM: s.sumCalM + 1 }))}
                />
                <MonthGrid
                  year={state.sumCalY}
                  month={state.sumCalM}
                  getDayMeta={(k) => ({ disabled: k > tk, selected: k === sumDF || k === sumDT, inRange: !!(sumDF && sumDT && k > sumDF && k < sumDT) })}
                  onPick={pickDay}
                />
                <div style={{ fontSize: 11.5, color: '#8a938e', margin: '8px 2px 0' }}>{draftHint}</div>
                <div style={{ display: 'flex', gap: 9, marginTop: 10 }}>
                  <button onClick={reset} style={{ flex: 1, border: '1.5px solid #c9c0ac', background: '#fdfbf6', color: '#37433d', fontSize: 13.5, fontWeight: 700, padding: 11, borderRadius: 100, cursor: 'pointer' }}>
                    Reset
                  </button>
                  <button
                    onClick={save}
                    style={{ flex: 1, border: 'none', color: '#fbfdfb', fontSize: 13.5, fontWeight: 700, padding: 11, borderRadius: 100, background: sumDF && sumDT ? '#117468' : '#bcd0ca', cursor: sumDF && sumDT ? 'pointer' : 'not-allowed' }}
                  >
                    Save range
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ background: '#fbfdfb', border: '1px solid #e8e1d2', borderRadius: 22, padding: '20px 19px', marginTop: 14, boxShadow: '0 20px 40px -28px rgba(20,40,36,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SparkIcon size={17} />
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.14em', color: '#9a9384' }}>PREPARED FOR {doctorUpper}</span>
          </div>
          <div className="serif" style={{ fontSize: 26, fontWeight: 500, color: '#26322e', marginTop: 10, lineHeight: 1.2 }}>
            {state.summaryCustom && sumSaved ? 'Custom range, summarised' : HEADINGS[state.summaryPeriod]}
          </div>
          <div style={{ fontSize: 13.5, color: '#8a938e', marginTop: 5 }}>{fmtDM(range.from) + ' – ' + fmtDMY(range.to) + ' · ' + sumSpan + ' days'}</div>

          <div style={{ background: '#f6f1e8', borderRadius: 14, padding: '13px 15px', marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#9a9384', marginBottom: 6 }}>PATIENT</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#26322e', lineHeight: 1.55 }}>{patientLine}</div>
            <div style={{ fontSize: 13.5, color: '#37433d', lineHeight: 1.55, marginTop: 2 }}>{treatLine}</div>
          </div>

          <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
            <div style={{ flex: 1, background: '#f6f1e8', borderRadius: 13, padding: '12px 8px', textAlign: 'center' }}>
              <div className="serif" style={{ fontSize: 23, color: '#26322e' }}>{sumList.length}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: '#9a9384', letterSpacing: '0.05em', marginTop: 2 }}>ENTRIES</div>
            </div>
            <div style={{ flex: 1, background: '#f6f1e8', borderRadius: 13, padding: '12px 8px', textAlign: 'center' }}>
              <div className="serif" style={{ fontSize: 23, color: '#26322e' }}>{sumSpan}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: '#9a9384', letterSpacing: '0.05em', marginTop: 2 }}>DAYS</div>
            </div>
            <div style={{ flex: 1, background: '#f6f1e8', borderRadius: 13, padding: '12px 8px', textAlign: 'center' }}>
              <div className="serif" style={{ fontSize: 23, color: '#26322e' }}>{sumSyms.length}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: '#9a9384', letterSpacing: '0.05em', marginTop: 2 }}>SYMPTOMS</div>
            </div>
          </div>

          <div style={{ height: 1, background: '#eee6d7', margin: '18px 0' }} />
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#9a9384' }}>TOP SYMPTOMS</div>
          {sumTop.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              {sumTop.map((t) => (
                <div key={t.name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color }} />
                      <span style={{ fontSize: 14.5, fontWeight: 700, color: '#26322e' }}>{t.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: t.trendColor }}>{t.trend}</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#8a938e' }}>{t.count}×</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 4, background: '#efe7d6', overflow: 'hidden' }}>
                    <div style={{ width: t.barPct + '%', height: '100%', background: t.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13.5, color: '#8a938e', marginTop: 12, lineHeight: 1.5 }}>No entries in this period yet — log symptoms to build your summary.</div>
          )}

          <div style={{ height: 1, background: '#eee6d7', margin: '18px 0' }} />
          <div style={{ background: '#eef4ef', border: '1px solid #d7e6dc', borderRadius: 14, padding: '14px 15px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#117468', marginBottom: 7 }}>WORTH ASKING ABOUT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {askItems.length ? (
                askItems.map((q, i) => (
                  <div key={i} style={{ fontSize: 13.5, color: '#37433d', lineHeight: 1.45 }}>
                    • {q}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 13.5, color: '#8a938e', lineHeight: 1.45 }}>Nothing flagged in this period.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 92, background: '#26322e', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 16px', borderRadius: 100, whiteSpace: 'nowrap', zIndex: 30 }}>
          {toast}
        </div>
      )}
      <div style={{ flexShrink: 0, background: '#f3efe4', padding: '12px 20px 12px', borderTop: '1px solid #e8e1d2', display: 'flex', gap: 10 }}>
        <button onClick={savePdf} style={{ flex: 1, border: '1.5px solid #c9c0ac', background: '#fdfbf6', color: '#37433d', fontSize: 15, fontWeight: 700, padding: 15, borderRadius: 100, cursor: 'pointer' }}>
          Save PDF
        </button>
        <button onClick={doShare} style={{ flex: 2, border: 'none', background: '#117468', color: '#fbfdfb', fontSize: 15, fontWeight: 700, padding: 15, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, cursor: 'pointer' }}>
          <ShareIcon />
          Share
        </button>
      </div>
    </div>
  );
}


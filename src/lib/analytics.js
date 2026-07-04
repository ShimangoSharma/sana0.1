import { diffDays, shiftKey } from './dateUtils';

const INSIGHT_PRESET_DAYS = { '4 weeks': 28, '6 weeks': 42, '3 months': 91 };
const SUMMARY_PRESET_DAYS = { 'Last week': 7, 'Last month': 30, 'Last 3 months': 91, '6 months': 182 };

export function presetRangeDays(kind, key) {
  const table = kind === 'insight' ? INSIGHT_PRESET_DAYS : SUMMARY_PRESET_DAYS;
  return table[key];
}

export function rangeFromPreset(todayK, days) {
  return { from: shiftKey(todayK, -(days - 1)), to: todayK };
}

// Aggregates entries within [from, to] by symptom name, splitting each
// symptom's count into "first half" vs "second half" of the range so we can
// tell whether it's trending up, down, or steady.
export function aggregateBySymptom(entries, fromKey, toKey) {
  const span = diffDays(fromKey, toKey) + 1;
  const inRange = entries.filter((e) => e.dateKey >= fromKey && e.dateKey <= toKey);
  const agg = {};
  inRange.forEach((e) => {
    const a = agg[e.symptom] || (agg[e.symptom] = { name: e.symptom, total: 0, first: 0, second: 0, color: e.color, buckets: [0, 0, 0, 0, 0, 0] });
    a.total++;
    const bucket = Math.min(5, Math.floor((diffDays(fromKey, e.dateKey) * 6) / span));
    a.buckets[bucket]++;
    if (diffDays(fromKey, e.dateKey) * 2 < span) a.first++;
    else a.second++;
  });
  return { list: Object.values(agg).sort((a, b) => b.total - a.total), inRange, span };
}

export function findRising(list) {
  const rising = list.filter((a) => a.second > a.first).sort((a, b) => b.second - b.first - (a.second - a.first))[0];
  return rising || null;
}

export function trendArrow(a) {
  return a.second > a.first ? '↑' : a.second < a.first ? '↓' : '→';
}

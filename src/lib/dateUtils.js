export const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MOF = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const DW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// A "key" is an integer YYYYMMDD used everywhere as a comparable/sortable date id.
export function keyOf(d) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function dateOf(k) {
  return new Date(Math.floor(k / 10000), (Math.floor(k / 100) % 100) - 1, k % 100);
}

export function todayKey() {
  return keyOf(new Date());
}

export function shiftKey(k, days) {
  const d = dateOf(k);
  d.setDate(d.getDate() + days);
  return keyOf(d);
}

export function diffDays(k1, k2) {
  return Math.round((dateOf(k2) - dateOf(k1)) / 86400000);
}

export function fmtDM(k) {
  const d = dateOf(k);
  return d.getDate() + ' ' + MO[d.getMonth()];
}

export function fmtDMY(k) {
  const d = dateOf(k);
  return d.getDate() + ' ' + MO[d.getMonth()] + ' ' + d.getFullYear();
}

export function fmtLong(k) {
  const d = dateOf(k);
  return DW[d.getDay()] + ', ' + d.getDate() + ' ' + MOF[d.getMonth()];
}

// Builds a 7-per-row grid of cells (Mon-start week) for the given month,
// padding leading/trailing blanks so the grid always has full weeks.
export function monthCells(y, m, make) {
  const cells = [];
  const lead = (new Date(y, m, 1).getDay() + 6) % 7;
  const n = new Date(y, m + 1, 0).getDate();
  const blank = (i) => ({ blank: true, key: 'b' + i, day: '', dots: [] });
  for (let i = 0; i < lead; i++) cells.push(blank(i));
  for (let d = 1; d <= n; d++) cells.push(make(y * 10000 + (m + 1) * 100 + d, d));
  while (cells.length % 7 !== 0) cells.push(blank(cells.length));
  return cells;
}

export function pad2(n) {
  return (n < 10 ? '0' : '') + n;
}

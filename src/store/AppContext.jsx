import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { todayKey, shiftKey } from '../lib/dateUtils';
import { DEFAULT_TREATMENTS } from '../lib/symptoms';

const STORAGE_KEY = 'sana_state_v1';

function freshState() {
  const tk = todayKey();
  const d = new Date();
  const treatments = {};
  DEFAULT_TREATMENTS.forEach((t) => (treatments[t] = false));
  return {
    onboarded: false,
    screen: 'splash',

    firstName: '',
    lastName: '',
    sex: '',
    ageRange: '',
    treatments,

    customSymptoms: [],
    knownDoctors: [],

    entries: [],
    nextEntryId: 1,
    selectedEntryId: null,

    selectedKey: tk,
    calY: d.getFullYear(),
    calM: d.getMonth(),

    logSymptoms: [],
    symptomQuery: '',
    severity: 'Moderate',
    since: 'Today',
    note: '',
    hasPhoto: false,
    photoData: null,
    logDateKey: tk,
    logEditingId: null,
    sinceCalOpen: false,
    sinceCalY: d.getFullYear(),
    sinceCalM: d.getMonth(),

    insightRange: '6 weeks',
    insightCustom: false,
    insFrom: null,
    insTo: null,
    insDraftFrom: null,
    insDraftTo: null,
    insCalOpen: false,
    insCalY: d.getFullYear(),
    insCalM: d.getMonth(),

    summaryPeriod: 'Last month',
    summaryCustom: false,
    sumFrom: null,
    sumTo: null,
    sumDraftFrom: null,
    sumDraftTo: null,
    sumCalOpen: false,
    sumCalY: d.getFullYear(),
    sumCalM: d.getMonth(),

    appts: [],
    nextApptId: 1,
    apptId: null,
    apptType: 'Consultation',
    apptTitle: '',
    editDoctor: '',
    doctorQuery: '',
    apptDateKey: null,
    apptHour: 10,
    apptMin: 0,
    apptAmpm: 'AM',
    remind: true,
    prep: true,
    apptCalOpen: false,
    apptTimeOpen: false,
    apptCalY: d.getFullYear(),
    apptCalM: d.getMonth(),

    confirm: null,
    showLogout: false,

    settings: { dailyReminder: true },
    notifiedApptIds: [],
    lastDailyReminderKey: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const saved = JSON.parse(raw);
    const base = freshState();
    // Always resume on a screen that makes sense for a fresh app open,
    // never mid-modal or mid-flow from a previous session.
    const resumeScreen = saved.onboarded ? 'splash' : 'splash';
    return { ...base, ...saved, screen: resumeScreen, confirm: null, showLogout: false };
  } catch {
    return freshState();
  }
}

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage can fail (quota, private mode) — the session still works in-memory
    }
  }, [state]);

  // Refresh date-dependent defaults on load in case localStorage was written
  // on a previous calendar day (today's key, current month view, etc).
  useEffect(() => {
    const tk = todayKey();
    const d = new Date();
    setState((s) => ({
      ...s,
      selectedKey: s.screen === 'splash' ? tk : s.selectedKey,
      calY: d.getFullYear(),
      calM: d.getMonth(),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (partial) => setState((s) => ({ ...s, ...(typeof partial === 'function' ? partial(s) : partial) }));

  const value = useMemo(() => ({ state, set }), [state]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { shiftKey };

import { useEffect } from 'react';
import { todayKey, shiftKey, diffDays } from '../lib/dateUtils';
import { notify, notificationPermission } from '../lib/notifications';

const REMIND_DAYS_BEFORE = 2;
const DAILY_REMINDER_HOUR = 19; // 7pm local time

// Best-effort local reminders: appointment "N days before" nudges and an
// evening check-in if nothing has been logged today. No backend/push server —
// this only fires while the app (or its service worker) is alive on-device.
export function useReminders(state, set) {
  useEffect(() => {
    const check = () => {
      if (notificationPermission() !== 'granted') return;
      const tk = todayKey();
      const notified = state.notifiedApptIds || [];
      const toAdd = [];

      state.appts.forEach((a) => {
        if (!a.remind) return;
        const remindOn = shiftKey(a.dateKey, -REMIND_DAYS_BEFORE);
        const tag = a.id + ':' + a.dateKey;
        if (tk >= remindOn && tk <= a.dateKey && !notified.includes(tag)) {
          const days = diffDays(tk, a.dateKey);
          const when = days <= 0 ? 'today' : days === 1 ? 'tomorrow' : 'in ' + days + ' days';
          notify('Upcoming visit ' + when, {
            body: a.title + (a.doctor ? ' with ' + a.doctor : ''),
            tag: 'sana-appt-' + a.id,
            icon: 'icon-192.png',
          });
          toAdd.push(tag);
        }
      });

      const hasToday = state.entries.some((e) => e.dateKey === tk);
      const alreadyToday = state.lastDailyReminderKey === tk;
      if (state.settings.dailyReminder && !hasToday && !alreadyToday && new Date().getHours() >= DAILY_REMINDER_HOUR) {
        notify('How are you feeling today?', {
          body: "You haven't logged anything today — it only takes 30 seconds.",
          tag: 'sana-daily',
          icon: 'icon-192.png',
        });
        set({ lastDailyReminderKey: tk });
      }

      if (toAdd.length) set({ notifiedApptIds: notified.concat(toAdd) });
    };

    check();
    const id = setInterval(check, 60000);
    const onVisible = () => document.visibilityState === 'visible' && check();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.appts, state.entries, state.settings.dailyReminder, state.notifiedApptIds, state.lastDailyReminderKey]);
}

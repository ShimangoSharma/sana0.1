export const notificationsSupported = typeof window !== 'undefined' && 'Notification' in window;

export function notificationPermission() {
  return notificationsSupported ? Notification.permission : 'unsupported';
}

export async function requestNotificationPermission() {
  if (!notificationsSupported) return 'unsupported';
  if (Notification.permission === 'default') return Notification.requestPermission();
  return Notification.permission;
}

// Shows a local notification via the active service worker when available
// (works even if the tab is backgrounded), falling back to a plain Notification.
export async function notify(title, options) {
  if (!notificationsSupported || Notification.permission !== 'granted') return;
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        reg.showNotification(title, options);
        return;
      }
    }
  } catch {
    // fall through to plain Notification
  }
  try {
    new Notification(title, options);
  } catch {
    // notifications can be unavailable in some contexts (e.g. iOS Safari non-PWA) — ignore
  }
}

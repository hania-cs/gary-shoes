import { useEffect, useRef } from "react";
import {
  isAdminLoggedIn,
  touchAdminActivity,
  adminLogout,
  INACTIVITY_LIMIT_MS,
} from "@/lib/adminAuth";

/**
 * Tracks user activity and auto-logs-out the admin after 30 minutes idle.
 * Calls onLogout when the session expires (so the host page can re-render the login screen).
 */
export function useAdminSessionTimeout(onLogout: () => void) {
  const lastTouchRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isAdminLoggedIn()) return;

    // Throttle activity writes to once every 30s
    const onActivity = () => {
      const now = Date.now();
      if (now - lastTouchRef.current > 30_000) {
        lastTouchRef.current = now;
        touchAdminActivity();
      }
    };

    const events: (keyof DocumentEventMap)[] = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((evt) => document.addEventListener(evt, onActivity, { passive: true }));

    // Periodic check
    const interval = window.setInterval(() => {
      if (!isAdminLoggedIn()) {
        onLogout();
      }
    }, 60_000);

    // Re-check when the tab regains focus
    const onFocus = () => {
      if (!isAdminLoggedIn()) {
        adminLogout();
        onLogout();
      }
    };
    window.addEventListener("focus", onFocus);

    return () => {
      events.forEach((evt) => document.removeEventListener(evt, onActivity));
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [onLogout]);

  // Expose limit so consumers can show a message if they want
  return { inactivityLimitMs: INACTIVITY_LIMIT_MS };
}

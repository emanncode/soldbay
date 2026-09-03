/**
 * Handoff PIN validity window.
 *
 * Distinct from the failed-attempt lockout. This is the length of time a PIN
 * stays valid after the seller explicitly reveals it ("Show Code"). Adjusting
 * this single constant changes the expiry window app-wide.
 */
export const PIN_SHOWN_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

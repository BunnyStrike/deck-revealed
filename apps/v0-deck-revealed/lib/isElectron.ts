/**
 * Checks if the application is running in Electron
 * This function is safe to use both on client and server side
 */
export function isElectron(): boolean {
  if (typeof window !== 'undefined' && typeof window.process === 'object') {
    return true;
  }

  if (
    typeof window !== 'undefined' &&
    typeof window.navigator === 'object' &&
    /electron/i.test(window.navigator.userAgent)
  ) {
    return true;
  }

  if (typeof window !== 'undefined' && 'electron' in window) {
    return true;
  }

  return false;
} 
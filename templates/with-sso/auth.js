import { ipcMain } from 'electron';

/**
 * Placeholder authentication handler used by the SSO template.
 *
 * This file intentionally contains **no real authentication logic** so that
 * applications do not ship with insecure default credentials.
 * Replace this entire file with your organisation's SSO/AD integration before
 * distributing your app.
 */
ipcMain.handle('auth-login', async () => {
  console.warn(
    '[SSO] Placeholder auth handler invoked. Replace templates/with-sso/auth.js with real integration.'
  );

  // Always fail to enforce replacing this placeholder implementation.
  return {
    success: false,
    error:
      'Authentication placeholder - replace templates/with-sso/auth.js with real SSO integration.'
  };
});

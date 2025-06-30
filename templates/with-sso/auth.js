import { ipcMain } from 'electron';

ipcMain.handle('auth-login', async (event, credentials) => {
  if (!credentials || !credentials.username || !credentials.password) {
    return { success: false, error: 'Missing credentials' };
  }

  // TODO: Replace with real AD/SSO integration
  if (credentials.username === 'admin' && credentials.password === 'password') {
    return { success: true, user: { username: credentials.username, roles: ['admin'] } };
  }
  return { success: false, error: 'Invalid username or password' };
});

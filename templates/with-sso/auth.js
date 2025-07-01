import { ipcMain, BrowserWindow, session } from 'electron';

const {
  SSO_AUTH_URL,
  SSO_TOKEN_URL,
  SSO_CLIENT_ID,
  SSO_CLIENT_SECRET,
  SSO_REDIRECT_URI = 'http://localhost:4280/callback'
} = process.env;

function isConfigured() {
  return (
    SSO_AUTH_URL &&
    SSO_TOKEN_URL &&
    SSO_CLIENT_ID &&
    SSO_CLIENT_SECRET
  );
}

function buildAuthUrl() {
  const url = new URL(SSO_AUTH_URL);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', SSO_CLIENT_ID);
  url.searchParams.set('redirect_uri', SSO_REDIRECT_URI);
  return url.toString();
}

async function exchangeCodeForToken(code) {
  const res = await fetch(SSO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: SSO_CLIENT_ID,
      client_secret: SSO_CLIENT_SECRET,
      redirect_uri: SSO_REDIRECT_URI
    })
  });
  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status}`);
  }
  return res.json();
}

ipcMain.handle('auth-login', async () => {
  if (!isConfigured()) {
    return { success: false, error: 'SSO environment variables not configured' };
  }

  return new Promise((resolve) => {
    const win = new BrowserWindow({
      width: 500,
      height: 650,
      webPreferences: { nodeIntegration: false }
    });
    win.loadURL(buildAuthUrl());

    const filter = { urls: [`${SSO_REDIRECT_URI}*`] };
    const handler = async (details) => {
      const url = new URL(details.url);
      const code = url.searchParams.get('code');
      if (code) {
        session.defaultSession.webRequest.onBeforeRequest(filter, null);
        win.destroy();
        try {
          const token = await exchangeCodeForToken(code);
          resolve({ success: true, token });
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      }
    };
    session.defaultSession.webRequest.onBeforeRequest(filter, handler);
  });
});

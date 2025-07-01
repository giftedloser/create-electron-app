import React, { useEffect, useState } from 'react';
import WindowControls from './components/WindowControls';

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    window.api?.getDarkMode?.().then((dark: boolean) => setIsDark(dark));
    window.api?.on('darkmode-updated', (dark: boolean) => {
      setIsDark(dark);
    });
  }, []);
  return (
    <>
      <WindowControls />
      <div style={{ padding: 20 }}>
        <h1>Hello from Electron + React + Vite!</h1>
        <p>Your app is running.</p>
        <p>Current theme: {isDark ? 'dark' : 'light'}</p>
      </div>
    </>
  );
}

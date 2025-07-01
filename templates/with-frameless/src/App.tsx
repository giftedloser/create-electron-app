import React, { useEffect } from 'react';
import WindowControls from './components/WindowControls';

export default function App() {
  useEffect(() => {
    window.api?.on('darkmode-updated', (isDark: boolean) => {
      console.log('dark mode changed', isDark);
    });
  }, []);
  return (
    <>
      <WindowControls />
      <div style={{ padding: 20 }}>
        <h1>Hello from Electron + React + Vite!</h1>
        <p>Your app is running.</p>
      </div>
    </>
  );
}

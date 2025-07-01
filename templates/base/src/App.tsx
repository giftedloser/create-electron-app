import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    window.api?.on('darkmode-updated', (isDark: boolean) => {
      console.log('dark mode changed', isDark);
    });
  }, []);
  return (
    <div style={{ padding: 20 }}>
      <h1>Hello from Electron + React + Vite!</h1>
      <p>Your app is running.</p>
    </div>
  );
}

import React from 'react';
import WindowControls from './components/WindowControls';

export default function App() {
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

import React from 'react';
import MapView from './components/MapView';
import './App.css';

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">RF Link Planner</h1>
        </div>
      </header>

      <main className="app-main">
        <MapView />
      </main>
    </div>
  );
}
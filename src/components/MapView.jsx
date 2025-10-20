import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import TowerMarker from './TowerMarker';
import LinkLine from './LinkLine';
import FresnelZone from './FresnelZone';

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const orig = e.originalEvent;
      // ignore clicks coming from popups / controls / marker icons
      if (orig && orig.target && orig.target.closest) {
        if (orig.target.closest('.leaflet-popup') || orig.target.closest('.leaflet-control') || orig.target.closest('.leaflet-marker-icon')) {
          return;
        }
      }
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const MapView = () => {
  const [towers, setTowers] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedTower, setSelectedTower] = useState(null);
  const [selectedLinkId, setSelectedLinkId] = useState(null);

  // Debug logs
  useEffect(() => { console.log('TOWERS', towers); }, [towers]);
  useEffect(() => { console.log('LINKS', links); }, [links]);

  const addTower = (position) => {
    // ensure position is [lat, lng] numeric array
    const pos = [Number(position[0]), Number(position[1])];
    const newTower = { id: Date.now(), position: pos, frequency: 5.0 };
    setTowers(s => [...s, newTower]);
  };

  const onTowerSelect = (tower) => {
    if (!selectedTower) {
      setSelectedTower(tower);
      return;
    }
    // toggle off if same tower clicked
    if (selectedTower.id === tower.id) {
      setSelectedTower(null);
      return;
    }
    // frequency check
    if (selectedTower.frequency !== tower.frequency) {
      alert('Cannot link towers with different frequencies');
      setSelectedTower(null);
      return;
    }
    // Use current towers from state to avoid stale objects
    const t1 = towers.find(t => t.id === selectedTower.id) || selectedTower;
    const t2 = towers.find(t => t.id === tower.id) || tower;

    // avoid duplicates both directions
    const idA = `${t1.id}-${t2.id}`;
    const idB = `${t2.id}-${t1.id}`;
    if (links.some(l => l.id === idA || l.id === idB)) {
      setSelectedTower(null);
      return;
    }

    const newLink = { id: idA, tower1: t1, tower2: t2, frequency: t1.frequency };
    setLinks(s => [...s, newLink]);
    setSelectedTower(null);
  };

  const onFrequencyChange = (towerId, freq) => {
    setTowers(s => s.map(t => (t.id === towerId ? { ...t, frequency: freq } : t)));
    // remove any links involving changed tower (simple policy)
    setLinks(s => s.filter(l => l.tower1.id !== towerId && l.tower2.id !== towerId));
  };

  const onDeleteTower = (towerId) => {
    setTowers(s => s.filter(t => t.id !== towerId));
    setLinks(s => s.filter(l => l.tower1.id !== towerId && l.tower2.id !== towerId));
  };

  const onLinkClick = (link) => {
    setSelectedLinkId(prev => (prev === link.id ? null : link.id));
  };

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents onMapClick={addTower} />

      {links.map(link => (
        <React.Fragment key={link.id}>
          <LinkLine link={link} isSelected={selectedLinkId === link.id} onClick={() => onLinkClick(link)} />
          {selectedLinkId === link.id && <FresnelZone link={link} />}
        </React.Fragment>
      ))}

      {towers.map(t => (
        <TowerMarker
          key={t.id}
          tower={t}
          onSelect={onTowerSelect}
          onFrequencyChange={onFrequencyChange}
          onDelete={onDeleteTower}
          isSelected={selectedTower?.id === t.id}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
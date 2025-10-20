import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// default icon (same as before)
const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// icon cache to avoid recreating L.Icon on each render
const iconCache = new Map();

function createIconForTower(tower) {
  if (tower.iconUrl) {
    if (!iconCache.has(tower.iconUrl)) {
      iconCache.set(
        tower.iconUrl,
        new L.Icon({
          iconUrl: tower.iconUrl,
          iconSize: tower.iconSize || [28, 42],
          iconAnchor: tower.iconAnchor || [14, 42],
          popupAnchor: tower.popupAnchor || [0, -36],
        })
      );
    }
    return iconCache.get(tower.iconUrl);
  }

  if (tower.emoji) {
    // simple DivIcon with emoji or SVG string
    const html = `<div style="font-size:22px; line-height:22px; transform: translateY(-2px)">${tower.emoji}</div>`;
    const key = `emoji:${tower.emoji}`;
    if (!iconCache.has(key)) {
      iconCache.set(
        key,
        L.divIcon({
          html,
          className: 'custom-emoji-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -28],
        })
      );
    }
    return iconCache.get(key);
  }

  // fallback
  return defaultIcon;
}

const TowerMarker = ({ tower, onSelect, onFrequencyChange, onDelete, isSelected }) => {
  const stop = (e) => {
    try { e.preventDefault?.(); } catch {}
    try { e.stopPropagation?.(); } catch {}
    if (e.nativeEvent && typeof e.nativeEvent.stopPropagation === 'function') {
      try { e.nativeEvent.stopPropagation(); } catch {}
    }
  };

  const handleDelete = (e) => {
    stop(e);
    onDelete(tower.id);
  };

  const handleFreqChange = (e) => {
    stop(e);
    const val = parseFloat(e.target.value || 0);
    onFrequencyChange(tower.id, val);
  };

  const icon = createIconForTower(tower);

  return (
    <Marker
      position={tower.position}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(tower),
      }}
    >
      <Popup>
        <div onClick={stop} style={{ width: 220 }}>
          <div><strong>ID:</strong> {tower.id}</div>

          <div style={{ marginTop: 8 }}>
            <label>
              Frequency (GHz):
              <input
                type="number"
                value={tower.frequency}
                onClick={stop}
                onChange={handleFreqChange}
                min="0.1"
                step="0.1"
                style={{ width: 80, marginLeft: 8 }}
              />
            </label>
          </div>

          <div style={{ marginTop: 8 }}>
            <button onClick={handleDelete}>Delete Tower</button>
            {isSelected && <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Selected</span>}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default TowerMarker;
import React from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';

const asLatLngArray = (p) => {
  if (!p) return null;
  if (Array.isArray(p) && p.length >= 2) return [Number(p[0]), Number(p[1])];
  if (typeof p === 'object' && p.lat != null && p.lng != null) return [Number(p.lat), Number(p.lng)];
  if (typeof p === 'object' && p[0] != null && p[1] != null) return [Number(p[0]), Number(p[1])];
  return null;
};

const distanceMeters = (a, b) => L.latLng(a).distanceTo(L.latLng(b));

const LinkLine = ({ link, isSelected = false, onClick = () => {} }) => {
  if (!link || !link.tower1 || !link.tower2) return null;

  const p1 = asLatLngArray(link.tower1.position);
  const p2 = asLatLngArray(link.tower2.position);
  if (!p1 || !p2) return null;

  const positions = [p1, p2];
  const dist = Math.round(distanceMeters(p1, p2));

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: isSelected ? '#ff6600' : '#3388ff',
        weight: isSelected ? 5 : 4,
        opacity: 0.95,
        dashArray: isSelected ? null : '6 4'
      }}
      eventHandlers={{
        click: (e) => {
          // Prevent the map from receiving this click (stops new-tower creation)
          if (e && e.originalEvent && typeof e.originalEvent.stopPropagation === 'function') {
            e.originalEvent.stopPropagation();
            e.originalEvent.preventDefault?.();
          }
          onClick(link);
        }
      }}
    >
      <Tooltip direction="center">
        {`${link.frequency ?? 'N/A'} GHz • ${dist} m`}
      </Tooltip>
    </Polyline>
  );
};

export default LinkLine;
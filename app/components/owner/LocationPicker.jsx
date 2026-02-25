'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in Next.js
const fixLeafletIcons = () => {
  if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }
};

function MapEvents({ onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export default function LocationPicker({ lat, lng, onChange }) {
  const [isReady, setIsReady] = useState(false);
  const [mapId] = useState(() => `map-${Date.now()}-${Math.random()}`);
  const containerRef = useRef(null);

  useEffect(() => {
    fixLeafletIcons();
    // Wait a tick for the DOM container to be fully mounted
    const timer = requestAnimationFrame(() => {
      if (containerRef.current) {
        setIsReady(true);
      }
    });
    return () => {
      cancelAnimationFrame(timer);
      setIsReady(false);
    };
  }, []);

  // Parse coords safely
  const pLat = parseFloat(lat) || 11.5564;
  const pLng = parseFloat(lng) || 104.9282;
  const position = [pLat, pLng];

  return (
    <div className="h-full w-full relative" ref={containerRef}>
      {!isReady ? (
        <div className="h-full w-full bg-slate-50 animate-pulse flex items-center justify-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initialising Map Engine...</span>
        </div>
      ) : (
        <div key={mapId} style={{ height: '100%', width: '100%' }}>
          <MapContainer 
            center={position} 
            zoom={13} 
            style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={position} />
            <MapEvents onChange={onChange} />
            {lat && lng && <Marker position={position} />}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
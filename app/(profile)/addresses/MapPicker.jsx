"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons for Next.js
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  });
}

function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) { onLocationSelect([e.latlng.lat, e.latlng.lng]); },
  });
  return null;
}

export default function MapPicker({ position, onLocationSelect }) {
  return (
    <MapContainer center={position} zoom={15} className="h-full w-full z-0" zoomControl={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      <ClickHandler onLocationSelect={onLocationSelect} />
      <Marker position={position} />
    </MapContainer>
  );
}
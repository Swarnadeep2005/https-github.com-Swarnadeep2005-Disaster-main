"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function LocationMarker({ setCoordinates }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCoordinates(e.latlng);
    },
  });

  return position ? <Marker position={position}></Marker> : null;
}

export default function LocationMap({ setCoordinates }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={4}
      className="h-[400px] w-full rounded-xl"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker setCoordinates={setCoordinates} />
    </MapContainer>
  );
}

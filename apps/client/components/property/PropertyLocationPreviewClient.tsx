"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";

type PropertyLocationPreviewClientProps = {
  latitude: number;
  longitude: number;
};

type MapCenterProps = {
  latitude: number;
  longitude: number;
};

function MapCenter({ latitude, longitude }: MapCenterProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([latitude, longitude], 16, {
      duration: 1,
    });
  }, [map, latitude, longitude]);

  return null;
}

export default function PropertyLocationPreviewClient({
  latitude,
  longitude,
}: PropertyLocationPreviewClientProps) {
  return (
    <div className="relative z-0 h-[280px] w-full overflow-hidden rounded-xl border border-border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        className="h-full w-full"
      >
        <MapCenter latitude={latitude} longitude={longitude} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={[latitude, longitude]}
          radius={10}
          pathOptions={{
            color: "#ffffff",
            weight: 3,
            fillColor: "#145c6b",
            fillOpacity: 1,
          }}
        />
      </MapContainer>
    </div>
  );
}

"use client";

import { MapContainer, TileLayer } from "react-leaflet";

import PropertyMarker from "./PropertyMarker";

import "leaflet/dist/leaflet.css";

type Property = {
  _id: string;
  title: string;
  price: number;
  currency: "UAH" | "USD";
  location: string;
  latitude: number;
  longitude: number;
};

type PropertyMapClientProps = {
  properties: Property[];
};

export default function PropertyMapClient({
  properties,
}: PropertyMapClientProps) {
  const validProperties = properties
    .map((property) => ({
      ...property,
      latitude: Number(property.latitude),
      longitude: Number(property.longitude),
    }))
    .filter(
      (property) =>
        Number.isFinite(property.latitude) &&
        Number.isFinite(property.longitude),
    );

  return (
    <div className="relative z-0 mx-auto m-6 h-[450px] w-full max-w-6xl overflow-hidden rounded-2xl border border-border">
      <MapContainer
        center={[49.42298, 26.98713]}
        zoom={13}
        doubleClickZoom={false}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validProperties.map((property) => (
          <PropertyMarker
            key={property._id}
            id={property._id}
            title={property.title}
            price={property.price}
            currency={property.currency}
            location={property.location}
            latitude={property.latitude}
            longitude={property.longitude}
          />
        ))}
      </MapContainer>
    </div>
  );
}

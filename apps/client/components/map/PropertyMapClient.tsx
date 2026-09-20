"use client";

import { useMemo, useState } from "react";

import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import PropertyMarker from "./PropertyMarker";
import MapSearch from "./MapSearch";

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
  const [isMapLoading, setIsMapLoading] = useState(true);

  const [mapError, setMapError] = useState(false);

  const validProperties = useMemo(() => {
    return properties
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
  }, [properties]);

  return (
    <div className="relative z-0 mx-auto m-6 h-[450px] w-full max-w-6xl overflow-hidden rounded-2xl border border-border">
      {mapError && (
        <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="font-serif text-2xl text-primary">
              Unable to load map
            </p>

            <p className="mt-2 text-sm text-secondary">
              Please try refreshing the page.
            </p>
          </div>
        </div>
      )}

      {isMapLoading && !mapError && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-gray-100">
          <p className="text-sm text-secondary">Loading map...</p>
        </div>
      )}

      <MapContainer
        center={[49.42298, 26.98713]}
        zoom={13}
        scrollWheelZoom
        doubleClickZoom={false}
        zoomControl={false}
        className="h-full w-full"
      >
        <MapSearch />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            load: () => {
              setIsMapLoading(false);
              setMapError(false);
            },

            tileerror: () => {
              setIsMapLoading(false);
              setMapError(true);
            },
          }}
        />

        <ZoomControl position="bottomleft" />

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

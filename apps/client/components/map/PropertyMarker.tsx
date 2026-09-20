"use client";

import { useRouter } from "next/navigation";
import type { LeafletMouseEvent } from "leaflet";
import { CircleMarker, Popup } from "react-leaflet";
import { memo } from "react";

type PropertyMarkerProps = {
  id: string;
  title: string;
  price: number;
  currency: "UAH" | "USD";
  location: string;
  latitude: number;
  longitude: number;
};

function PropertyMarker({
  id,
  title,
  price,
  currency,
  location,
  latitude,
  longitude,
}: PropertyMarkerProps) {
  const router = useRouter();

  const openProperty = () => {
    router.push(`/property/view/${id}`);
  };

  const handleClick = (event: LeafletMouseEvent) => {
    const originalEvent = event.originalEvent;

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
      return;
    }

    originalEvent.preventDefault();
    originalEvent.stopPropagation();

    openProperty();
  };

  const handleDoubleClick = (event: LeafletMouseEvent) => {
    const originalEvent = event.originalEvent;

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      return;
    }

    originalEvent.preventDefault();
    originalEvent.stopPropagation();

    window.setTimeout(() => {
      openProperty();
    }, 50);
  };

  return (
    <CircleMarker
      center={[latitude, longitude]}
      radius={12}
      pathOptions={{
        color: "#ffffff",
        weight: 3,
        fillColor: "#145c6b",
        fillOpacity: 1,
      }}
      eventHandlers={{
        click: handleClick,
        dblclick: handleDoubleClick,
      }}
    >
      <Popup>
        <div className="min-w-[180px]">
          <h3 className="font-semibold">{title}</h3>

          <p className="mt-1">
            {Number(price).toLocaleString()} {currency}
          </p>

          <p className="mt-1 text-sm text-gray-500">{location}</p>
        </div>
      </Popup>
    </CircleMarker>
  );
}

export default memo(PropertyMarker);

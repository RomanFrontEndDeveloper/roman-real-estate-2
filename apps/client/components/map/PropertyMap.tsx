"use client";

import dynamic from "next/dynamic";

type Property = {
  _id: string;
  title: string;
  price: number;
  currency: "UAH" | "USD";
  location: string;
  latitude: number;
  longitude: number;
};

type PropertyMapProps = {
  properties: Property[];
};

const PropertyMapClient = dynamic(
  () => import("./PropertyMapClient"),
  {
    ssr: false,

    loading: () => (
      <div className="relative z-0 mx-auto m-6 flex h-[450px] w-full max-w-6xl items-center justify-center overflow-hidden rounded-2xl border border-border bg-gray-100">
        <p className="text-2xl text-secondary">
          Loading map...
        </p>
      </div>
    ),
  },
);

export default function PropertyMap({
  properties,
}: PropertyMapProps) {
  return (
    <PropertyMapClient
      properties={properties}
    />
  );
}
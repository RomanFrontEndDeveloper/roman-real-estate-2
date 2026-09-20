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

const PropertyMapClient = dynamic(() => import("./PropertyMapClient"), {
  ssr: false,
});

export default function PropertyMap({ properties }: PropertyMapProps) {
  return <PropertyMapClient properties={properties} />;
}

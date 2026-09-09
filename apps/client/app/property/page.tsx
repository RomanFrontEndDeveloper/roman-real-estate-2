"use client";

import PropertyCard from "@/components/property/PropertyCard";
import { useEffect, useState } from "react";

type Property = {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: "UAH" | "USD";
  listingType: "sale" | "rent";
  location: string;
  propertyType: string;
  bedrooms: number;
  kitchenArea: number;
  area: number;
};

export default function PropertyPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/properties");

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load properties.");
          return;
        }

        setProperties(data.data);
      } catch {
        setMessage("Unable to connect to the server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-serif text-2xl text-secondary">
          Loading properties...
        </p>
      </div>
    );
  }

  if (message) {
    return <p className="font-serif text-2xl text-secondary">{message}</p>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16">
      <h1 className="my-14 text-center font-serif text-4xl">Properties</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            title={property.title}
            description={property.description}
            price={property.price}
            currency={property.currency}
            location={property.location}
            propertyType={property.propertyType}
            listingType={property.listingType}
            bedrooms={property.bedrooms}
            area={property.area}
          />
        ))}
      </div>
    </main>
  );
}

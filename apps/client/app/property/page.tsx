"use client";

import PropertyCard from "@/components/property/PropertyCard";
import { getFavorites } from "@/components/favorites/favoriteApi";

import { useEffect, useState } from "react";

import Link from "next/link";
import { Heart } from "lucide-react";
import Button from "@/components/ui/Button";

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
  mainImage: string;
  images: string[];
};

export default function PropertyPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");

        if (!token) {
          setMessage("Authentication required.");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/properties/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load properties.");
          return;
        }

        setProperties(data.data);

        const favoritesData = await getFavorites();

        const ids = favoritesData.favorites.map(
          (favorite: { property: string }) => favorite.property,
        );

        setFavoriteIds(ids);
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
      <div className="mt-25 flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-center font-serif text-xl text-secondary sm:text-2xl">
          Loading properties...
        </p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-center font-serif text-xl text-secondary sm:text-2xl">
          {message}
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
      <h1 className="my-8 text-center font-serif text-3xl sm:my-12 sm:text-4xl lg:my-14">
        My Properties
      </h1>
      <div className="mb-6 flex justify-end">
        <Link href="/favorites">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            My Favorites
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="flex min-h-[30vh] items-center justify-center px-4">
          <p className="text-center text-2xl text-secondary">
            You have no properties yet.
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              id={property._id}
              title={property.title}
              description={property.description}
              price={property.price}
              currency={property.currency}
              location={property.location}
              propertyType={property.propertyType}
              listingType={property.listingType}
              bedrooms={property.bedrooms}
              area={property.area}
              mainImage={property.mainImage}
              images={property.images}
              isFavorite={favoriteIds.includes(property._id)}
              onFavoriteChange={(isFavorite) => {
                setFavoriteIds((currentIds) => {
                  if (isFavorite) {
                    return [...currentIds, property._id];
                  }

                  return currentIds.filter((id) => id !== property._id);
                });
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}

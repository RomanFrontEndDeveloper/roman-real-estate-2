"use client";

import { useEffect, useState } from "react";

import PropertyCard from "@/components/property/PropertyCard";
import { getFavoriteProperties } from "@/components/favorites/favoriteApi";

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
  area: number;
  mainImage: string;
  images: string[];
};

type Favorite = {
  _id: string;
  user: string;
  property: Property;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");

        if (!token) {
          setMessage("Authentication required.");
          return;
        }

        const data = await getFavoriteProperties();

        setFavorites(data.favorites);
      } catch {
        setMessage("Unable to load favorites. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-25 flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-center font-serif text-xl text-secondary sm:text-2xl my-40">
          Loading favorites...
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
        Favorites
      </h1>
       <div className="mb-6 flex justify-end">
        <Link href="/property">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            My All Properties
          </Button>
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="flex min-h-[30vh] items-center justify-center px-4">
          <p className="text-center text-2xl text-secondary mb-30">
            You have no favorite properties yet.
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => {
            const property = favorite.property;

            return (
              <PropertyCard
                key={favorite._id}
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
                isFavorite={true}
                onFavoriteChange={(isFavorite) => {
                  if (!isFavorite) {
                    setFavorites((currentFavorites) =>
                      currentFavorites.filter(
                        (item) => item.property._id !== property._id,
                      ),
                    );
                  }
                }}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

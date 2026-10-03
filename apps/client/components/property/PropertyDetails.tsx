"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyFeatures from "@/components/property/PropertyFeatures";
import DeletePropertyButton from "@/components/property/DeletePropertyButton";

import BackButton from "../ui/BackButton";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../favorites/favoriteApi";

type PropertyOwner = {
  _id: string;
  name: string;
  phone?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
};

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
  owner?: PropertyOwner;
};

type PropertyDetailsProps = {
  property: Property;
  showActions?: boolean;
  showOwner?: boolean;
};

export default function PropertyDetails({
  property,
  showActions = false,
  showOwner = false,
}: PropertyDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  useEffect(() => {
    if (!showActions) {
      return;
    }

    const checkFavorite = async () => {
      try {
        setIsFavoriteLoading(true);

        const favoritesData = await getFavorites();

        const favoriteExists = favoritesData.favorites.some(
          (favorite: { property: string }) =>
            favorite.property === property._id,
        );

        setIsFavorite(favoriteExists);
      } catch (error) {
        console.error("Failed to check favorite:", error);
      } finally {
        setIsFavoriteLoading(false);
      }
    };

    checkFavorite();
  }, [property._id, showActions]);

  const handleFavorite = async () => {
    if (isFavoriteLoading) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      if (isFavorite) {
        await removeFavorite(property._id);
        setIsFavorite(false);
      } else {
        await addFavorite(property._id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Favorite error:", error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <main className="mx-4 my-6 w-auto max-w-7xl rounded-2xl border border-border bg-white p-5 shadow-lg sm:mx-6 sm:my-8 sm:p-8 lg:mx-auto lg:my-10 lg:p-10">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Property Details
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-serif text-3xl sm:text-4xl">Property</h1>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* User actions */}
            {showActions && (
              <>
                {/* Favorite */}
                <Button
                  type="button"
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 sm:w-auto"
                  onClick={handleFavorite}
                  disabled={isFavoriteLoading}
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                  />

                  {isFavorite ? "Remove Favorite" : "Add to Favorites"}
                </Button>

                {/* Edit */}
                <Link
                  href={`/property/${property._id}/edit`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                </Link>

                {/* All Properties */}
                <Link href="/property" className="w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    All Property
                  </Button>
                </Link>

                {/* Delete */}
                <DeletePropertyButton propertyId={property._id} />
              </>
            )}

            {/* Back — always visible */}
            <div className="w-full sm:w-auto">
              <BackButton />
            </div>
          </div>
        </div>

        <p className="mt-5 break-all text-sm text-secondary sm:mt-3 sm:text-base">
          Property ID: {property._id}
        </p>
      </div>

      {/* Property Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <PropertyGallery
          mainImage={property.mainImage}
          images={property.images}
        />

        {/* Property Information */}
        <div className="min-w-0">
          {/* Type + Listing */}
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm uppercase tracking-wide text-secondary">
              {property.propertyType}
            </p>

            <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
              {property.listingType === "sale" ? "For Sale" : "For Rent"}
            </span>
          </div>

          {/* Title */}
          <h2 className="mt-3 break-words font-serif text-3xl sm:text-4xl">
            {property.title}
          </h2>

          {/* Location */}
          <p className="mt-2 text-secondary">{property.location}</p>

          {/* Owner */}
          {showOwner && property.owner && (
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="mb-5 font-serif text-2xl">Property Owner</h3>

              <div className="mt-4 flex items-center gap-6">
                {property.owner.avatar?.url ? (
                  <Image
                    src={property.owner.avatar.url}
                    alt={property.owner.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200" />
                )}

                <div>
                  <p className="text-2xl font-semibold">
                    {property.owner.name}
                  </p>

                  {property.owner.phone && (
                    <a
                      href={`tel:${property.owner.phone}`}
                      className="mt-2 inline-block text-4xl text-secondary transition-opacity hover:opacity-70"
                    >
                      {property.owner.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          <p className="mt-6 text-2xl font-semibold">
            {property.price.toLocaleString()} {property.currency}
          </p>

          {/* Description */}
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="font-serif text-2xl">Property Description</h3>

            <p className="mt-3 break-words leading-7 text-secondary">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <PropertyFeatures
            propertyType={property.propertyType}
            listingType={property.listingType}
            bedrooms={property.bedrooms}
            kitchenArea={property.kitchenArea}
            area={property.area}
          />
        </div>
      </div>
    </main>
  );
}

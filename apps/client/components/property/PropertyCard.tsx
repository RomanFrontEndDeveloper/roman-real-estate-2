import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";

import { addFavorite, removeFavorite } from "../favorites/favoriteApi";

type PropertyCardProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: "UAH" | "USD";
  location: string;
  propertyType: string;
  listingType: "sale" | "rent";
  bedrooms: number;
  area: number;
  mainImage: string;
  images: string[];
  isFavorite: boolean;
  onFavoriteChange: (isFavorite: boolean) => void;
};

export default function PropertyCard({
  id,
  title,
  description,
  price,
  currency,
  location,
  propertyType,
  listingType,
  bedrooms,
  area,
  mainImage,
  images,
  isFavorite,
  onFavoriteChange,
}: PropertyCardProps) {
  const image = mainImage || images?.[0];

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(id);

        onFavoriteChange(false);
      } else {
        await addFavorite(id);

        onFavoriteChange(true);
      }
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  return (
    <div className="relative">
      <Link href={`/property/${id}`}>
        <Card>
          {/* Main Photo */}
          <div className="relative h-52 overflow-hidden rounded-xl bg-gray-100">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-sm text-secondary">Property Image</span>
              </div>
            )}
          </div>

          <div className="mt-5">
            {/* Property Type + Listing Type */}
            <div className="flex items-center gap-3">
              <p className="text-sm text-secondary">{propertyType}</p>

              <span className="text-sm font-medium">
                {listingType === "sale" ? "For Sale" : "For Rent"}
              </span>
            </div>

            {/* Title */}
            <h3 className="mt-1 font-serif text-2xl">{title}</h3>

            {/* Location */}
            <p className="mt-2 text-secondary">{location}</p>

            {/* Description */}
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-secondary">
              {description}
            </p>

            {/* Price */}
            <p className="mt-4 text-lg font-semibold">
              {price.toLocaleString()} {currency}
            </p>

            {/* Details */}
            <div className="mt-4 border-t border-border pt-4 text-sm text-secondary">
              {bedrooms} Bedrooms
              <span className="mx-2">•</span>
              {area} m²
            </div>
          </div>
        </Card>
      </Link>

      {/* Favorite Button */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className="absolute right-4 top-4 rounded-full"
        onClick={handleFavorite}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
      </Button>
    </div>
  );
}

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyFeatures from "@/components/property/PropertyFeatures";
import DeletePropertyButton from "@/components/property/DeletePropertyButton";
import BackButton from "../ui/BackButton";

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

type PropertyDetailsProps = {
  property: Property;
  showActions?: boolean;
};

export default function PropertyDetails({
  property,
  showActions = false,
}: PropertyDetailsProps) {
  return (
    <main className="mx-4 my-6 w-auto max-w-7xl rounded-2xl border border-border bg-white p-5 shadow-lg sm:mx-6 sm:my-8 sm:p-8 lg:mx-auto lg:my-10 lg:p-10">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Property Details
        </p>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-serif text-3xl sm:text-4xl">Property</h1>

          {showActions && (
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/property/${property._id}/edit`}
                className="text-sm font-medium transition-opacity hover:opacity-70"
              >
                <Button variant="outline">Edit</Button>
              </Link>

              <DeletePropertyButton propertyId={property._id} />
              <BackButton />
            </div>
          )}
        </div>

        <p className="mt-3 break-all text-sm text-secondary sm:text-base">
          Property ID: {property._id}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Main Photo */}
        <PropertyGallery
          mainImage={property.mainImage}
          images={property.images}
        />

        {/* Property Information */}
        <div className="min-w-0">
          {/* Type + Listing */}
          <div className="flex items-center gap-3">
            <p className="text-sm uppercase tracking-wide text-secondary">
              {property.propertyType}
            </p>

            <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
              {property.listingType === "sale" ? "For Sale" : "For Rent"}
            </span>
          </div>

          {/* Title */}
          <h2 className="mt-3 font-serif text-4xl">{property.title}</h2>

          {/* Location */}
          <p className="mt-2 text-secondary">{property.location}</p>

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

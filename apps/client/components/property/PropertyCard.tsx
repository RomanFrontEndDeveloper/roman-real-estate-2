import Card from "../ui/Card";

type PropertyCardProps = {
  title: string;
  description: string;
  price: number;
  currency: "UAH" | "USD";
  location: string;
  propertyType: string;
  listingType: "sale" | "rent";
  bedrooms: number;
  area: number;
};

export default function PropertyCard({
  title,
  description,
  price,
  currency,
  location,
  propertyType,
  listingType,
  bedrooms,
  area,
}: PropertyCardProps) {
  return (
    <Card>
      {/* Main Photo */}
      <div className="flex h-52 items-center justify-center rounded-xl bg-gray-100">
        <span className="text-sm text-secondary">
          Property Image
        </span>
      </div>

      <div className="mt-5">
        {/* Property Type + Listing Type */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-secondary">
            {propertyType}
          </p>

          <span className="text-sm font-medium">
            {listingType === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-1 font-serif text-2xl">
          {title}
        </h3>

        {/* Location */}
        <p className="mt-2 text-secondary">
          {location}
        </p>

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
  );
}
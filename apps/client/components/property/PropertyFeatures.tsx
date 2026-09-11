type PropertyFeaturesProps = {
  propertyType: string;
  listingType: "sale" | "rent";
  bedrooms: number;
  kitchenArea: number;
  area: number;
};

export default function PropertyFeatures({
  propertyType,
  listingType,
  bedrooms,
  kitchenArea,
  area,
}: PropertyFeaturesProps) {
  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="font-serif text-2xl">Property Features</h3>

      <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
        <div>
          <p className="text-secondary">Property Type</p>
          <p className="mt-1 font-medium">{propertyType}</p>
        </div>

        <div>
          <p className="text-secondary">Listing Type</p>
          <p className="mt-1 font-medium">
            {listingType === "sale" ? "For Sale" : "For Rent"}
          </p>
        </div>

        <div>
          <p className="text-secondary">Bedrooms</p>
          <p className="mt-1 font-medium">{bedrooms}</p>
        </div>

        <div>
          <p className="text-secondary">Total Area</p>
          <p className="mt-1 font-medium">{area} m²</p>
        </div>

        <div>
          <p className="text-secondary">Kitchen Area</p>
          <p className="mt-1 font-medium">{kitchenArea} m²</p>
        </div>
      </div>
    </div>
  );
}

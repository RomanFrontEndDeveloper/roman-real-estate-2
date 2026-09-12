import PropertyDetailsAll from "@/components/property/PropertyDetailsAll";

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
  owner: PropertyOwner;
};

type PropertyOwner = {
  _id: string;
  name: string;
  phone?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
};

type PropertyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load property.");
  }

  const property: Property = data.data;

  return <PropertyDetailsAll property={property} />;
}

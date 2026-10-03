import PropertyDetails from "@/components/property/PropertyDetails";
import { API_URL } from "@/lib/apiUrl";

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
  owner?: {
    _id: string;
    name: string;
    phone?: string;
    avatar?: {
      url: string;
      publicId: string;
    };
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

  const response = await fetch(`${API_URL}/api/properties/${id}`, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load property.");
  }

  const property: Property = data.data;

  return <PropertyDetails property={property} showOwner />;
}

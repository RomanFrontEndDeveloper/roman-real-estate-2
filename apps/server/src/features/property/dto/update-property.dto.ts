export interface UpdatePropertyDTO {
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
  images: string[];
  mainImage?: string;
  latitude?: number;
  longitude?: number;
}

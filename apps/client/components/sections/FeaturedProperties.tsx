import PropertyCardAll from "@/components/property/PropertyCardAll";

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

export default async function PropertyCategories() {
  const response = await fetch("http://localhost:5000/api/properties", {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  const properties: Property[] = data.data;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Properties
        </p>

        <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
          Explore Properties
        </h2>

        <p className="mt-3 text-secondary">
          Discover properties from all users.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="flex min-h-[20vh] items-center justify-center">
          <p className="text-secondary">No properties available yet.</p>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCardAll
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
            />
          ))}
        </div>
      )}
    </section>
  );
}

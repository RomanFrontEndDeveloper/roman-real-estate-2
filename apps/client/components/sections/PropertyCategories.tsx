import Link from "next/link";

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

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type PropertyCategoriesProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function PropertyCategories({
  searchParams,
}: PropertyCategoriesProps) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string" && value) {
      params.set(key, value);
    }
  });

  const queryString = params.toString();

  const response = await fetch(
    `http://localhost:5000/api/properties${
      queryString ? `?${queryString}` : ""
    }`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  const properties: Property[] = data.data;

  const pagination: Pagination = data.pagination;

  const createPageUrl = (page: number) => {
    const pageParams = new URLSearchParams(params);

    pageParams.set("page", String(page));

    return `/?${pageParams.toString()}`;
  };

  return (
    <section className="mx-auto mb-6 max-w-7xl px-4 sm:px-6">
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
        <div className="mb-25 flex min-h-[20vh] items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-3xl font-medium text-primary sm:text-4xl">
              No properties found
            </p>

            <p className="mt-3 text-base text-secondary sm:text-lg">
              Try changing your search filters.
            </p>
          </div>
        </div>
      ) : (
        <>
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

          {pagination.totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {pagination.page > 1 ? (
                <Link
                  href={createPageUrl(pagination.page - 1)}
                  className="rounded-lg border border-border bg-white px-4 py-2 text-sm transition-opacity hover:opacity-70"
                >
                  Previous
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-lg border border-border bg-gray-100 px-4 py-2 text-sm text-secondary">
                  Previous
                </span>
              )}

              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1,
              ).map((page) =>
                page === pagination.page ? (
                  <span
                    key={page}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                  >
                    {page}
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={createPageUrl(page)}
                    className="rounded-lg border border-border bg-white px-4 py-2 text-sm transition-opacity hover:opacity-70"
                  >
                    {page}
                  </Link>
                ),
              )}

              {pagination.page < pagination.totalPages ? (
                <Link
                  href={createPageUrl(pagination.page + 1)}
                  className="rounded-lg border border-border bg-white px-4 py-2 text-sm transition-opacity hover:opacity-70"
                >
                  Next
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-lg border border-border bg-gray-100 px-4 py-2 text-sm text-secondary">
                  Next
                </span>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

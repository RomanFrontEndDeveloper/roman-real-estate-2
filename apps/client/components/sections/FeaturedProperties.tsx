import Card from "../ui/Card";

const properties = [
  {
    title: "Modern Villa",
    location: "Kyiv, Ukraine",
    price: "$450,000",
    type: "Villa",
    status: "For Sale",
  },
  {
    title: "Luxury Apartment",
    location: "Lviv, Ukraine",
    price: "$1,200/month",
    type: "Apartment",
    status: "For Rent",
  },
  {
    title: "Family House",
    location: "Odesa, Ukraine",
    price: "$320,000",
    type: "House",
    status: "For Sale",
  },
];

export default function FeaturedProperties() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Featured
          </p>

          <h2 className="mt-2 font-serif text-4xl">
            Featured Properties
          </h2>

          <p className="mt-3 text-secondary">
            Explore our handpicked selection of exceptional properties.
          </p>
        </div>

        <button className="hidden text-sm font-medium md:block">
          View All Properties →
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.title}>
            <div className="flex h-52 items-center justify-center rounded-xl bg-gray-100">
              <span className="text-sm text-secondary">
                Property Image
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-3">
                <p className="text-sm text-secondary">
                  {property.type}
                </p>

                <span className="text-sm font-medium">
                  {property.status}
                </span>
              </div>

              <h3 className="mt-1 font-serif text-2xl">
                {property.title}
              </h3>

              <p className="mt-2 text-secondary">
                {property.location}
              </p>

              <p className="mt-4 text-lg font-semibold">
                {property.price}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
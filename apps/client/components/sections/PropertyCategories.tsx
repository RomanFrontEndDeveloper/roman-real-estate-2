import Button from "../ui/Button";

const categories = [
  {
    title: "Apartments",
    description: "Modern apartments in prime locations.",
  },
  {
    title: "Houses",
    description: "Comfortable homes for families.",
  },
  {
    title: "Villas",
    description: "Luxury villas with exceptional spaces.",
  },
  {
    title: "Commercial",
    description: "Properties for business and investment.",
  },
];

export default function PropertyCategories() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Categories
        </p>

        <h2 className="mt-2 font-serif text-4xl">Property Categories</h2>

        <p className="mt-3 text-secondary">
          Find the right property for your needs.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.title}
            className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-lg">⌂</span>
            </div>

            <h3 className="font-serif text-2xl">{category.title}</h3>

            <p className="mt-3 text-secondary pb-4">{category.description}</p>

            <Button variant="outline">Explore →</Button>
          </div>
        ))}
      </div>
    </section>
  );
}

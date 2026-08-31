const locations = [
  {
    name: "Kyiv",
    properties: "124 Properties",
  },
  {
    name: "Lviv",
    properties: "86 Properties",
  },
  {
    name: "Odesa",
    properties: "73 Properties",
  },
  {
    name: "Dnipro",
    properties: "58 Properties",
  },
];

export default function PopularLocations() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Locations
        </p>

        <h2 className="mt-2 font-serif text-4xl">Popular Locations</h2>

        <p className="mt-3 text-secondary">
          Explore properties in the most desirable locations.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {locations.map((location) => (
          <div
            key={location.name}
            className="group rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-40 items-center justify-center rounded-xl bg-gray-100">
              <span className="text-sm text-secondary">{location.name}</span>
            </div>

            <div className="mt-5">
              <h3 className="font-serif text-2xl">{location.name}</h3>

              <p className="mt-2 text-sm text-secondary">
                {location.properties}
              </p>

              <button className="mt-5 text-sm font-medium">
                Explore Location →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

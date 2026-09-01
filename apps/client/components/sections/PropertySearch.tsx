import Button from "../ui/Button";
import Input from "../ui/Input";

export default function PropertySearch() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="font-serif text-2xl">Find Your Property</h2>

          <p className="mt-2 text-secondary">
            Search properties by location, type, and price.
          </p>
        </div>

        {/* Property Purpose */}
        <div className="mb-6 flex gap-3">
          <button
            type="button"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            For Sale
          </button>

          <button
            type="button"
            className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-70"
          >
            For Rent
          </button>
        </div>

        {/* Search Filters */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input placeholder="Location" />

          <select
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
            defaultValue=""
          >
            <option value="" disabled>
              Property Type
            </option>

            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
          </select>

          <Input placeholder="Min Price" type="number" />

          <Button>Search Properties</Button>
        </div>
      </div>
    </section>
  );
}
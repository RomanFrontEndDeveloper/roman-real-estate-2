type PropertyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Property Details
        </p>

        <h1 className="mt-3 font-serif text-4xl">Property</h1>

        <p className="mt-3 text-secondary">Property ID: {id}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Main Photo */}
        <div className="flex h-[450px] items-center justify-center rounded-xl bg-gray-100">
          <span className="text-sm text-secondary">Property Image</span>
        </div>

        {/* Property Information */}
        <div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-secondary">Property Type</p>

            <span className="text-sm font-medium">For Sale</span>
          </div>

          <h2 className="mt-2 font-serif text-4xl">Property Title</h2>

          <p className="mt-3 text-secondary">Property Location</p>

          <p className="mt-6 text-2xl font-semibold">$000,000</p>

          <div className="mt-6 border-t border-border pt-6">
            <p className="leading-7 text-secondary">
              Property description will appear here.
            </p>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-secondary">Bedrooms</p>
                <p className="mt-1 font-medium">0</p>
              </div>

              <div>
                <p className="text-secondary">Total Area</p>
                <p className="mt-1 font-medium">0 m²</p>
              </div>

              <div>
                <p className="text-secondary">Kitchen Area</p>
                <p className="mt-1 font-medium">0 m²</p>
              </div>

              <div>
                <p className="text-secondary">Location</p>
                <p className="mt-1 font-medium">Property Location</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

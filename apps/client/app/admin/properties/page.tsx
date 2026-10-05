import PropertyCategories from "@/components/sections/PropertyCategories";

type AdminPropertiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPropertiesPage({
  searchParams,
}: AdminPropertiesPageProps) {
  return (
    <section className="w-full py-6 sm:py-10">
      <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6">
        <div className="mb-8 ml-10">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Administration
          </p>

          <h1 className="mt-2 font-serif text-4xl">All Properties</h1>

          <p className="mt-3 text-secondary">
            Manage all properties as administrator.
          </p>
        </div>

        <PropertyCategories
          searchParams={searchParams}
          basePath="/admin/properties"
          showBackButton
          showAdminActions
        />
      </div>
    </section>
  );
}

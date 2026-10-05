import PropertyCategories from "@/components/sections/PropertyCategories";

type AllPropertyPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AllPropertyPage({
  searchParams,
}: AllPropertyPageProps) {
  return (
    <main className="mt-8 min-h-full">
      <PropertyCategories
        searchParams={searchParams}
        basePath="/allproperty"
        showBackButton
      />
    </main>
  );
}

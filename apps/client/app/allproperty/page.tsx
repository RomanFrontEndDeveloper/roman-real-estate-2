import PropertyCategories from "@/components/sections/PropertyCategories";

type AllPropertyPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AllPropertyPage({
  searchParams,
}: AllPropertyPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-full mt-8">
      <PropertyCategories searchParams={params} basePath="/allproperty" showBackButton />
    </main>
  );
}

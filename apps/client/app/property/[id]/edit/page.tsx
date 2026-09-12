import EditPropertyForm from "@/components/property/EditPropertyForm";

type EditPropertyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const { id } = await params;

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Property Management
          </p>

          <h1 className="mt-3 font-serif text-4xl">Edit Property</h1>

          <p className="mt-3 text-secondary">
            Update your property information.
          </p>
        </div>

        <EditPropertyForm propertyId={id} />
      </div>
    </main>
  );
}

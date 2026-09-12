import CreatePropertyForm from "@/components/property/CreatePropertyForm";

export default function CreatePropertyPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gray-50 px-6 py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Property Listing
          </p>

          <h1 className="mt-3 font-serif text-4xl">
            Create Property
          </h1>

          <p className="mt-3 text-secondary">
            Add a property to Roman Real Estate.
          </p>
        </div>

        <CreatePropertyForm />
      </div>
    </main>
  );
} 
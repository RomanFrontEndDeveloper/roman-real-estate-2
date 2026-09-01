import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="px-6 py-6 ">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
            Roman Real Estate
          </p>

          <h1 className="font-serif text-5xl leading-tight tracking-tight md:text-6xl">
            Find Your Perfect Home
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-secondary">
            Discover exceptional properties in the locations you love.
          </p>

          <div className="mt-8 flex gap-4">
            <Button>Explore Properties</Button>

            <Button variant="outline">Contact Us</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
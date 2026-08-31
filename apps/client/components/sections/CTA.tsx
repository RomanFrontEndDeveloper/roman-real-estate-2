import Button from "../ui/Button";

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="rounded-3xl bg-primary px-6 py-16 text-white md:px-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
            Find Your Place
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Ready to Find Your New Home?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-400">
            Explore exceptional properties and find a place that feels like
            home.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button>Explore Properties</Button>

            <Button variant="outline">Contact Us</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-white px-6 py-12 shadow-sm sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-secondary">
            Roman Real Estate
          </p>

          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
            Find a place
            <br />
            that feels like home.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-secondary sm:text-lg sm:leading-8">
            Discover apartments, houses and other properties in locations you
            love. Explore listings, connect with agents and find your next home.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/allproperty">
              <Button className="w-full sm:w-auto">Explore Properties →</Button>
            </Link>

            <Link href="/agents">
              <Button variant="outline" className="w-full sm:w-auto">
                Meet Our Agents
              </Button>
            </Link>
          </div>

          {/* Quick facts */}
          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-gray-50 px-5 py-4">
              <p className="font-serif text-2xl text-primary">100+</p>
              <p className="mt-1 text-sm text-secondary">Properties</p>
            </div>

            <div className="rounded-2xl border border-border bg-gray-50 px-5 py-4">
              <p className="font-serif text-2xl text-primary">20+</p>
              <p className="mt-1 text-sm text-secondary">Real Estate Agents</p>
            </div>

            <div className="rounded-2xl border border-border bg-gray-50 px-5 py-4">
              <p className="font-serif text-2xl text-primary">Ukraine</p>
              <p className="mt-1 text-sm text-secondary">Local Market</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

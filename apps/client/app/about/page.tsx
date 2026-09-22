import Link from "next/link";

import Button from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-20">
      {/* Hero */}
      <section className="rounded-3xl border border-border bg-white px-6 py-12 shadow-sm sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-secondary">
            About Roman Real Estate
          </p>

          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-primary sm:text-5xl lg:text-6xl">
            Helping people find a place that feels like home.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-secondary">
            Roman Real Estate is a modern property platform where people can
            discover homes, explore listings, connect with real estate agents,
            and find opportunities in the local market.
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
        </div>
      </section>

      {/* What we do */}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Properties
          </p>

          <h2 className="mt-3 font-serif text-2xl text-primary">
            Discover listings
          </h2>

          <p className="mt-3 leading-7 text-secondary">
            Browse apartments, houses, and other properties using search,
            filters, maps, and detailed property pages.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Agents
          </p>

          <h2 className="mt-3 font-serif text-2xl text-primary">
            Connect with professionals
          </h2>

          <p className="mt-3 leading-7 text-secondary">
            Explore agent profiles, their properties, and the agencies they work
            with.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Local Market
          </p>

          <h2 className="mt-3 font-serif text-2xl text-primary">
            Focused on Ukraine
          </h2>

          <p className="mt-3 leading-7 text-secondary">
            The platform is designed around the needs of people searching for
            and offering real estate in Ukraine.
          </p>
        </div>
      </section>

    
    </main>
  );
}

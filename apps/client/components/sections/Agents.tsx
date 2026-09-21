import AllAgents from "../agent/AllAgents";

export default function Agents() {
  return (
    <section className="mx-auto mb-4 max-w-7xl px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Our Team
        </p>

        <h2 className="mt-2 font-serif text-4xl">Meet Our Agents</h2>

        <p className="mt-3 text-secondary">
          Work with experienced professionals who know the market.
        </p>
      </div>

      <AllAgents />
    </section>
  );
}

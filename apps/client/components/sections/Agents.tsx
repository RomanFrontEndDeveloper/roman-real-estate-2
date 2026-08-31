const agents = [
  {
    name: "James Wilson",
    role: "Senior Real Estate Agent",
    properties: "48 Properties",
  },
  {
    name: "Sophie Martin",
    role: "Property Consultant",
    properties: "36 Properties",
  },
  {
    name: "Daniel Brown",
    role: "Real Estate Advisor",
    properties: "29 Properties",
  },
];

export default function Agents() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Our Team
        </p>

        <h2 className="mt-2 font-serif text-4xl">
          Meet Our Agents
        </h2>

        <p className="mt-3 text-secondary">
          Work with experienced professionals who know the market.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-56 items-center justify-center rounded-xl bg-gray-100">
              <span className="text-sm text-secondary">
                Agent Photo
              </span>
            </div>

            <div className="mt-5">
              <h3 className="font-serif text-2xl">
                {agent.name}
              </h3>

              <p className="mt-2 text-secondary">
                {agent.role}
              </p>

              <p className="mt-3 text-sm text-secondary">
                {agent.properties}
              </p>

              <button className="mt-5 text-sm font-medium">
                View Profile →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
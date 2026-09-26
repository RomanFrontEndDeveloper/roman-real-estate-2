"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/apiUrl";
import AgentCard, {
  type Agent,
} from "../agent/AgentCard";

type AgentsResponse = {
  success: boolean;
  data: Agent[];
};

export default function AllAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const agentsPerPage = 3;

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
         `${API_URL}/api/profile/agents`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }

        const data: AgentsResponse = await response.json();

        setAgents(data.data);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
        setError("Unable to load agents.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const totalPages = Math.ceil(
    agents.length / agentsPerPage,
  );

  const startIndex =
    (currentPage - 1) * agentsPerPage;

  const currentAgents = agents.slice(
    startIndex,
    startIndex + agentsPerPage,
  );

  return (
    <>
      {isLoading && (
        <div className="py-10 text-center text-2xl">
          <p className="text-secondary">
            Loading agents...
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="py-10 text-center text-2xl">
          <p className="text-secondary">{error}</p>
        </div>
      )}

      {!isLoading && !error && agents.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-2xl text-secondary">
            No agents found.
          </p>
        </div>
      )}

      {!isLoading && !error && agents.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentAgents.map((agent) => (
              <AgentCard
                key={agent._id}
                agent={agent}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
                className="rounded-lg border border-border bg-white px-4 py-2 text-sm transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1,
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={
                    page === currentPage
                      ? "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                      : "rounded-lg border border-border bg-white px-4 py-2 text-sm transition-opacity hover:opacity-70"
                  }
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
                className="rounded-lg border border-border bg-white px-4 py-2 text-sm transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
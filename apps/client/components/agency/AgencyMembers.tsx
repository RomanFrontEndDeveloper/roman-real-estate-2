"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Button from "../ui/Button";

import {
  getAgencyMembers,
  getAvailableAgents,
  getOutgoingAgencyRequests,
  sendAgencyJoinRequest,
  removeAgencyMember,
  type AgencyMember,
  type AgencyAgent,
} from "@/lib/agencyApi";

type RequestState = Partial<Record<string, "pending" | "loading">>;

export default function AgencyMembers() {
  const [members, setMembers] = useState<AgencyMember[]>([]);
  const [agents, setAgents] = useState<AgencyAgent[]>([]);
  const [requestStates, setRequestStates] = useState<RequestState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingAgentId, setRemovingAgentId] = useState<string | null>(null);

  useEffect(() => {
    const loadAgencyData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [membersResponse, agentsResponse, requestsResponse] =
          await Promise.all([
            getAgencyMembers(),
            getAvailableAgents(),
            getOutgoingAgencyRequests(),
          ]);

        if (!membersResponse.ok) {
          throw new Error("Failed to load agency members");
        }

        if (!agentsResponse.ok) {
          throw new Error("Failed to load agents");
        }

        if (!requestsResponse.ok) {
          throw new Error("Failed to load agency requests");
        }

        const membersData = await membersResponse.json();
        const agentsData = await agentsResponse.json();
        const requestsData = await requestsResponse.json();

        setMembers(membersData.data);
        setAgents(agentsData.data);

        const requestMap: RequestState = {};

        requestsData.data.forEach(
          (request: {
            agent: {
              _id: string;
            };
          }) => {
            requestMap[request.agent._id] = "pending";
          },
        );

        setRequestStates(requestMap);
      } catch (error) {
        console.error("Failed to load agency data:", error);

        setError(
          error instanceof Error ? error.message : "Unable to load agency data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAgencyData();
  }, []);

  const handleSendRequest = async (agentId: string) => {
    try {
      setRequestStates((current) => ({
        ...current,
        [agentId]: "loading",
      }));

      const response = await sendAgencyJoinRequest(agentId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send request");
      }

      setRequestStates((current) => ({
        ...current,
        [agentId]: "pending",
      }));
    } catch (error) {
      console.error("Failed to send join request:", error);

      setRequestStates((current) => {
        const next = { ...current };

        delete next[agentId];

        return next;
      });

      alert(error instanceof Error ? error.message : "Failed to send request");
    }
  };

  const handleRemoveMember = async (agentId: string) => {
    const confirmed = window.confirm("Remove this agent from the agency?");

    if (!confirmed) {
      return;
    }

    try {
      setRemovingAgentId(agentId);

      const response = await removeAgencyMember(agentId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove agent");
      }

      setMembers((current) =>
        current.filter((member) => member.agent._id !== agentId),
      );
    } catch (error) {
      console.error("Failed to remove agent:", error);

      alert(error instanceof Error ? error.message : "Failed to remove agent");
    } finally {
      setRemovingAgentId(null);
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-center text-2xl text-secondary">
          Loading agency members...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-center text-2xl text-secondary">{error}</p>
      </section>
    );
  }

  /*
   * Current agency members.
   *
   * This block must stay based on `members`.
   */
  const memberIds = new Set(members.map((member) => member.agent._id));

  /*
   * Invite only agents who:
   *
   * 1. are not already members of this agency
   * 2. do not belong to any agency
   */

  const availableAgents = agents.filter((agent) => !memberIds.has(agent._id));

  return (
    <section className="w-full px-3 pb-16 sm:px-6">
      {/* Current members */}
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Our Team
        </p>

        <h2 className="mt-2 font-serif text-4xl">Our Agents</h2>

        <p className="mt-3 text-secondary">
          Agents who are members of this agency.
        </p>
      </div>

      {members.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-8 text-center">
          <p className="text-secondary text-2xl">
            No agents have joined the agency yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex h-full min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5 lg:p-6"
            >
              <div className="relative h-80 overflow-hidden rounded-xl bg-gray-100">
                {member.agent.avatar?.url ? (
                  <Image
                    src={member.agent.avatar.url}
                    alt={member.agent.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm text-secondary">Agent Photo</span>
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-1 flex-col">
                <h3 className="font-serif text-2xl">{member.agent.name}</h3>

                <p className="mt-2 text-secondary">Real Estate Agent</p>

                {member.agent.phone && (
                  <p className="mt-3 text-sm text-secondary">
                    Phone: {member.agent.phone}
                  </p>
                )}

                <p className="mt-1 text-sm text-secondary">
                  Email: {member.agent.email}
                </p>

                {member.agent.bio && (
                  <p className="mt-3 line-clamp-2 text-sm text-secondary">
                    {member.agent.bio}
                  </p>
                )}

                <p className="mt-4 text-sm font-medium text-primary">
                  {member.propertiesCount}{" "}
                  {member.propertiesCount === 1 ? "Property" : "Properties"}
                </p>

                <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                  <Link href={`/agents/${member.agent._id}`} className="w-full">
                    <Button className="h-16 w-full px-1 py-0.5 text-sm sm:text-base">
                      <span className="whitespace-nowrap">View Profile →</span>
                    </Button>
                  </Link>

                  <div className="w-full">
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveMember(member.agent._id)}
                      disabled={removingAgentId === member.agent._id}
                      className="h-16 w-full px-1 py-0.5 text-sm leading-tight sm:text-base"
                    >
                      {removingAgentId === member.agent._id
                        ? "Removing..."
                        : "Remove from Agency"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite agents */}
      <div className="mt-20">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Recruitment
        </p>

        <h2 className="mt-2 font-serif text-4xl">Invite Agents</h2>

        <p className="mt-3 text-secondary">
          Send a request to an agent to join your agency.
        </p>
      </div>

      {availableAgents.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-white p-8 text-center">
          <p className="text-secondary">No available agents to invite.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableAgents.map((agent) => {
            const requestState = requestStates[agent._id];

            return (
              <div
                key={agent._id}
                className="rounded-2xl border border-border bg-white p-5"
              >
                <div className="flex items-center gap-4">
                  {agent.avatar?.url ? (
                    <Image
                      src={agent.avatar.url}
                      alt={agent.name}
                      width={72}
                      height={72}
                      className="h-18 w-18 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-18 w-18 items-center justify-center rounded-full bg-gray-100 text-sm text-secondary">
                      Agent
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="font-serif text-xl">{agent.name}</h3>

                    <p className="mt-1 truncate text-sm text-secondary">
                      {agent.email}
                    </p>

                    {agent.phone && (
                      <p className="mt-1 truncate text-sm text-secondary">
                        {agent.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  {requestState === "pending" ? (
                    <span className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-gray-100 px-4 text-sm text-secondary">
                      Request Pending
                    </span>
                  ) : (
                    <Button
                      onClick={() => handleSendRequest(agent._id)}
                      disabled={requestState === "loading"}
                      className="h-12 w-full"
                    >
                      {requestState === "loading"
                        ? "Sending..."
                        : "Send Request"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

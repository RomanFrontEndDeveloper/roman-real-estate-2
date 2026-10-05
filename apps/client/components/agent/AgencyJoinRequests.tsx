"use client";

import { useEffect, useState } from "react";

import Button from "../ui/Button";

import {
  getIncomingAgencyRequests,
  respondToAgencyRequest,
  type AgencyRequest,
} from "@/lib/agencyApi";

import { apiFetch } from "@/lib/apiFetch";

type UserResponse = {
  user: {
    role: "admin" | "agency" | "agent" | "owner-client";
  };
};

export default function AgencyJoinRequests() {
  const [requests, setRequests] = useState<AgencyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);

        const userResponse = await apiFetch("/api/auth/me");

        if (!userResponse.ok) {
          return;
        }

        const userData: UserResponse = await userResponse.json();

        if (userData.user.role !== "agent") {
          return;
        }

        const response = await getIncomingAgencyRequests();

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setRequests(data.data);
      } catch (error) {
        console.error("Failed to load agency requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleResponse = async (
    membershipId: string,
    status: "active" | "rejected",
  ) => {
    if (processingRequestId) {
      return;
    }

    try {
      setProcessingRequestId(membershipId);

      const response = await respondToAgencyRequest(membershipId, status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process request");
      }

      setRequests((current) =>
        current.filter((request) => request._id !== membershipId),
      );

      /**
       * Notify other profile components that agency membership changed.
       *
       * ProfileCard listens to this event and reloads the current user.
       */
      if (status === "active") {
        window.dispatchEvent(new Event("agency-membership-changed"));
      }
    } catch (error) {
      console.error("Failed to respond to request:", error);

      alert(
        error instanceof Error ? error.message : "Failed to process request",
      );
    } finally {
      setProcessingRequestId(null);
    }
  };

  if (isLoading || requests.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-2xl px-6 pt-4">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Agency
        </p>

        <h2 className="mt-2 font-serif text-3xl">Join Requests</h2>

        <div className="mt-6 space-y-4">
          {requests.map((request) => {
            const isProcessing = processingRequestId === request._id;

            return (
              <div
                key={request._id}
                className="rounded-xl border border-border p-5"
              >
                <h3 className="font-serif text-xl">{request.agency.name}</h3>

                <p className="mt-2 text-sm text-secondary">
                  This agency would like you to join their team.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleResponse(request._id, "active")}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Accept"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleResponse(request._id, "rejected")}
                    disabled={isProcessing}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

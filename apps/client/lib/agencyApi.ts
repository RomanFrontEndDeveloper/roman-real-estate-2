import { apiFetch } from "@/lib/apiFetch";

export type AgencyAgent = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  role: "agent";
};

export type AgencyMember = {
  _id: string;
  agency: string;
  agent: AgencyAgent;
  status: "active";
  propertiesCount: number;
};

export type AgencyMemberResponse = {
  success: boolean;
  data: AgencyMember[];
};

export type AgencyRequest = {
  _id: string;
  agency: {
    _id: string;
    name: string;
    owner: string;
    createdAt: string;
  };
  status: "pending";
};

export type AgencyRequestResponse = {
  success: boolean;
  data: AgencyRequest[];
};

export type PublicAgentsResponse = {
  success: boolean;
  data: AgencyAgent[];
};

export const getAgencyMembers = async () => {
  return apiFetch("/api/agency/members");
};

export const getOutgoingAgencyRequests = async () => {
  return apiFetch("/api/agency/requests/outgoing");
};

export const getIncomingAgencyRequests = async () => {
  return apiFetch("/api/agency/requests/incoming");
};

export const getPublicAgents = async () => {
  return apiFetch("/api/profile/agents");
};

export const sendAgencyJoinRequest = async (agentId: string) => {
  return apiFetch(`/api/agency/requests/${agentId}`, {
    method: "POST",
  });
};

export const respondToAgencyRequest = async (
  membershipId: string,
  status: "active" | "rejected",
) => {
  return apiFetch(`/api/agency/requests/${membershipId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });
};

export const removeAgencyMember = async (agentId: string) => {
  return apiFetch(`/api/agency/members/${agentId}`, {
    method: "DELETE",
  });
};

export const getMyAgencyMembership = () => {
  return apiFetch("/api/agency/membership/me");
};

export const leaveAgency = () => {
  return apiFetch("/api/agency/membership/me", {
    method: "DELETE",
  });
};

import { findUserById } from "../../auth/repository/user.repository.js";

import { findAgencyByOwner } from "../repository/agency.repository.js";

import {
  createMembership,
  findIncomingRequests,
  findMembership,
  findMembershipById,
  findAgencyMembers,
  findOutgoingRequests,
  updateMembershipStatus,
  deleteMembership,
} from "../repository/agency-member.repository.js";

const createError = (message: string, statusCode: number) => {
  const error = new Error(message);

  (error as Error & { statusCode?: number }).statusCode = statusCode;

  return error;
};

export const sendAgentJoinRequest = async (userId: string, agentId: string) => {
  const agencyUser = await findUserById(userId);

  if (!agencyUser) {
    throw createError("User not found", 404);
  }

  if (agencyUser.role !== "agency") {
    throw createError("Agency role required", 403);
  }

  const agency = await findAgencyByOwner(userId);

  if (!agency) {
    throw createError("Agency profile not found", 404);
  }

  const agent = await findUserById(agentId);

  if (!agent) {
    throw createError("Agent not found", 404);
  }

  if (agent.role !== "agent") {
    throw createError("Selected user is not an agent", 400);
  }

  const existingMembership = await findMembership(
    agency._id.toString(),
    agentId,
  );

  if (existingMembership?.status === "active") {
    throw createError("Agent is already a member of this agency", 409);
  }

  if (existingMembership?.status === "pending") {
    throw createError("Join request is already pending", 409);
  }

  if (existingMembership?.status === "rejected") {
    return createMembership({
      agency: agency._id.toString(),
      agent: agentId,
    });
  }

  return createMembership({
    agency: agency._id.toString(),
    agent: agentId,
  });
};

export const getAgencyMembers = async (userId: string) => {
  const agency = await findAgencyByOwner(userId);

  if (!agency) {
    throw createError("Agency profile not found", 404);
  }

  return findAgencyMembers(agency._id.toString());
};

export const getAgencyOutgoingRequests = async (userId: string) => {
  const agency = await findAgencyByOwner(userId);

  if (!agency) {
    throw createError("Agency profile not found", 404);
  }

  return findOutgoingRequests(agency._id.toString());
};

export const getAgentIncomingRequests = async (userId: string) => {
  const agent = await findUserById(userId);

  if (!agent) {
    throw createError("User not found", 404);
  }

  if (agent.role !== "agent") {
    throw createError("Agent role required", 403);
  }

  return findIncomingRequests(userId);
};

export const respondToJoinRequest = async (
  userId: string,
  membershipId: string,
  status: "active" | "rejected",
) => {
  const agent = await findUserById(userId);

  if (!agent) {
    throw createError("User not found", 404);
  }

  if (agent.role !== "agent") {
    throw createError("Agent role required", 403);
  }

  const membership = await findMembershipById(membershipId);

  if (!membership) {
    throw createError("Join request not found", 404);
  }

  if (membership.agent.toString() !== userId) {
    throw createError("You cannot respond to this request", 403);
  }

  if (membership.status !== "pending") {
    throw createError("Join request has already been processed", 409);
  }

  return updateMembershipStatus(membershipId, status);
};

export const removeAgencyMember = async (userId: string, agentId: string) => {
  const agency = await findAgencyByOwner(userId);

  if (!agency) {
    throw createError("Agency profile not found", 404);
  }

  const membership = await findMembership(agency._id.toString(), agentId);

  if (!membership) {
    throw createError("Agent is not a member of this agency", 404);
  }

  if (membership.status !== "active") {
    throw createError("Agent is not an active member", 400);
  }

  const removedMembership = await deleteMembership(
    agency._id.toString(),
    agentId,
  );

  if (!removedMembership) {
    throw createError("Failed to remove agent from agency", 500);
  }

  return removedMembership;
};

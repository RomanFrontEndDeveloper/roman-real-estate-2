import { findUserById } from "../../auth/repository/user.repository.js";

import {
  createAgency as createAgencyRepository,
  findAgencyByOwner,
  updateAgencyByOwner,
  findMyAgencyMembership,
  removeMyAgencyMembership,
  findAllAgencies,
  findAgencyById,
} from "../repository/agency.repository.js";

export const createAgency = async (userId: string, name: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "agency") {
    const error = new Error("Only agency users can create an agency");

    (error as Error & { statusCode?: number }).statusCode = 403;

    throw error;
  }

  const existingAgency = await findAgencyByOwner(userId);

  if (existingAgency) {
    const error = new Error("Agency profile already exists");

    (error as Error & { statusCode?: number }).statusCode = 409;

    throw error;
  }

  return createAgencyRepository({
    name: name.trim() || user.name,
    owner: userId,
  });
};

export const getMyAgency = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error("User not found");

    (error as Error & { statusCode?: number }).statusCode = 404;

    throw error;
  }

  if (user.role !== "agency") {
    const error = new Error("Agency role required");

    (error as Error & { statusCode?: number }).statusCode = 403;

    throw error;
  }

  let agency = await findAgencyByOwner(userId);

  if (!agency) {
    await createAgencyRepository({
      name: user.name,
      owner: userId,
    });

    agency = await findAgencyByOwner(userId);
  } else if (agency.name !== user.name) {
    agency = await updateAgencyByOwner(userId, {
      name: user.name,
    });
  }

  if (!agency) {
    const error = new Error("Agency profile not found");

    (error as Error & { statusCode?: number }).statusCode = 404;

    throw error;
  }

  return agency;
};

export const updateMyAgency = async (
  userId: string,
  data: {
    name?: string;
  },
) => {
  const agency = await findAgencyByOwner(userId);

  if (!agency) {
    const error = new Error("Agency profile not found");

    (error as Error & { statusCode?: number }).statusCode = 404;

    throw error;
  }

  return updateAgencyByOwner(userId, {
    name: data.name?.trim(),
  });
};

export const getMyAgencyMembership = async (userId: string) => {
  return findMyAgencyMembership(userId);
};

export const leaveAgency = async (userId: string) => {
  const membership = await findMyAgencyMembership(userId);

  if (!membership) {
    const error = new Error("You are not a member of any agency");

    (
      error as Error & {
        statusCode?: number;
      }
    ).statusCode = 404;

    throw error;
  }

  await removeMyAgencyMembership(userId);

  return {
    message: "You have left the agency",
  };
};

export const getAllAgencies = async () => {
  return findAllAgencies();
};

export const getPublicAgencyById = async (agencyId: string) => {
  const agency = await findAgencyById(agencyId);

  if (!agency) {
    const error = new Error("Agency not found");

    (
      error as Error & {
        statusCode?: number;
      }
    ).statusCode = 404;

    throw error;
  }

  return agency;
};

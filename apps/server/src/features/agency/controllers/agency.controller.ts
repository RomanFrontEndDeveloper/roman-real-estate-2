import type { NextFunction, Request, Response } from "express";

import {
  createAgency,
  getMyAgency,
  updateMyAgency,
  getAllAgencies,
  getPublicAgencyById,
  leaveAgency,
  getMyAgencyMembership,  
} from "../services/agency.service.js";

import {
  getAgencyMembers,
  getAgencyOutgoingRequests,
  getAgentIncomingRequests,
  respondToJoinRequest,
  sendAgentJoinRequest,
  removeAgencyMember,
} from "../services/agency-member.service.js";

export const createAgencyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const name = typeof req.body.name === "string" ? req.body.name : "";

    const agency = await createAgency(req.user.userId, name);

    res.status(201).json({
      success: true,
      data: agency,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAgencyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const agency = await getMyAgency(req.user.userId);

    res.status(200).json({
      success: true,
      data: agency,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyAgencyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const agency = await updateMyAgency(req.user.userId, {
      name: req.body.name,
    });

    res.status(200).json({
      success: true,
      data: agency,
    });
  } catch (error) {
    next(error);
  }
};

export const sendJoinRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const { agentId } = req.params;

    if (typeof agentId !== "string") {
      res.status(400).json({
        message: "Invalid agent id",
      });
      return;
    }

    const result = await sendAgentJoinRequest(req.user.userId, agentId);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAgencyMembersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const members = await getAgencyMembers(req.user.userId);

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

export const getOutgoingRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const requests = await getAgencyOutgoingRequests(req.user.userId);

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getIncomingRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const requests = await getAgentIncomingRequests(req.user.userId);

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const respondJoinRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const { membershipId } = req.params;

    const { status } = req.body;

    if (
      typeof membershipId !== "string" ||
      (status !== "active" && status !== "rejected")
    ) {
      res.status(400).json({
        message: "Invalid request data",
      });
      return;
    }

    const result = await respondToJoinRequest(
      req.user.userId,
      membershipId,
      status,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const { agentId } = req.params;

    if (typeof agentId !== "string") {
      res.status(400).json({
        message: "Invalid agent id",
      });
      return;
    }

    const result = await removeAgencyMember(req.user.userId, agentId);

    res.status(200).json({
      success: true,
      message: "Agent removed from agency",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAgencyMembershipProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const membership = await getMyAgencyMembership(req.user.userId);

    res.status(200).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    next(error);
  }
};

export const leaveMyAgency = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const result = await leaveAgency(req.user.userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicAgencies = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const agencies = await getAllAgencies();

    res.status(200).json({
      success: true,
      data: agencies,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicAgency = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({
        message: "Invalid agency id",
      });
      return;
    }

    const agency = await getPublicAgencyById(id);

    res.status(200).json({
      success: true,
      data: agency,
    });
  } catch (error) {
    next(error);
  }
};

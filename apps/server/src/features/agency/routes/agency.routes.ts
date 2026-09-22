import { Router } from "express";

import {
  createAgencyProfile,
  getMyAgencyProfile,
  updateMyAgencyProfile,
  getMyAgencyMembershipProfile,
  leaveMyAgency,
  sendJoinRequest,
  getAgencyMembersController,
  getOutgoingRequests,
  getIncomingRequests,
  respondJoinRequest,
  removeMember,
  getPublicAgencies,
  getPublicAgency,
} from "../controllers/agency.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

/* Public */

router.get("/", getPublicAgencies);

/* Current agency */

router.get("/me", authenticate, getMyAgencyProfile);

router.post("/", authenticate, createAgencyProfile);

router.put("/me", authenticate, updateMyAgencyProfile);

/* Agency requests */

router.post("/requests/:agentId", authenticate, sendJoinRequest);

router.get("/requests/outgoing", authenticate, getOutgoingRequests);

router.get("/requests/incoming", authenticate, getIncomingRequests);

router.patch("/requests/:membershipId", authenticate, respondJoinRequest);

/* Agency members */

router.get("/members", authenticate, getAgencyMembersController);

router.delete("/members/:agentId", authenticate, removeMember);

/* Agent membership */

router.get("/membership/me", authenticate, getMyAgencyMembershipProfile);

router.delete("/membership/me", authenticate, leaveMyAgency);

/* Public single agency */

router.get("/:id", getPublicAgency);

export default router;

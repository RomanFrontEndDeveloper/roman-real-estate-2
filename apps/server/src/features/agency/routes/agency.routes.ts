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
  getAvailableAgentsController,
} from "../controllers/agency.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Agency
 *   description: Agency profiles, membership and join requests
 */

/**
 * @swagger
 * /api/agency:
 *   get:
 *     summary: Get public agencies
 *     tags: [Agency]
 *     responses:
 *       200:
 *         description: Public agencies returned successfully
 */
router.get("/", getPublicAgencies);

/**
 * @swagger
 * /api/agency/available-agents:
 *   get:
 *     summary: Get available agents
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available agents returned successfully
 *       401:
 *         description: Authentication required
 */
router.get("/available-agents", authenticate, getAvailableAgentsController);

/**
 * @swagger
 * /api/agency/me:
 *   get:
 *     summary: Get my agency profile
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agency profile returned successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Agency profile not found
 */
router.get("/me", authenticate, getMyAgencyProfile);

/**
 * @swagger
 * /api/agency:
 *   post:
 *     summary: Create an agency profile
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Agency profile created successfully
 *       400:
 *         description: Invalid agency data
 *       401:
 *         description: Authentication required
 */
router.post("/", authenticate, createAgencyProfile);

/**
 * @swagger
 * /api/agency/me:
 *   put:
 *     summary: Update my agency profile
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agency profile updated successfully
 *       400:
 *         description: Invalid agency data
 *       401:
 *         description: Authentication required
 */
router.put("/me", authenticate, updateMyAgencyProfile);

/**
 * @swagger
 * /api/agency/requests/{agentId}:
 *   post:
 *     summary: Send an agency join request
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the agent
 *     responses:
 *       201:
 *         description: Join request created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Authentication required
 */
router.post("/requests/:agentId", authenticate, sendJoinRequest);

/**
 * @swagger
 * /api/agency/requests/outgoing:
 *   get:
 *     summary: Get outgoing join requests
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Outgoing requests returned successfully
 *       401:
 *         description: Authentication required
 */
router.get("/requests/outgoing", authenticate, getOutgoingRequests);

/**
 * @swagger
 * /api/agency/requests/incoming:
 *   get:
 *     summary: Get incoming join requests
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Incoming requests returned successfully
 *       401:
 *         description: Authentication required
 */
router.get("/requests/incoming", authenticate, getIncomingRequests);

/**
 * @swagger
 * /api/agency/requests/{membershipId}:
 *   patch:
 *     summary: Respond to an agency join request
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: membershipId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the agency membership request
 *     responses:
 *       200:
 *         description: Join request processed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Request not found
 */
router.patch("/requests/:membershipId", authenticate, respondJoinRequest);

/**
 * @swagger
 * /api/agency/members:
 *   get:
 *     summary: Get agency members
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agency members returned successfully
 *       401:
 *         description: Authentication required
 */
router.get("/members", authenticate, getAgencyMembersController);

/**
 * @swagger
 * /api/agency/members/{agentId}:
 *   delete:
 *     summary: Remove an agency member
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the agent to remove
 *     responses:
 *       200:
 *         description: Agency member removed successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Agent not found
 */
router.delete("/members/:agentId", authenticate, removeMember);

/**
 * @swagger
 * /api/agency/membership/me:
 *   get:
 *     summary: Get my agency membership
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membership information returned successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Membership not found
 */
router.get("/membership/me", authenticate, getMyAgencyMembershipProfile);

/**
 * @swagger
 * /api/agency/membership/me:
 *   delete:
 *     summary: Leave my agency
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agency membership ended successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Membership not found
 */
router.delete("/membership/me", authenticate, leaveMyAgency);

/**
 * @swagger
 * /api/agency/{id}:
 *   get:
 *     summary: Get a public agency by ID
 *     tags: [Agency]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agency ID
 *     responses:
 *       200:
 *         description: Agency returned successfully
 *       404:
 *         description: Agency not found
 */
router.get("/:id", getPublicAgency);

export default router;

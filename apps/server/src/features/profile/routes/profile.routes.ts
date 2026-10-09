import { Router } from "express";

import {
  updateAvatar,
  updateProfileData,
  changeEmail,
  changePassword,
  getPublicAgents,
  getPublicAgent,
} from "../controllers/profile.controller.js";

import { uploadAvatar as uploadAvatarMiddleware } from "../middleware/upload.middleware.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profiles and public agent information
 */

/**
 * @swagger
 * /api/profile/agents:
 *   get:
 *     summary: Get public agents
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Public agents returned successfully
 */
router.get("/agents", getPublicAgents);

/**
 * @swagger
 * /api/profile/agents/{id}:
 *   get:
 *     summary: Get a public agent by ID
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent ID
 *     responses:
 *       200:
 *         description: Agent returned successfully
 *       404:
 *         description: Agent not found
 */
router.get("/agents/:id", getPublicAgent);

/**
 * @swagger
 * /api/profile/avatar:
 *   post:
 *     summary: Update the current user's avatar
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the user's avatar
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: Invalid avatar or upload data
 *       401:
 *         description: Authentication required
 */
router.post(
  "/avatar",
  authenticate,
  uploadAvatarMiddleware.single("avatar"),
  updateAvatar,
);

/**
 * @swagger
 * /api/profile/email:
 *   put:
 *     summary: Change the current user's email
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email updated successfully
 *       400:
 *         description: Invalid email data
 *       401:
 *         description: Authentication required
 */
router.put("/email", authenticate, changeEmail);

/**
 * @swagger
 * /api/profile/password:
 *   put:
 *     summary: Change the current user's password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid password data
 *       401:
 *         description: Authentication required
 */
router.put("/password", authenticate, changePassword);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update the current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid profile data
 *       401:
 *         description: Authentication required
 */
router.put("/", authenticate, updateProfileData);

export default router;

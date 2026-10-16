import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { requireAdmin } from "../../auth/middleware/admin.middleware.js";

import {
  deletePropertyByAdmin,
  getUsersForAdmin,
  updateUserBlockStatus,
} from "../controllers/admin.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations
 */

// All routes below require authentication and administrator privileges.
router.use(authenticate, requireAdmin);

router.get("/check", (_req, res) => {
  res.status(200).json({
    message: "Admin access granted",
  });
});

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users for administration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get("/users", getUsersForAdmin);

/**
 * @swagger
 * /api/admin/users/{id}/block:
 *   patch:
 *     summary: Block or unblock a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isBlocked
 *             properties:
 *               isBlocked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User block status updated
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: User not found
 */
router.patch("/users/:id/block", updateUserBlockStatus);

/**
 * @swagger
 * /api/admin/properties/{id}:
 *   delete:
 *     summary: Delete a property as an administrator
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 */
router.delete("/properties/:id", deletePropertyByAdmin);

export default router;

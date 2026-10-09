
import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { requireAdmin } from "../../auth/middleware/admin.middleware.js";

import { deletePropertyByAdmin } from "../controllers/admin.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations
 */

// All routes below require authentication and administrator privileges.
router.use(authenticate, requireAdmin);

/**
 * @swagger
 * /api/admin/check:
 *   get:
 *     summary: Check administrator access
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Administrator access granted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Administrator privileges required
 */
router.get("/check", (_req, res) => {
  res.status(200).json({
    message: "Admin access granted",
  });
});

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
 *         description: ID of the property to delete
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Administrator privileges required
 *       404:
 *         description: Property not found
 */
router.delete("/properties/:id", deletePropertyByAdmin);

export default router;

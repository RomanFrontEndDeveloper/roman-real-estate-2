import { Router } from "express";

import {
  getCurrentUser,
  login,
  logout,
  refresh,
  register,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/registerController.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and account management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration data
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset request processed
 */
router.post("/forgot-password", forgotPasswordController);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset a password
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset processed
 *       400:
 *         description: Invalid or expired reset token
 */
router.post("/reset-password", resetPasswordController);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       401:
 *         description: Refresh token missing or invalid
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /api/auth/protected:
 *   get:
 *     summary: Test protected access
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Authentication required
 */
router.get("/protected", authenticate, (_req, res) => {
  res.status(200).json({
    message: "You have access to this protected route",
  });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user returned
 *       401:
 *         description: Authentication required
 */
router.get("/me", authenticate, getCurrentUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout processed
 */
router.post("/logout", logout);

export default router;

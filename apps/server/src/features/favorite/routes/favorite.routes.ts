import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import {
  getFavoritesController,
  getFavoritePropertiesController,
  addFavoriteController,
  removeFavoriteController,
} from "../controllers/favorite.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Favorite
 *   description: Manage a user's favorite properties
 */

/**
 * @swagger
 * /api/favorites/properties:
 *   get:
 *     summary: Get favorite property listings
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorite properties returned successfully
 *       401:
 *         description: Authentication required
 */
router.get("/properties", authenticate, getFavoritePropertiesController);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get the current user's favorites
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites returned successfully
 *       401:
 *         description: Authentication required
 */
router.get("/", authenticate, getFavoritesController);

/**
 * @swagger
 * /api/favorites/{propertyId}:
 *   post:
 *     summary: Add a property to favorites
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the property to add
 *     responses:
 *       200:
 *         description: Property added to favorites
 *       400:
 *         description: Invalid property ID or request
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Property not found
 */
router.post("/:propertyId", authenticate, addFavoriteController);

/**
 * @swagger
 * /api/favorites/{propertyId}:
 *   delete:
 *     summary: Remove a property from favorites
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the property to remove
 *     responses:
 *       200:
 *         description: Property removed from favorites
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Favorite not found
 */
router.delete("/:propertyId", authenticate, removeFavoriteController);

export default router;

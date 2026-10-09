import { Router } from "express";

import {
  createProperty,
  getProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { validateCreateProperty } from "../middleware/validate-create.property.js";
import { uploadPropertyImages } from "../middleware/upload-property-images.js";
import { validatePropertyLocation } from "../middleware/validate-property-location.js";
import { validateUpdateProperty } from "../dto/validate-update-property.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Property
 *   description: Real estate property listings
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get property listings
 *     tags: [Property]
 *     responses:
 *       200:
 *         description: Property listings returned successfully
 */
router.get("/", getProperties);

/**
 * @swagger
 * /api/properties/my:
 *   get:
 *     summary: Get the current user's properties
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User properties returned successfully
 *       401:
 *         description: Authentication required
 */
router.get("/my", authenticate, getMyProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get a property by ID
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property returned successfully
 *       404:
 *         description: Property not found
 */
router.get("/:id", getPropertyById);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a property listing
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Invalid property data
 *       401:
 *         description: Authentication required
 */
router.post(
  "/",
  authenticate,
  uploadPropertyImages,
  validateCreateProperty,
  validatePropertyLocation,
  createProperty,
);

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update a property listing
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       400:
 *         description: Invalid property data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Property not found
 */
router.put(
  "/:id",
  authenticate,
  uploadPropertyImages,
  validateUpdateProperty,
  validatePropertyLocation,
  updateProperty,
);

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete a property listing
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Property not found
 */
router.delete("/:id", authenticate, deleteProperty);

export default router;

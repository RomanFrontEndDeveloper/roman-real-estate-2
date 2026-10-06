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

router.get("/", getProperties);

router.get("/my", authenticate, getMyProperties);

router.get("/:id", getPropertyById);

router.post(
  "/",
  authenticate,
  uploadPropertyImages,
  validateCreateProperty,
  validatePropertyLocation,
  createProperty,
);

router.put(
  "/:id",
  authenticate,
  uploadPropertyImages,
  validateUpdateProperty,
  validatePropertyLocation,
  updateProperty,
);

router.delete("/:id", authenticate, deleteProperty);

export default router;

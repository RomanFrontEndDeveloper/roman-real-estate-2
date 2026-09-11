import { Router } from "express";

import {
  createProperty,
  getProperties,
  getMyProperties,
  getPropertyById,
} from "../controllers/property.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { validateCreateProperty } from "../middleware/validate-create.property.js";
import { uploadPropertyImages } from "../middleware/upload-property-images.js";

const router = Router();

router.get("/", getProperties);

router.get("/my", authenticate, getMyProperties);

router.get("/:id", getPropertyById);

router.post(
  "/",
  authenticate,
  uploadPropertyImages,
  validateCreateProperty,
  createProperty,
);

export default router;

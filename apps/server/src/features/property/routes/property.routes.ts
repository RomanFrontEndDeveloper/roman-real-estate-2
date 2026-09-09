import { Router } from "express";

import {
  createProperty,
  getProperties,
  getPropertyById,
} from "../controllers/property.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { validateCreateProperty } from "../middleware/validate-create.property.js";

const router = Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", authenticate, validateCreateProperty, createProperty);

export default router;

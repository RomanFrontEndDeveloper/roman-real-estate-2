import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import {
  getFavoritesController,
  getFavoritePropertiesController,
  addFavoriteController,
  removeFavoriteController,
} from "../controllers/favorite.controller.js";

const router = Router();

router.get("/properties", authenticate, getFavoritePropertiesController);

router.get("/", authenticate, getFavoritesController);

router.post("/:propertyId", authenticate, addFavoriteController);

router.delete("/:propertyId", authenticate, removeFavoriteController);

export default router;

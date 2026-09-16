import { Router } from "express";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import {
  addFavoriteController,
  removeFavoriteController,
} from "../controllers/favorite.controller.js";

const router = Router();

router.post("/:propertyId", authenticate, addFavoriteController);

router.delete("/:propertyId", authenticate, removeFavoriteController);

export default router;

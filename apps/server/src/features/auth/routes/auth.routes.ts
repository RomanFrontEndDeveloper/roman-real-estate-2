import { Router } from "express";

import {
  getCurrentUser,
  login,
  logout,
  refresh,
  register,
} from "../controllers/registerController.js";

import { authenticate } from "../middleware/auth.middleware.js";
import {
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/registerController.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/refresh", refresh);

router.get("/protected", authenticate, (_req, res) => {
  res.status(200).json({
    message: "You have access to this protected route",
  });
});

router.get("/me", authenticate, getCurrentUser);
router.post("/logout", logout);

export default router;

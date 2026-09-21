import { Router } from "express";

import {
  updateAvatar,
  updateProfileData,
  changeEmail,
  changePassword,
  getPublicAgents,
  getPublicAgent,
} from "../controllers/profile.controller.js";

import { uploadAvatar as uploadAvatarMiddleware } from "../middleware/upload.middleware.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

router.get("/agents", getPublicAgents);

router.get("/agents/:id", getPublicAgent);

router.post(
  "/avatar",
  authenticate,
  uploadAvatarMiddleware.single("avatar"),
  updateAvatar,
);

router.put("/email", authenticate, changeEmail);

router.put("/password", authenticate, changePassword);

router.put("/", authenticate, updateProfileData);

export default router;

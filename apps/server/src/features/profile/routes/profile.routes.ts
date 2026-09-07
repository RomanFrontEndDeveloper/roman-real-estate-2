import { Router } from "express";

import {
  updateAvatar,
  updatePreferences,
  updateProfileData,
  changeEmail,
  changePassword,
} from "../controllers/profile.controller.js";

import { uploadAvatar as uploadAvatarMiddleware } from "../middleware/upload.middleware.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

router.post(
  "/avatar",
  authenticate,
  uploadAvatarMiddleware.single("avatar"),
  updateAvatar,
);

router.put("/email", authenticate, changeEmail);

router.put("/password", authenticate, changePassword);

router.put("/preferences", authenticate, updatePreferences);

router.put("/", authenticate, updateProfileData);

export default router;

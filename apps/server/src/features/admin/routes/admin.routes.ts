import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { requireAdmin } from "../../auth/middleware/admin.middleware.js";

import { deletePropertyByAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/check", (req, res) => {
  res.status(200).json({
    message: "Admin access granted",
  });
});

router.delete("/properties/:id", deletePropertyByAdmin);

export default router;

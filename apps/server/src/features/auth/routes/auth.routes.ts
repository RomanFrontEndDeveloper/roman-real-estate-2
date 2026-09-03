import { Router } from "express";
import { login, refresh, register } from "../controllers/registerController.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

router.get("/test-auth", authenticate, (req, res) => {
  res.status(200).json({
    message: "Authentication successful",
    user: req.user,
  });
});

export default router;

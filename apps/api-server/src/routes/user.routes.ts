import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getCurrentUser, signin, signup } from "../controllers/user.controller";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/me").get(authMiddleware, getCurrentUser);

export default router as Router;

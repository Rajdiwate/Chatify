import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getCurrentUser,
  getFriends,
  getPendingRequests,
  signin,
  signup,
  getAllUsers,
  logout
} from "../controllers/user.controller";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/me").get(authMiddleware, getCurrentUser);
router.route("/friends").get(authMiddleware, getFriends);
router.route("/requests/pending").get(authMiddleware, getPendingRequests);
router.route("/all-users").get(authMiddleware, getAllUsers);
router.route("/logout").delete(authMiddleware, logout);

export default router as Router;

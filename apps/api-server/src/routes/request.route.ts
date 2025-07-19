import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { acceptRequest, sendRequest } from "../controllers/request.controller";

const router = Router();

router.route("/send").post(authMiddleware, sendRequest);
router.route("/accept").post(authMiddleware, acceptRequest);

export default router as Router
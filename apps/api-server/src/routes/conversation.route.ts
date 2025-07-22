import { Router } from "express";
import { getAllConversation } from "../controllers/conversation.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.route("/conversation").post(authMiddleware, getAllConversation);

export default router;

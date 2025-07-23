import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getMessages } from "../controllers/messages.controller";

const router: Router = Router();

router.route("/messages").post(authMiddleware, getMessages);

export default router;

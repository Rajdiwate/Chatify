import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { acceptInvite, createGroup, getPendingGroupInvites, invitToGroup } from "../controllers/groups.controller";

const router : Router = Router();


router.route('/group/create').post(authMiddleware , createGroup);
router.route('/group/invite').post(authMiddleware , invitToGroup);
router.route('/group/invite/accept').post(authMiddleware , acceptInvite);
router.route('/group/invites/pending').get(authMiddleware , getPendingGroupInvites);


export default router
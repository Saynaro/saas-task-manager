import express from "express";
import { inviteMember, acceptInvitation, revokeInvitation, declineInvitation, getMyInvitations } from "../controllers/invitationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);


router.get("/my", getMyInvitations);

router.post("/send", inviteMember);
router.post("/:invitationId/accept", acceptInvitation);
router.post("/:invitationId/decline", declineInvitation); // USER DECLINES INVITATION

router.delete("/:invitationId/revoke", revokeInvitation); // OWNER REVOKES INVITATION


export default router;
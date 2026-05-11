import { prisma } from "../config/db.js";


// --- INVITE MEMBER ---
export const inviteMember = async (req, res) => {
    const { email, role = "MEMBER", workspaceId: bodyWorkspaceId } = req.body;
    
    // Prioritize workspaceId from body, then fallback to user's primary workspace
    const workspaceId = bodyWorkspaceId || req.user.workspace?.id;

    if (!workspaceId) {
        return res.status(400).json({ error: "Please select a workspace to invite" });
    }

    try {
        // Check if the inviter has the right to invite (OWNER or ADMIN)
        const inviterMember = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: req.user.id,
                    workspaceId: workspaceId,
                },
            },
        });

        if (!inviterMember || (inviterMember.role !== "OWNER" && inviterMember.role !== "ADMIN")) {
            return res.status(403).json({ error: "Only owners and admins can invite members" });
        }

        if (email === req.user.email) {
            return res.status(400).json({ error: "You cannot invite yourself" });
        }

        // Check if the user is already a member
        const existingMember = await prisma.user.findUnique({
            where: { email },
            include: {
                workspaces: {
                    where: {
                        workspaceId: workspaceId
                    }
                }
            }
        });

        if (existingMember?.workspaces.length > 0) {
            return res.status(400).json({ error: "User is already a member of this workspace" });
        }


        // Create an invitation (or update an old one if it existed)
        // upsert = update or insert
        const invitation = await prisma.invitation.upsert({
            where: {
                email_workspaceId: {
                    email,
                    workspaceId: workspaceId
                }
            },
            update: {
                status: "PENDING",
                role,
                userId: existingMember?.id || null,
            }, // If sent again
            create: {
                email,
                role,
                workspaceId: workspaceId,
                inviterId: req.user.id,
                userId: existingMember?.id || null,
            },
        });

        res.status(201).json({ message: "Invitation sent successfully", invitation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error sending invitation" });
    }
};



// --- ACCEPT INVITATION ---
export const acceptInvitation = async (req, res) => {
    const { invitationId } = req.params;
    const userId = req.user.id;
    const userEmail = req.user.email;

    try {
        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
        });

        if (!invitation || invitation.status !== "PENDING") {
            return res.status(404).json({ error: "Invitation not found or invalid" });
        }

        // Security: email in invite must match current user's email
        if (invitation.email !== userEmail) {
            return res.status(403).json({ error: "This invitation is not for your account" });
        }

        // Transaction: Add to workspace + Close invite
        await prisma.$transaction([
            prisma.workspaceMember.create({
                data: {
                    userId,
                    workspaceId: invitation.workspaceId,
                    role: invitation.role,
                },
            }),
            prisma.invitation.update({
                where: { id: invitationId },
                data: { status: "ACCEPTED" },
            }),
        ]);

        res.json({ message: "You have successfully joined the workspace!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to accept invitation" });
    }
};



// --- OWNER REVOKES INVITATION ---
export const revokeInvitation = async (req, res) => {
    const { invitationId } = req.params;
    const { workspace } = req.user;

    // Check if the workspace is selected
    if (!workspace) {
        return res.status(400).json({ error: "No workspace selected" });
    }

    try {
        // Check if the inviter has the right to invite (OWNER or ADMIN)
        const inviterMember = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: req.user.id,
                    workspaceId: workspace.id
                }
            }
        });

        if (!inviterMember || inviterMember.role === "MEMBER") {
            return res.status(403).json({ error: "No rights to delete invitations" });
        }

        // Try to delete
        await prisma.invitation.delete({
            where: {
                id: invitationId,
                workspaceId: workspace.id // Ensures we delete the invite only from our workspace
            }
        });

        res.json({ message: "Invitation revoked successfully" });

    } catch (error) {
        // Check if the invitation was not found in this workspace
        // P2025 = Record to delete does not exist
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Invitation not found in this workspace" });
        }

        console.error("Revoke Error:", error);
        res.status(500).json({ error: "Failed to revoke invitation" });
    }
};



// --- USER DECLINES INVITATION ---
export const declineInvitation = async (req, res) => {
    const { invitationId } = req.params;
    const userEmail = req.user.email;

    try {
        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId }
        });

        if (!invitation || invitation.email !== userEmail) {
            return res.status(403).json({ error: "This invitation is not for your account" });
        }

        // Either delete or change status to DECLINED
        await prisma.invitation.update({
            where: { id: invitationId },
            data: { status: "DECLINED" }
        });

        res.json({ message: "Invitation declined" });
    } catch (error) {
        res.status(500).json({ error: "Failed to decline invitation" });
    }
};




// --- GET MY INVITATIONS ---
export const getMyInvitations = async (req, res) => {
    try {
        const invitations = await prisma.invitation.findMany({
            where: {
                email: req.user.email,
                status: "PENDING"
            },
            include: {
                workspace: { select: { name: true } },
                inviter: { select: { firstName: true, lastName: true } }
            }
        });
        res.json(invitations);
    } catch (error) {
        res.status(500).json({ error: "Failed to get invitations" });
    }
};
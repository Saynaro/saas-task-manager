import { prisma } from "../config/db.js";

export const getWorkspaceMembers = async (req, res) => {
    try {
        const workspaceId = req.user?.workspace?.id;

        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace not selected" });
        }

        const members = await prisma.workspaceMember.findMany({
            where: { workspaceId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            }
        });


        // Format response
        const formattedMembers = members.map(m => ({
            id: m.user.id,
            fullName: `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() || m.user.email,
            email: m.user.email,
            avatarUrl: m.user.avatarUrl,
            role: m.role    // role in workspace
        }));

        res.status(200).json(formattedMembers);
    } catch (error) {
        console.error("GET MEMBERS ERROR:", error);
        res.status(500).json({ error: "Failed to fetch workspace members" });
    }
};
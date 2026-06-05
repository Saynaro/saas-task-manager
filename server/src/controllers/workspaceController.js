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
                },
                workspace: {
                    select: {
                        creatorId: true
                    }
                }
            }
        });

        // Format response and calculate stats
        const formattedMembers = await Promise.all(members.map(async (m) => {
            const [pendingCount, inProgressCount, completedCount] = await Promise.all([
                prisma.project.count({
                    where: {
                        workspaceId,
                        status: 'TODO',
                        members: {
                            some: { userId: m.user.id }
                        }
                    }
                }),
                prisma.project.count({
                    where: {
                        workspaceId,
                        status: 'IN_PROGRESS',
                        members: {
                            some: { userId: m.user.id }
                        }
                    }
                }),
                prisma.task.count({
                    where: {
                        workspaceId,
                        assigneeId: m.user.id,
                        status: 'DONE'
                    }
                })
            ]);

            return {
                id: m.user.id,
                fullName: `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() || m.user.email,
                email: m.user.email,
                avatarUrl: m.user.avatarUrl,
                role: m.role,
                isCreator: m.user.id === m.workspace.creatorId,
                pending: pendingCount,
                inProgress: inProgressCount,
                completed: completedCount
            };
        }));

        res.status(200).json(formattedMembers);
    } catch (error) {
        console.error("GET MEMBERS ERROR:", error);
        res.status(500).json({ error: "Failed to fetch workspace members" });
    }
};
export const updateWorkspace = async (req, res) => {
    try {
        const { name, slug } = req.body;
        const workspaceId = req.user?.workspace?.id;
        const avatarUrl = req.file ? req.file.path : undefined;

        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace not selected" });
        }

        // Check permissions (only OWNER can update workspace identity)
        const member = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: req.user.id,
                    workspaceId: workspaceId
                }
            }
        });

        if (!member || member.role !== 'OWNER') {
            return res.status(403).json({ error: "Only owners can update workspace settings" });
        }

        // Check if slug is taken by another workspace
        if (slug) {
            const existing = await prisma.workspace.findFirst({
                where: {
                    slug: slug,
                    id: { not: workspaceId }
                }
            });
            if (existing) {
                return res.status(400).json({ error: "Workspace URL (slug) is already taken" });
            }
        }

        const updated = await prisma.workspace.update({
            where: { id: workspaceId },
            data: {
                ...(name !== undefined && { name }),
                ...(slug !== undefined && { slug }),
                ...(avatarUrl !== undefined && { avatarUrl }),
            }
        });

        res.status(200).json({ message: "Workspace updated successfully", workspace: updated });
    } catch (error) {
        console.error("UPDATE WORKSPACE ERROR:", error);
        res.status(500).json({ error: "Failed to update workspace" });
    }
};

export const removeMember = async (req, res) => {
    try {
        const { userId } = req.params;
        const workspaceId = req.user?.workspace?.id;

        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace not selected" });
        }

        // Check if inviter is OWNER
        const requester = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: req.user.id,
                    workspaceId: workspaceId
                }
            }
        });

        if (!requester || requester.role !== 'OWNER') {
            return res.status(403).json({ error: "Only owners can remove members" });
        }

        // Fetch workspace to get creatorId
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { creatorId: true }
        });

        if (userId === workspace.creatorId) {
            return res.status(400).json({ error: "Cannot remove the workspace owner (creator)" });
        }

        await prisma.workspaceMember.delete({
            where: {
                userId_workspaceId: {
                    userId: userId,
                    workspaceId: workspaceId
                }
            }
        });

        res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        console.error("REMOVE MEMBER ERROR:", error);
        res.status(500).json({ error: "Failed to remove member" });
    }
};

export const createWorkspace = async (req, res) => {
    try {
        let { name, slug, invites } = req.body;
        const userId = req.user.id;
        const avatarUrl = req.file ? req.file.path : null;

        if (typeof invites === 'string') {
            try {
                invites = JSON.parse(invites);
            } catch (e) {
                invites = [];
            }
        }
        if (!invites) invites = [];

        if (!name || !slug) {
            return res.status(400).json({ error: "Name and slug are required" });
        }

        const workspace = await prisma.$transaction(async (tx) => {
            const newWs = await tx.workspace.create({
                data: {
                    name,
                    slug,
                    avatarUrl,
                    creatorId: userId
                }
            });

            await tx.workspaceMember.create({
                data: {
                    userId,
                    workspaceId: newWs.id,
                    role: "OWNER"
                }
            });

            if (invites.length > 0) {
                await tx.invitation.createMany({
                    data: invites.map(email => ({
                        email,
                        workspaceId: newWs.id,
                        inviterId: userId,
                        role: "MEMBER"
                    }))
                });
            }

            return newWs;
        });

        res.status(201).json({
            status: "success",
            data: workspace
        });

    } catch (error) {
        console.error("CREATE WORKSPACE ERROR:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Slug already in use" });
        }
        res.status(500).json({ error: "Failed to create workspace" });
    }
};

export const getWorkspaceActivity = async (req, res) => {
    try {
        const workspaceId = req.user?.workspace?.id;
        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace not selected" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const activities = await prisma.activityLog.findMany({
            where: { workspaceId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                        email: true
                    }
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                        projectId: true,
                        project: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        });

        // Check if there are more items beyond current page
        const nextActivities = await prisma.activityLog.findMany({
            where: { workspaceId },
            skip: skip + limit,
            take: 1,
            select: { id: true }
        });
        const hasMore = nextActivities.length > 0;

        res.status(200).json({ status: "success", data: activities, hasMore });
    } catch (error) {
        console.error("GET WORKSPACE ACTIVITY ERROR:", error);
        res.status(500).json({ error: "Failed to fetch workspace activity logs" });
    }
};

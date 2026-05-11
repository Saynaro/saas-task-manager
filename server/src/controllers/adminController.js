import { prisma } from "../config/db.js";

export const getGlobalStats = async (req, res) => {
    try {
        // Only actual ADMIN role can see global stats
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Access denied" });
        }

        const stats = await prisma.$transaction([
            prisma.user.count(),
            prisma.workspace.count(),
            prisma.project.count(),
            prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.task.count({ where: { status: 'DONE' } }),
            prisma.task.count({ where: { status: 'TODO' } }),
            prisma.workspace.findMany({
                include: {
                    creator: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    },
                    _count: {
                        select: {
                            members: true,
                            projects: true
                        }
                    }
                }
            })
        ]);

        const [
            totalUsers, 
            totalWorkspaces, 
            totalProjects,
            activeTasks,
            completedTasks,
            pendingTasks,
            workspaces
        ] = stats;

        const formattedWorkspaces = workspaces.map(ws => ({
            id: ws.id,
            name: ws.name,
            owner: `${ws.creator?.firstName || ''} ${ws.creator?.lastName || ''}`.trim() || 'System',
            membersCount: ws._count.members,
            projectsCount: ws._count.projects
        }));

        res.status(200).json({
            totalUsers,
            totalWorkspaces,
            totalProjects,
            activeTasks,
            completedTasks,
            pendingTasks,
            workspaces: formattedWorkspaces
        });
    } catch (error) {
        console.error("ADMIN STATS ERROR:", error);
        res.status(500).json({ error: "Failed to fetch admin stats" });
    }
};

export const deleteWorkspace = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;

        await prisma.workspace.delete({
            where: { id }
        });

        res.status(200).json({ message: "Workspace deleted successfully" });
    } catch (error) {
        console.error("DELETE WORKSPACE ERROR:", error);
        res.status(500).json({ error: "Failed to delete workspace" });
    }
};

import { prisma } from "../config/db.js";
import { io } from "../server.js";

export const logActivity = async ({ action, oldValue, newValue, userId, workspaceId, taskId }) => {
    try {
        const log = await prisma.activityLog.create({
            data: {
                action,
                oldValue,
                newValue,
                userId,
                workspaceId,
                taskId
            },
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
            }
        });

        // Find project ID to broadcast to the specific project channel
        let projectId = log.task?.projectId;
        if (!projectId && taskId) {
            const t = await prisma.task.findUnique({
                where: { id: taskId },
                select: { projectId: true }
            });
            projectId = t?.projectId;
        }

        if (projectId) {
            // Send to project chat / modal listeners
            io.to(`project:${projectId}`).emit("new_activity", log);
        }

        // Send to general workspace listeners (like sidebar or toasts)
        io.to(`workspace:${workspaceId}`).emit("workspace_activity", log);

        return log;
    } catch (err) {
        console.error("Activity logging error:", err);
    }
};

import { prisma } from "../config/db.js";
import { io } from "../server.js";
import { logActivity } from "../utils/activityLogger.js";



//////GET PROJECT COMMENTS////////
export const getProjectComments = async (req, res) => {
    const { projectId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: {
                task: {
                    projectId
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    }
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        });
        res.status(200).json({
            status: "success",
            data: comments
        });

    } catch (error) {
        console.log("GET PROJECT COMMENTS ERROR", error);
        res.status(500).json({ error: "Failed to load comments" });
    }
};



//////CREATE COMMENT////////
export const createComment = async (req, res) => {
    const { projectId } = req.params;
    const { taskId, content } = req.body;
    const userId = req.user.id;

    if (!content?.trim()) {
        return res.status(400).json({ error: "Comment cannot be empty" });
    }

    if (!taskId) {
        return res.status(400).json({ error: "taskId is required" });
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                taskId,
                userId,
                content
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    }
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                        workspaceId: true
                    }
                }
            }
        });

        // send to  room for real time updates
        io.to(`project:${projectId}`).emit("new_comment", comment);

        // Log comment creation activity
        await logActivity({
            action: "COMMENT_ADDED",
            newValue: content,
            userId,
            workspaceId: comment.task?.workspaceId || req.user?.workspace?.id,
            taskId
        });

        res.status(201).json({
            status: "success",
            data: comment
        });
    } catch (error) {
        console.log("CREATE COMMENT ERROR", error);
        res.status(500).json({
            error: "Failed to create comment"
        });
    }
};
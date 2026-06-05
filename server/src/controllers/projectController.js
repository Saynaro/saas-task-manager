import { prisma } from "../config/db.js";
import { logActivity } from "../utils/activityLogger.js";

export const createProjectWithAllDetails = async (req, res) => {
    try {
        const {
            name,
            description,
            memberIds = [], // Set default value: if undefined, it will be an empty array
            tasks = [],
            dueDate,
            status,
            priority
        } = req.body;

        const creatorId = req.user?.id;
        // const creatorId = "3f2308a8-6f22-4485-81d8-faf53636042b";
        if (!creatorId) {
            return res.status(401).json({ error: "Unauthorized" });
        }


        const workspaceId = req.user?.workspace?.id;
        if (!workspaceId && req.user.role !== 'ADMIN') {
            return res.status(400).json({ error: "User must be part of a workspace to create projects" });
        }

        // Remove duplicates and filter empty values, if any
        const allMemberIds = Array.from(new Set([...memberIds, creatorId])).filter(Boolean);

        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                workspaceId: workspaceId,
                dueDate: dueDate ? new Date(dueDate) : null,
                status: status || "TODO",
                priority: priority || "LOW",
                creatorId: creatorId,

                members: {
                    create: allMemberIds.map(id => ({
                        userId: id
                    }))
                },
                tasks: {
                    create: tasks.map((task, index) => ({
                        title: task.title,
                        workspaceId: workspaceId,
                        creatorId: creatorId,
                        order: index * 1000,
                        status: "TODO",
                        dueDate: dueDate ? new Date(dueDate) : null
                    }))
                },
            },
            include: {
                tasks: {
                    orderBy: {
                        order: 'asc'
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true
                            }
                        }
                    }
                }
            }
        });

        res.status(201).json({
            status: "success", data: newProject
        });
    } catch (error) {
        console.error("CREATE PROJECT ERROR:", error.message, error.stack);
        res.status(500).json({ error: error.message });
    }
};



export const getProjects = async (req, res) => {
    try {
        const userId = req.user?.id;
        const workspaceId = req.user?.workspace?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        let whereClause = {
            workspaceId: workspaceId,
            members: {
                some: { userId: userId }
            }
        };

        const projects = await prisma.project.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                tasks: {
                    orderBy: {
                        order: 'asc'
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                        members: true
                    }
                }
            }
        });



        res.status(200).json({
            status: "success", data: projects
        });
    } catch (error) {
        console.error("GET PROJECTS ERROR:", error);
        res.status(500).json({ error: "Internal server error during project retrieval" });
    }
};


export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        // Add memberIds from the request body
        const { name, description, dueDate, status, priority, tasks, memberIds } = req.body;

        const project = await prisma.project.findFirst({
            where: { id, workspaceId: req.user?.workspace?.id }
        });

        if (!project) return res.status(404).json({ error: "Project not found" });

        const activitiesToLog = [];

        const updatedProjectWithDetails = await prisma.$transaction(async (tx) => {
            // Update basic fields properly - only if defined
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (status !== undefined) updateData.status = status;
            if (priority !== undefined) updateData.priority = priority;
            if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

            await tx.project.update({
                where: { id },
                data: updateData
            });

            //  Update members (Sync)
            if (memberIds !== undefined) {
                // Delete all current project members
                await tx.projectMember.deleteMany({
                    where: { projectId: id }
                });

                // add new list of members
                await tx.projectMember.createMany({
                    data: memberIds.map(mId => ({
                        userId: mId,
                        projectId: id
                    }))
                });
            }

            //  Update tasks (Checklist)
            if (tasks !== undefined) {
                const existingTasks = await tx.task.findMany({ where: { projectId: id } });

                const keptTaskIds = [];
                const tasksToSync = tasks.map((t, index) => {
                    const matchedTask = existingTasks.find(et =>
                        (t.id && et.id === t.id) ||
                        (!keptTaskIds.includes(et.id) && et.title === t.title)
                    );

                    let assigneeId = null;
                    if (matchedTask) {
                        keptTaskIds.push(matchedTask.id);
                        if (matchedTask.status === 'TODO' && t.status === 'DONE') {
                            assigneeId = userId;
                        } else if (matchedTask.status === 'DONE' && t.status === 'TODO') {
                            assigneeId = null;
                        } else {
                            assigneeId = matchedTask.assigneeId;
                        }

                        const hasStatusChanged = matchedTask.status !== (t.status || "TODO");

                        return {
                            id: matchedTask.id,
                            title: t.title,
                            status: t.status || "TODO",
                            projectId: id,
                            creatorId: matchedTask.creatorId,
                            assigneeId: assigneeId,
                            order: index * 1000,
                            workspaceId: project.workspaceId,
                            isNew: false,
                            statusChanged: hasStatusChanged,
                            oldStatus: matchedTask.status,
                            newStatus: t.status || "TODO"
                        };
                    } else {
                        if (t.status === 'DONE') {
                            assigneeId = userId;
                        }
                        return {
                            title: t.title,
                            status: t.status || "TODO",
                            projectId: id,
                            creatorId: userId,
                            assigneeId: assigneeId,
                            order: index * 1000,
                            workspaceId: project.workspaceId,
                            isNew: true
                        };
                    }
                });

                //  Delete tasks that are no longer in the payload
                const tasksToDelete = existingTasks.filter(et => !keptTaskIds.includes(et.id));
                if (tasksToDelete.length > 0) {
                    await tx.task.deleteMany({
                        where: {
                            id: { in: tasksToDelete.map(t => t.id) }
                        }
                    });
                }

                //  Update existing and create new
                for (const t of tasksToSync) {
                    if (t.isNew) {
                        const { isNew, ...createData } = t;
                        const createdTask = await tx.task.create({
                            data: createData
                        });
                        activitiesToLog.push({
                            action: "TASK_CREATED",
                            newValue: createdTask.title,
                            userId,
                            workspaceId: project.workspaceId || req.user?.workspace?.id,
                            taskId: createdTask.id
                        });
                    } else {
                        const { id: taskId, isNew, statusChanged, oldStatus, newStatus, ...updateData } = t;
                        await tx.task.update({
                            where: { id: taskId },
                            data: updateData
                        });

                        if (statusChanged) {
                            activitiesToLog.push({
                                action: newStatus === "DONE" ? "TASK_COMPLETED" : "TASK_UNCOMPLETED",
                                oldValue: oldStatus,
                                newValue: newStatus,
                                userId,
                                workspaceId: project.workspaceId || req.user?.workspace?.id,
                                taskId
                            });
                        }
                    }
                }
            }

            return await tx.project.findUnique({
                where: { id },
                include: { tasks: true, members: { include: { user: true } } }
            });
        });

        // Run activity logs after transaction completes successfully
        for (const act of activitiesToLog) {
            await logActivity(act);
        }

        res.json({ status: "success", data: updatedProjectWithDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const project = await prisma.project.findFirst({
            where: {
                id,
                members: {
                    some: {
                        userId: userId
                    }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ error: "Project not found or access denied" });
        }

        await prisma.project.delete({
            where: {
                id
            }
        });

        res.status(200).json({
            status: "success", data: {}
        });
    } catch (error) {
        console.error("DELETE PROJECT ERROR:", error);
        res.status(500).json({ error: "Internal server error during project deletion" });
    }
};

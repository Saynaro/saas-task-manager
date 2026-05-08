import { prisma } from "../config/db.js";

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


        // TODO: implement workspaceId
        // let actualWorkspaceId = workspaceId;
        // if (!actualWorkspaceId) {
        //     const userWs = await prisma.workspaceMember.findFirst({
        //         where: { userId: creatorId }
        //     });
        //     actualWorkspaceId = userWs ? userWs.workspaceId : null;
        // }

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

        let whereClause = {};

        if (req.user.role === 'ADMIN') {
            // Admin sees all projects
            whereClause = {};
        } else if (req.user.role === 'OWNER') {
            // Owner sees all projects in THEIR workspace
            whereClause = { workspaceId: workspaceId };
        } else {
            // Member sees only projects they are members of in their workspace
            whereClause = {
                workspaceId: workspaceId,
                members: {
                    some: {
                        userId: userId
                    }
                }
            };
        }

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
        const { name, description, dueDate, status, priority, tasks } = req.body;

        // Check if the project exists and the user is a member
        const project = await prisma.project.findFirst({
            where: {
                id,
                members: {
                    some: { userId }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ error: "Project not found or access denied" });
        }

        // Use a transaction to update project and its tasks atomically
        const updatedProjectWithDetails = await prisma.$transaction(async (tx) => {
            // Update the project basic fields
            await tx.project.update({
                where: { id },
                data: {
                    ...(name !== undefined && { name }),
                    ...(description !== undefined && { description }),
                    ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
                    ...(status !== undefined && { status }),
                    ...(priority !== undefined && { priority }),
                }
            });

            // If tasks are provided, sync them (replace-all strategy for checklists)
            if (tasks !== undefined) {
                // Delete existing tasks
                await tx.task.deleteMany({
                    where: { projectId: id }
                });

                // Create new tasks from the checklist
                if (tasks.length > 0) {
                    await tx.task.createMany({
                        data: tasks.map((task, index) => ({
                            title: task.title,
                            projectId: id,
                            creatorId: userId,
                            status: task.status || "TODO",
                            order: index * 1000
                        }))
                    });
                }
            }

            // Fetch the fully updated object with relations
            return await tx.project.findUnique({
                where: { id },
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
        });

        res.status(200).json({
            status: "success", data: updatedProjectWithDetails
        });
    } catch (error) {
        console.error("UPDATE PROJECT ERROR:", error);
        res.status(500).json({ error: "Internal server error during project update" });
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

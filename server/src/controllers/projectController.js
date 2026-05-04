import { prisma } from "../config/db.js";

export const createProjectWithAllDetails = async (req, res) => {
    try {
        const {
            name,
            description,
            workspaceId,
            memberIds = [], // Set default value: if undefined, it will be an empty array
            tasks = [],     // Set default value: if empty checklist, it will be an empty array
            dueDate,
            status,
            priority
        } = req.body;

        const creatorId = req.user?.id;
        // const creatorId = "3f2308a8-6f22-4485-81d8-faf53636042b";
        if (!creatorId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Remove duplicates and filter empty values, if any
        const allMemberIds = Array.from(new Set([...memberIds, creatorId])).filter(Boolean);

        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                workspaceId,
                dueDate: dueDate ? new Date(dueDate) : null,
                status,
                priority,

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
        console.error("CREATE PROJECT ERROR:", error);
        res.status(500).json({ error: "Internal server error during project creation" });
    }
};



export const getProjects = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const projects = await prisma.project.findMany({
            where: {
                members: {
                    some: {
                        userId: userId
                    }
                }
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
        const { name, description, dueDate, status, priority } = req.body;

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

        // Update only the fields that were passed
        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
                ...(status !== undefined && { status }),
                ...(priority !== undefined && { priority }),
            }
        });

        res.status(200).json({
            status: "success", data: updatedProject
        });
    } catch (error) {
        console.error("UPDATE PROJECT ERROR:", error);
        res.status(500).json({ error: "Internal server error during project update" });
    }
};
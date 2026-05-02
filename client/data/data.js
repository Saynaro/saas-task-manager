export const data = {
  users: [
    {
      id: "u1",
      email: "khalid@example.com",
      firstName: "Khalid",
      lastName: "Sainaro",
    },
  ],

  workspaces: [
    {
      id: "ws1",
      name: "Main Workspace",
      slug: "main-workspace",
      ownerId: "u1",
      members: [
        {
          id: "wm1",
          userId: "u1",
          role: "OWNER",
        },
      ],

      projects: [
        {
          id: "p1",
          name: "SaaS Task Manager",
          description: "Fullstack task management app",

          tasks: [
            {
              id: "t1",
              title: "Setup Prisma schema",
              description: "Create database models",
              status: "DONE",
              priority: "HIGH",
              order: 1,
              projectId: "p1",
              workspaceId: "ws1",
              creatorId: "u1",
              assigneeId: "u1",
              createdAt: new Date(),
            },
            {
              id: "t2",
              title: "Build authentication",
              description: "JWT + refresh token system",
              status: "IN_PROGRESS",
              priority: "HIGH",
              order: 2,
              projectId: "p1",
              workspaceId: "ws1",
              creatorId: "u1",
              assigneeId: "u1",
              createdAt: new Date(),
            },
            {
              id: "t3",
              title: "Create dashboard UI",
              description: "React dashboard layout",
              status: "TODO",
              priority: "MEDIUM",
              order: 3,
              projectId: "p1",
              workspaceId: "ws1",
              creatorId: "u1",
              assigneeId: null,
              createdAt: new Date(),
            },
          ],
        },

        {
          id: "p2",
          name: "Portfolio Website",
          description: "Personal dev portfolio",

          tasks: [
            {
              id: "t4",
              title: "Design homepage",
              status: "DONE",
              priority: "MEDIUM",
              order: 1,
              projectId: "p2",
              workspaceId: "ws1",
              creatorId: "u1",
              assigneeId: "u1",
              createdAt: new Date(),
            },
          ],
        },
      ],
    },
  ],
};
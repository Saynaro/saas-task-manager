import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Starting deep database seeding...');

    //  Clearing (order is important!)
    await prisma.activityLog.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash('password123', 10);

    //  Creating 5 users (User table)
    const users = [];
    for (let i = 1; i <= 5; i++) {
        const u = await prisma.user.create({
            data: {
                email: `user${i}@example.com`,
                passwordHash: passwordHash,
                firstName: `FirstName${i}`,
                lastName: `LastName${i}`,
            },
        });
        users.push(u);
    }
    console.log('5 Users created');

    //  Creating 5 workspaces and adding members (Workspace & WorkspaceMember)
    const workspaces = [];
    for (let i = 1; i <= 5; i++) {
        const ws = await prisma.workspace.create({
            data: {
                name: `Workspace ${i}`,
                slug: `workspace-${i}`,
                members: {
                    create: {
                        userId: users[i - 1].id,
                        role: i === 1 ? 'OWNER' : 'ADMIN',
                    },
                },
            },
        });
        workspaces.push(ws);
    }
    console.log('5 Workspaces and Members created');

    //  Creating 5 projects (Project & ProjectMember)
    const projects = [];
    for (let i = 1; i <= 5; i++) {
        const proj = await prisma.project.create({
            data: {
                name: `Project ${i}`,
                description: `Description for project ${i}`,
                workspaceId: workspaces[0].id, // All projects in the first workspace
                isPrivate: i % 2 === 0,
                members: {
                    create: {
                        userId: users[0].id,
                    },
                },
            },
        });
        projects.push(proj);
    }
    console.log('5 Projects and ProjectMembers created');

    //  Creating 10 tasks (Task table)
    const tasks = [];
    for (let i = 1; i <= 10; i++) {
        const t = await prisma.task.create({
            data: {
                title: `Task #${i}`,
                description: `Deep work on task ${i}`,
                status: i % 2 === 0 ? 'IN_PROGRESS' : 'TODO',
                priority: i % 3 === 0 ? 'HIGH' : 'LOW',
                workspaceId: workspaces[0].id,
                projectId: projects[i % 5].id,
                creatorId: users[0].id,
                assigneeId: users[1].id,
            },
        });
        tasks.push(t);
    }
    console.log('10 Tasks created');

    //  Creating 5 comments (Comment table)
    for (let i = 1; i <= 5; i++) {
        await prisma.comment.create({
            data: {
                content: `Important comment number ${i}`,
                taskId: tasks[0].id,
                userId: users[i - 1].id,
            },
        });
    }
    console.log('5 Comments created');

    //  Creating 5 logs (ActivityLog table)
    for (let i = 1; i <= 5; i++) {
        await prisma.activityLog.create({
            data: {
                action: 'UPDATED_STATUS',
                oldValue: 'TODO',
                newValue: 'DONE',
                userId: users[0].id,
                workspaceId: workspaces[0].id,
                taskId: tasks[i].id,
            },
        });
    }

    console.log('ALL TABLES SEEDED SUCCESSFULLY!');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
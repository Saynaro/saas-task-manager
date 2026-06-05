import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import passport from "./config/passport.js";


app.use(passport.initialize());

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: [
            process.env.FRONTEND_URL,
            "http://localhost:5173",
            "http://localhost:5174"
        ].filter(Boolean),
        credentials: true,
    },
});


// State for online users
const projectRooms = new Map(); // projectId -> Map of userId -> { user, sockets: Set }
const socketToProjects = new Map(); // socketId -> Set of projectIds
const socketToUser = new Map(); // socketId -> user

function addSocketToProject(socketId, projectId, user) {
    if (!user || !user.id) return;
    
    if (!socketToProjects.has(socketId)) {
        socketToProjects.set(socketId, new Set());
    }
    socketToProjects.get(socketId).add(projectId);
    
    socketToUser.set(socketId, user);
    
    if (!projectRooms.has(projectId)) {
        projectRooms.set(projectId, new Map());
    }
    
    const projectUsers = projectRooms.get(projectId);
    if (!projectUsers.has(user.id)) {
        projectUsers.set(user.id, {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl
            },
            sockets: new Set()
        });
    }
    projectUsers.get(user.id).sockets.add(socketId);
}

function removeSocketFromProject(socketId, projectId) {
    const user = socketToUser.get(socketId);
    if (!user || !user.id) return;
    
    if (socketToProjects.has(socketId)) {
        socketToProjects.get(socketId).delete(projectId);
        if (socketToProjects.get(socketId).size === 0) {
            socketToProjects.delete(socketId);
        }
    }
    
    if (projectRooms.has(projectId)) {
        const projectUsers = projectRooms.get(projectId);
        if (projectUsers.has(user.id)) {
            const userSession = projectUsers.get(user.id);
            userSession.sockets.delete(socketId);
            if (userSession.sockets.size === 0) {
                projectUsers.delete(user.id);
            }
        }
        if (projectUsers.size === 0) {
            projectRooms.delete(projectId);
        }
    }
}

function removeSocketFromAll(socketId) {
    const projectIds = socketToProjects.get(socketId);
    if (projectIds) {
        for (const projectId of projectIds) {
            removeSocketFromProject(socketId, projectId);
            emitOnlineUsers(projectId);
        }
    }
    socketToUser.delete(socketId);
    socketToProjects.delete(socketId);
}

function emitOnlineUsers(projectId) {
    const projectUsers = projectRooms.get(projectId);
    const usersList = [];
    if (projectUsers) {
        for (const [userId, userSession] of projectUsers.entries()) {
            usersList.push(userSession.user);
        }
    }
    io.to(`project:${projectId}`).emit("online_users", usersList);
}

io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on("join_project", (data) => {
        let projectId = data;
        let user = null;
        if (typeof data === "object" && data !== null) {
            projectId = data.projectId;
            user = data.user;
        }

        socket.join(`project:${projectId}`);
        console.log(`Socket ${socket.id} joined project ${projectId}`);
        
        if (user) {
            addSocketToProject(socket.id, projectId, user);
            emitOnlineUsers(projectId);
        }
    });

    socket.on("leave_project", (projectId) => {
        socket.leave(`project:${projectId}`);
        console.log(`Socket ${socket.id} left project ${projectId}`);
        
        removeSocketFromProject(socket.id, projectId);
        emitOnlineUsers(projectId);
    });

    socket.on("join_workspace", (workspaceId) => {
        socket.join(`workspace:${workspaceId}`);
        console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
    });

    socket.on("leave_workspace", (workspaceId) => {
        socket.leave(`workspace:${workspaceId}`);
        console.log(`Socket ${socket.id} left workspace ${workspaceId}`);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
        removeSocketFromAll(socket.id);
    });
});

const startServer = async () => {
    try {
        await connectDB();

        // httpServer instead of app.listen(PORT) to support socket.io
        const server = httpServer.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });

        // graceful shutdown for docker
        // make sure that the server is closed before the database
        const gracefulShutdown = async () => {
            console.log('Signal received. Shutting down...');

            const forceExitTimeout = setTimeout(() => {
                console.error('Shutdown timeout, forcing exit...');
                process.exit(1);
            }, 30000);

            // Forcefully close all keep-alive connections
            server.closeAllConnections?.();

            server.close(async () => {
                try {
                    await disconnectDB();
                    console.log('DB disconnected.');
                    clearTimeout(forceExitTimeout);
                    process.exit(0);
                } catch (err) {
                    console.error('DB disconnect error:', err);
                    process.exit(1);
                }
            });
        };



        //SIGINT - Ctrl+C in local machine
        process.on('SIGINT', gracefulShutdown);

        //SIGTERM - docker send this signal to the container when it needs to be stopped
        process.on('SIGTERM', gracefulShutdown);

    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();
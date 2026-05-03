import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });

        // graceful shutdown for docker
        // make sure that the server is closed before the database
        const gracefulShutdown = async () => {
            console.log('Signal for exit received. Starts closing...');

            const forceExitTimeout = setTimeout(() => {
                console.error('Shutdown timeout reached, forcing exit..');
                process.exit(1);
            }, 30000);

            // Stop HTTP server before
            server.close(async () => {
                console.log('HTTP server closed. There is no new requests.');

                try {
                    // Close Database just after closing server
                    await disconnectDB();
                    console.log('DATABASE connection closed successfully.');

                    clearTimeout(forceExitTimeout);
                    process.exit(0);
                } catch (err) {
                    console.error('Error while exit DATABASE:', err);
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
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerRoutes } from './routes.js';
import { initializeDatabase } from '../lib/database.js';
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Mobile Repair Tracker Backend is running' });
});
const startServer = async () => {
    try {
        await initializeDatabase();
        await registerRoutes(app, io);
        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
        const PORT = process.env.PORT || 10000;
        server.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌐 Health check: http://localhost:${PORT}/health`);
            console.log(`📊 API endpoints available at: http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map
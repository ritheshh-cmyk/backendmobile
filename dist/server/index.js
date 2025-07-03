"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const routes_1 = require("./routes");
const storage_1 = require("./storage");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
const whitelist = [
    'http://localhost:8080',
    'https://positive-kodiak-friendly.ngrok-free.app'
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log('❌ CORS Blocked:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    credentials: true
}));
app.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (whitelist.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Mobile Repair Tracker Backend is running' });
});
const startServer = async () => {
    try {
        await (0, routes_1.registerRoutes)(app, io);
        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
        (async () => {
            const admin = await storage_1.storage.getUserByUsername('admin');
            if (!admin) {
                await storage_1.storage.createUser({ username: 'admin', password: 'admin123' });
                console.log('✅ Default admin user created: admin/admin123');
            }
            else {
                admin.password = 'admin123';
                console.log('✅ Default admin user password reset to admin123');
            }
        })();
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
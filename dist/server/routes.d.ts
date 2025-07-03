import type { Express } from "express";
import { type Server } from "http";
import type { Server as SocketIOServer } from "socket.io";
export declare function registerRoutes(app: Express, io: SocketIOServer): Promise<Server>;
export { registerRoutes };
//# sourceMappingURL=routes.d.ts.map
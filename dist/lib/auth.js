import jwt from 'jsonwebtoken';
import { storage } from '../server/storage.js';
export async function authenticateToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await storage.getUserById(decoded.id);
        if (!user)
            return null;
        return {
            id: user.id,
            username: user.username,
            role: user.role || 'user',
            createdAt: user.createdAt || new Date().toISOString()
        };
    }
    catch (error) {
        return null;
    }
}
export function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
}
export const requireAuth = async (req) => {
    const user = await authenticateToken(req.headers.get('authorization') || '');
    if (!user) {
        throw new Error('Authentication required');
    }
    return user;
};
export const requireAdmin = async (req) => {
    const user = await requireAuth(req);
    if (user.role !== 'admin') {
        throw new Error('Admin access required');
    }
    return user;
};
//# sourceMappingURL=auth.js.map
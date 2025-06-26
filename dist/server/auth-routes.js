import express from 'express';
import jwt from 'jsonwebtoken';
import { storage } from './storage.js';
const router = express.Router();
router.post('/login', (req, res) => {
    (async () => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const user = await storage.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    })().catch(error => {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    });
});
router.post('/register', (req, res) => {
    (async () => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        const newUser = await storage.createUser({ username, password });
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                username: newUser.username
            }
        });
    })().catch(error => {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    });
});
export default router;
//# sourceMappingURL=auth-routes.js.map
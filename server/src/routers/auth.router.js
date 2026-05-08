import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Đường dẫn: /api/auth/register
authRouter.post('/register', register);

// Đường dẫn: /api/auth/login
authRouter.post('/login', login);

export default authRouter;
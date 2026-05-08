import express from 'express';
import todoRouter from './todo.router.js';
import authRouter from './auth.router.js';

const rootRouter = express.Router();

// Các đường dẫn liên quan đến Đăng nhập/Đăng ký
rootRouter.use('/auth', authRouter);

// Các đường dẫn liên quan đến Todo
rootRouter.use('/todos', todoRouter);

export default rootRouter;
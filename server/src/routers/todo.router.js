import express from 'express';
import { getAll, getOne, createOne, updateOne, deleteOne } from '../controllers/todo.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const todoRouter = express.Router();

// Tất cả các hành động với Todo bây giờ đều cần đi qua authMiddleware
todoRouter.use(authMiddleware);

todoRouter.get('/', getAll);
todoRouter.get('/:id', getOne);
todoRouter.post('/', createOne);
todoRouter.put('/:id', updateOne);
todoRouter.delete('/:id', deleteOne);

export default todoRouter;

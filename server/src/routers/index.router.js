import { Router } from "express";
import todoRouter from "./todo.router"; 

const router = Router();

// Sử dụng đúng biến đã import ở trên
router.use("/todos", todoRouter);

export default router;
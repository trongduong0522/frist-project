import { Router } from "express";
import {
    getAll, createOne,getOne,deleteOne,updateOne 
} from "../controllers/todo.controller";

const todoRouter = Router();
todoRouter.get("/", getAll)
todoRouter.get("/:id", getOne)
todoRouter.post("/", createOne)
todoRouter.delete("/:id", deleteOne)
todoRouter.put("/:id", updateOne)

export default todoRouter
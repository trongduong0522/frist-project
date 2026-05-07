import { string } from "joi";
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false }
}, { timestamps: true }); // Tự động thêm ngày tạo và ngày cập nhật

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
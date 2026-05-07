import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        completed: { type: Boolean, default: false },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        }
    },
    { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;

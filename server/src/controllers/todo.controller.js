import Todo from "../models/todo.model";
import Joi from "joi";
import todoSchema from "../validation/todo.valid";
export const getAll = async(req,res) =>{
    try {
        const todos = await Todo.find();
        return res.json(todos)
    } catch (error) {
        return res.status(500).json({ error:error.message})
    }
}

export const createOne = async (req, res) => {
    try {
        // 1. Validate dữ liệu từ client gửi lên (req.body)
        const { error } = todoSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            // Trả về danh sách các lỗi nếu có
            return res.status(400).json({
                message: error.details.map(err => err.message)
            });
        }

        // 2. Nếu dữ liệu hợp lệ, tiến hành lưu vào Database
        const newTodo = await Todo.create(req.body);
        
        // 3. Trả về kết quả thành công
        return res.status(201).json(newTodo);

    } catch (error) {
        // Trả về lỗi server nếu có sự cố
        return res.status(500).json({ error: error.message });
    }
};

export const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        
        if (!todo) {
            return res.status(404).json({ message: "Todo không tồn tại" });
        }
        
        return res.json(todo);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateOne = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate dữ liệu cập nhật
        const { error } = todoSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            return res.status(400).json({
                message: error.details.map(err => err.message)
            });
        }
        
        const updatedTodo = await Todo.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo không tồn tại" });
        }
        
        return res.json(updatedTodo);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await Todo.findByIdAndDelete(id);
        
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo không tồn tại" });
        }
        
        return res.json({ message: "Xóa todo thành công", deletedTodo });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


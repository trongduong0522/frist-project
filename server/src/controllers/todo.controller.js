import Todo from "../models/todo.model.js";
import todoSchema from "../validation/todo.valid.js";


export const getAll = async (req, res) => {
    try {
        // Chỉ tìm những Todo có userId trùng với người đang đăng nhập
        const todos = await Todo.find({ userId: req.user.id }); 
        return res.json(todos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createOne = async (req, res) => {
    try {
        const { error, value } = todoSchema.validate(req.body, { abortEarly: false });
        if (error) return res.status(400).json({ message: error.details.map(err => err.message) });

        // Gắn thêm userId vào dữ liệu trước khi lưu
        const newTodo = await Todo.create({ 
            ...value, 
            userId: req.user.id 
        });
        
        return res.status(201).json(newTodo);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOne({ _id: id, userId: req.user.id });
        
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
        const { error, value } = todoSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            return res.status(400).json({
                message: error.details.map(err => err.message)
            });
        }
        
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            value, 
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
        const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId: req.user.id });
        
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo không tồn tại" });
        }
        
        return res.json({ message: "Xóa todo thành công", deletedTodo });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


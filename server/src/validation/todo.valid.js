import Joi from "joi";
import Todo from "../models/todo.model"; 

const todoSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .messages({
      "string.empty": "Tiêu đề không được để trống",
      "string.min": "Tiêu đề phải có ít nhất 3 ký tự",
      "any.required": "Trường tiêu đề là bắt buộc"
    }),
    
  description: Joi.string()
    .allow("") // Cho phép chuỗi rỗng
    .max(500)
    .default("")
    .messages({
      "string.max": "Mô tả không được vượt quá 500 ký tự"
    }),

  completed: Joi.boolean()
    .default(false)
});

export default todoSchema;
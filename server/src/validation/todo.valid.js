import Joi from "joi";

const todoSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .messages({
      "string.empty": "Tieu de khong duoc de trong",
      "string.min": "Tieu de phai co it nhat 3 ky tu",
      "any.required": "Truong tieu de la bat buoc"
    }),

  description: Joi.string()
    .allow("")
    .max(500)
    .default("")
    .messages({
      "string.max": "Mo ta khong duoc vuot qua 500 ky tu"
    }),

  completed: Joi.boolean()
    .default(false),

  priority: Joi.string()
    .valid("low", "medium", "high")
    .default("medium")
    .messages({
      "any.only": "Muc do uu tien phai la low, medium hoac high"
    })
});

export default todoSchema;

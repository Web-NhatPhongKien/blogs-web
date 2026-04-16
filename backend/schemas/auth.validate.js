import Joi from "joi";

export const registerSchema = Joi.object({
  fullname: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().min(3).required()
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
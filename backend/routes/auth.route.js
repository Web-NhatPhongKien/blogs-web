import express from 'express';
import {
  register,
  login,
} from '../controllers/auth.controller.js';
import {
  registerSchema,
  signinSchema,
} from '../validates/auth.validate.js';

const router = express.Router();

const validate = (schema) => (
  req,
  res,
  next
) => {
  const { error } = schema.validate(
    req.body
  );

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  next();
};

router.post(
  '/register',
  validate(registerSchema),
  register
);

router.post(
  '/login',
  validate(signinSchema),
  login
);

export default router;
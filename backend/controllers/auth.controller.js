import {
  registerService,
  loginService,
} from '../services/auth.service.js';

export const register = async (
  req,
  res
) => {
  try {
    const user = await registerService(
      req.body
    );

    res.status(201).json({
      message: 'Register success',
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const login = async (
  req,
  res
) => {
  try {
    const data = await loginService(
      req.body
    );

    res.json(data);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
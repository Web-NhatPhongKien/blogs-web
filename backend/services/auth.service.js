import bcrypt from 'bcrypt';
import User from '../schemas/user.schema.js';
import { generateToken } from '../utils/jwt.js';

export const registerService = async (data) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  const user = await User.create({
    username: data.username,
    email: data.email,
    password: hashedPassword,
  });

  return user;
};

export const loginService = async ({
  email,
  password,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error('Wrong password');
  }

  const token = generateToken(user);

  return {
    token,
    user,
  };
};
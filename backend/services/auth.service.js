import bcrypt from 'bcrypt';
import User from '../schemas/user.schema.js';
import { generateToken } from '../utils/jwt.js';

export const registerService = async (data) => {
  const existingUser = await User.findOne({
    // email: data.email,
    'personal_info.email': data.email
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  const user = await User.create({
    // username: data.username,
    // email: data.email,
    // password: hashedPassword,
    personal_info: {
      // fullname: data.fullname,
      username: data.username,
      email: data.email,
      password: hashedPassword
    }
  });

  return user;
};

export const loginService = async ({
  email,
  password,
}) => {
  const user = await User.findOne({ 'personal_info.email': email });

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(
    password,
    user.personal_info.password
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
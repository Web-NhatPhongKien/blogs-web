import User from "../schemas/user.js";
import bcrypt from "bcrypt";

export const registerService = async (data) => {
  const { fullname, email, password, username } = data;

  const exist = await User.findOne({ "personal_info.email": email });
  if (exist) throw new Error("Email already exists");

  const hash = await bcrypt.hash(password, 10);

  return await User.create({
    personal_info: {
      fullname,
      email,
      password: hash,
      username
    }
  });
};

export const signinService = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ "personal_info.email": email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.personal_info.password);
  if (!isMatch) throw new Error("Wrong password");

  return user;
};
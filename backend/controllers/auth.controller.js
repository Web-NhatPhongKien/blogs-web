import { registerService, signinService } from "../services/auth.service.js";
import { signToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const user = await registerService(req.body);
    const token = signToken({ id: user._id });

    res.json({ message: "Register success", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await signinService(req.body);
    const token = signToken({ id: user._id });

    res.json({ message: "Login success", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
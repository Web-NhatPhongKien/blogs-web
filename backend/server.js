import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import morgan from 'morgan'

import { register, signin } from "./controllers/auth.controller.js";
import { registerSchema, signinSchema } from "./schemas/auth.validate.js";

const server = express();
let PORT = 3000;

server.use(express.json())
server.use(morgan('dev'))

mongoose.connect("mongodb://localhost:27017/")
.then(
    () => console.log("DB connected")
).catch(e => 
    console.error(e.message)
)

// middleware validate
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  next();
};

// routes
server.post("/signup", validate(registerSchema), register);
server.post("/signin", validate(signinSchema), signin);



server.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})

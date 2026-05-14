import dotenv from "dotenv";

dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';

const server = express();

server.use(cors());
server.use(express.json());
server.use(morgan('dev'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected'))
  .catch((e) => console.error(e.message));

  //routes
server.use('/api/auth', authRoutes);

server.listen(process.env.PORT, () => {
  console.log('Listening on port ' + process.env.PORT);
});


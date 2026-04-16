import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
  personal_info: {
    fullname: {
      type: String,
      lowercase: true,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: String,
    username: {
      type: String,
      minlength: 3,
      unique: true,
    },
  },
}, { timestamps: true });

export default mongoose.model("users", userSchema);
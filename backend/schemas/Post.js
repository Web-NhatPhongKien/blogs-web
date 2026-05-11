const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  banner: String,
  content: Object, // Editor.js
  tags: [String],
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", PostSchema);
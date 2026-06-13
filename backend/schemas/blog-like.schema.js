import mongoose, { Schema } from "mongoose";

const blogLikeSchema = new Schema(
    {
        blog: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "blogs"
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users"
        }
    },
    {
        timestamps: true
    }
);

blogLikeSchema.index({ blog: 1, user: 1 }, { unique: true });

export default mongoose.model("blog_likes", blogLikeSchema);

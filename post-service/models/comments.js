import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  postId: {
    type: "string",
    required: true,
  },
  userId: {
    type: "string",
    required: true,
  },
  comment: {
    type: "string",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

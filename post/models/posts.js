import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  userId: {
    type: "string",
    required: true,
  },
  caption: {
    type: "string",
    required: false,
  },
  imageUri: {
    type: "string",
    required: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;

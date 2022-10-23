import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
  },
  updateAt: {
    type: Date,
  },
});

commentSchema.plugin(mongoosePaginate);
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

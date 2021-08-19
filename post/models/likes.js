import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    require: true,
  },
});

const Like = mongoose.model("Like", likeSchema);
export default Like;

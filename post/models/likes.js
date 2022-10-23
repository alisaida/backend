import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

likeSchema.plugin(mongoosePaginate);

const Like = mongoose.model("Like", likeSchema);
export default Like;

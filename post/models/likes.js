import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const likeSchema = mongoose.Schema(***REMOVED***
  userId: ***REMOVED***
    type: String,
    required: true,
  ***REMOVED***,
  postId: ***REMOVED***
    type: String,
    require: true,
  ***REMOVED***,
***REMOVED***);

likeSchema.plugin(mongoosePaginate);

const Like = mongoose.model("Like", likeSchema);
export default Like;

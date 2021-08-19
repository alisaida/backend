import mongoose from "mongoose";

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

const Like = mongoose.model("Like", likeSchema);
export default Like;

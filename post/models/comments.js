import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const commentSchema = mongoose.Schema(***REMOVED***
  postId: ***REMOVED***
    type: "string",
    required: true,
  ***REMOVED***,
  userId: ***REMOVED***
    type: "string",
    required: true,
  ***REMOVED***,
  comment: ***REMOVED***
    type: "string",
    required: true,
  ***REMOVED***,
  createdAt: ***REMOVED***
    type: Date,
  ***REMOVED***,
  updateAt: ***REMOVED***
    type: Date,
  ***REMOVED***,
***REMOVED***);

commentSchema.plugin(mongoosePaginate);
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

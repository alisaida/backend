import mongoose from "mongoose";

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
    default: new Date(),
  ***REMOVED***,
  updateAt: ***REMOVED***
    type: Date,
  ***REMOVED***,
***REMOVED***);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

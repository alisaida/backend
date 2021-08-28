import mongoose from "mongoose";

const postSchema = mongoose.Schema(***REMOVED***
  userId: ***REMOVED***
    type: "string",
    required: true,
  ***REMOVED***,
  caption: ***REMOVED***
    type: "string",
    required: false,
  ***REMOVED***,
  imageUri: ***REMOVED***
    type: "string",
    required: false,
  ***REMOVED***,
  createdAt: ***REMOVED***
    type: Date,
    default: new Date(),
  ***REMOVED***,
  updatedAt: ***REMOVED***
    type: Date,
  ***REMOVED***,
***REMOVED***);

const Post = mongoose.model("Post", postSchema);

export default Post;

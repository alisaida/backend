import mongoose from "mongoose";

const bookmarkSchema = mongoose.Schema(***REMOVED***
  userId: ***REMOVED***
    type: String,
    required: true,
  ***REMOVED***,
  postId: ***REMOVED***
    type: String,
    require: true,
  ***REMOVED***,
***REMOVED***);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;

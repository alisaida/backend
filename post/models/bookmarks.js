import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

bookmarkSchema.plugin(mongoosePaginate);
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;

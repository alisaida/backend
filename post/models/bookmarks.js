import mongoose from "mongoose";

const bookmarkSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    require: true,
  },
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;

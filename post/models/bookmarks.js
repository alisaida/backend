import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

bookmarkSchema.plugin(mongoosePaginate);
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;

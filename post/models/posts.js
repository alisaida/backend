import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const postSchema = mongoose.Schema({
  userId: {
    type: "string",
    required: true,
  },
  caption: {
    type: "string",
    required: false,
  },
  imageUri: {
    type: "string",
    required: false,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  location: {
    type: "string",
    required: false,
  },
  tags: [{
    type: String
  }],
  people: [{
    type: String
  }]
});

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model("Post", postSchema);
export default Post;

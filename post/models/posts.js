import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
  ***REMOVED***,
  updatedAt: ***REMOVED***
    type: Date,
  ***REMOVED***,
  location: ***REMOVED***
    type: "string",
    required: false,
  ***REMOVED***,
  tags: [***REMOVED***
    type: String
  ***REMOVED***],
  people: [***REMOVED***
    type: String
  ***REMOVED***]
***REMOVED***);

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model("Post", postSchema);
export default Post;

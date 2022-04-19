import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const tagSchema = mongoose.Schema(***REMOVED***
    tag: ***REMOVED***
        type: String,
        required: true,
    ***REMOVED***
***REMOVED***);

tagSchema.plugin(mongoosePaginate);

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;

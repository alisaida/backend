import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const tagSchema = mongoose.Schema({
    tag: {
        type: String,
        required: true,
    }
});

tagSchema.plugin(mongoosePaginate);

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;

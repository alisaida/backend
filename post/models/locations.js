import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const locationSchema = mongoose.Schema({
    location: {
        type: String,
        required: true,
    }
});

locationSchema.plugin(mongoosePaginate);

const Location = mongoose.model("Location", locationSchema);
export default Location;

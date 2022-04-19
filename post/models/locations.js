import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const locationSchema = mongoose.Schema(***REMOVED***
    location: ***REMOVED***
        type: String,
        required: true,
    ***REMOVED***
***REMOVED***);

locationSchema.plugin(mongoosePaginate);

const Location = mongoose.model("Location", locationSchema);
export default Location;

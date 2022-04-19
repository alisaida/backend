import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const personSchema = mongoose.Schema(***REMOVED***
    person: ***REMOVED***
        type: String,
        required: true,
    ***REMOVED***
***REMOVED***);

personSchema.plugin(mongoosePaginate);

const Person = mongoose.model("Person", personSchema);
export default Person;

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const personSchema = mongoose.Schema({
    person: {
        type: String,
        required: true,
    }
});

personSchema.plugin(mongoosePaginate);

const Person = mongoose.model("Person", personSchema);
export default Person;

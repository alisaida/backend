import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
const followSchema = mongoose.Schema({
    follower: {
        type: String,
        required: true,
    },
    following: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        default: 'pending'
    },
})

followSchema.plugin(mongoosePaginate);

const Follow = mongoose.model('Follow', followSchema);
export default Follow;

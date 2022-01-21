import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
const followSchema = mongoose.Schema(***REMOVED***
    follower: ***REMOVED***
        type: String,
        required: true,
    ***REMOVED***,
    following: ***REMOVED***
        type: String,
        required: true,
    ***REMOVED***,
    createdAt: ***REMOVED***
        type: Date,
        default: new Date()
    ***REMOVED***,
    status: ***REMOVED***
        type: String,
        default: 'pending'
    ***REMOVED***,
***REMOVED***)

followSchema.plugin(mongoosePaginate);

const Follow = mongoose.model('Follow', followSchema);
export default Follow;

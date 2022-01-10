import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const messageSchema = mongoose.Schema(***REMOVED***
    chatRoomId: ***REMOVED***
        type: 'string',
        required: true,
    ***REMOVED***,
    userId: ***REMOVED***
        type: 'string',
        required: true,
    ***REMOVED***,
    content: ***REMOVED***
        type: 'string',
        required: false,
    ***REMOVED***,
    imageUri: ***REMOVED***
        type: 'string',
        required: false,
    ***REMOVED***,
    postId: ***REMOVED***
        type: 'string',
        required: false,
    ***REMOVED***,
    callType: ***REMOVED***
        type: 'string',
        required: false,
    ***REMOVED***,
    callDuration: ***REMOVED***
        type: 'string',
        required: false,
    ***REMOVED***,
    type: ***REMOVED***
        type: 'string',
        default: 'default'
    ***REMOVED***,
    createdAt: ***REMOVED***
        type: Date
    ***REMOVED***,
    updatedAt: ***REMOVED***
        type: Date
    ***REMOVED***
***REMOVED***);

messageSchema.plugin(mongoosePaginate);
const Message = mongoose.model('Message', messageSchema);

export default Message;
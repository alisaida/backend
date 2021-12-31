import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const chatRoomSchema = mongoose.Schema(***REMOVED***
    name: ***REMOVED***
        type: 'string',
        required: false
    ***REMOVED***,
    isGroupChat: ***REMOVED***
        type: 'boolean',
        default: false
    ***REMOVED***,
    createdAt: ***REMOVED***
        type: Date
    ***REMOVED***,
    updatedAt: ***REMOVED***
        type: Date
    ***REMOVED***
***REMOVED***)

chatRoomSchema.plugin(mongoosePaginate);
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
export default ChatRoom;
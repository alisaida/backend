import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const chatRoomSchema = mongoose.Schema({
    name: {
        type: 'string',
        required: false
    },
    isGroupChat: {
        type: 'boolean',
        default: false
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
})

chatRoomSchema.plugin(mongoosePaginate);
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
export default ChatRoom;
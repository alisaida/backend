import mongoose from 'mongoose';

const ChatRoomSchema = mongoose.Schema({
    name: {
        type: 'string',
        required: false
    },
    isGroupChat: {
        type: 'boolean',
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    }
})

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
export default ChatRoom;
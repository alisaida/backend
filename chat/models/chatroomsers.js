import mongoose from 'mongoose';

const chatRoomUserSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    chatRoomId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        required: false
    }
});

const ChatRoomUser = mongoose.model('ChatRoomUser', chatRoomUserSchema);
export default ChatRoomUser;
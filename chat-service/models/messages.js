import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    chatRoomId: {
        type: 'string',
        required: true,
    },
    userId: {
        type: 'string',
        required: true,
    },
    content: {
        type: 'string',
        required: false,
    },
    imageUri: {
        type: 'string',
        required: false,
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
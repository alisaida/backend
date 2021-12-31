import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

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
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

messageSchema.plugin(mongoosePaginate);
const Message = mongoose.model('Message', messageSchema);

export default Message;
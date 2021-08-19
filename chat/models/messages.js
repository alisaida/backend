import mongoose from 'mongoose';

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
    createdAt: ***REMOVED***
        type: Date,
        default: new Date()
    ***REMOVED***,
    updatedAt: ***REMOVED***
        type: Date
    ***REMOVED***
***REMOVED***);

const Message = mongoose.model('Message', messageSchema);

export default Message;
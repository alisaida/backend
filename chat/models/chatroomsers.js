import mongoose from 'mongoose';

const chatRoomUserSchema = mongoose.Schema(***REMOVED***
    userId: ***REMOVED***
        type: String,
        required: true
    ***REMOVED***,
    chatRoomId: ***REMOVED***
        type: String,
        required: true
    ***REMOVED***,
    createdAt: ***REMOVED***
        type: Date,
    ***REMOVED***,
    updatedAt: ***REMOVED***
        type: Date,
        required: false
    ***REMOVED***
***REMOVED***);

const ChatRoomUser = mongoose.model('ChatRoomUser', chatRoomUserSchema);
export default ChatRoomUser;
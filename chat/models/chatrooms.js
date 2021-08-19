import mongoose from 'mongoose';

const ChatRoomSchema = mongoose.Schema(***REMOVED***
    name: ***REMOVED***
        type: 'string',
        required: false
    ***REMOVED***,
    isGroupChat: ***REMOVED***
        type: 'boolean',
        default: false
    ***REMOVED***,
    createdAt: ***REMOVED***
        type: Date,
        default: new Date()
    ***REMOVED***,
    updatedAt: ***REMOVED***
        type: Date
    ***REMOVED***
***REMOVED***)

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
export default ChatRoom;
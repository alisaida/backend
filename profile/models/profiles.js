import mongoose from 'mongoose';

const profileSchema = mongoose.Schema(***REMOVED***
    userId: ***REMOVED***
        type: String,
        required: true,
    ***REMOVED***,
    username: ***REMOVED***
        type: String,
        required: true,
    ***REMOVED***,
    name: ***REMOVED***
        type: String,
        required: true
    ***REMOVED***,
    profilePicture: ***REMOVED***
        type: String
    ***REMOVED***,
    bio: ***REMOVED***
        type: String
    ***REMOVED***,
    createdAt: ***REMOVED***
        type: Date,
        default: new Date()
    ***REMOVED***,
    updatedAt: ***REMOVED***
        type: Date
    ***REMOVED***
***REMOVED***)

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;

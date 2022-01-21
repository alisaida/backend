import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    bio: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date
    }
})

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;

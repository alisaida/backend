import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    imageUri: {
        type: String,
        required: false
    }
});

const User = mongoose.model('User', userSchema);
export default User;
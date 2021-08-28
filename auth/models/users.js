import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(***REMOVED***
    name: ***REMOVED***
        type: String,
        required: true
    ***REMOVED***,
    email: ***REMOVED***
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    ***REMOVED***,
    username: ***REMOVED***
        type: String,
        required: true,
        unique: true
    ***REMOVED***,
    isVerified: ***REMOVED***
        type: Boolean,
        default: false
    ***REMOVED***,
    password: ***REMOVED***
        type: String,
        required: true,
    ***REMOVED***,
    createdAt: ***REMOVED***
        type: Date,
        default: new Date()
    ***REMOVED***,
    updatedAt: ***REMOVED***
        type: Date
    ***REMOVED***
***REMOVED***);

//mongoose middleware before saving
userSchema.pre('save', async function (next) ***REMOVED***
    try ***REMOVED***
        //generate a salt and hash the password field
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
        next();
    ***REMOVED*** catch (error) ***REMOVED***
        next(error);
    ***REMOVED***
***REMOVED***);

userSchema.methods.isValidPassword = async function (password) ***REMOVED***
    try ***REMOVED***
        return await bcrypt.compare(password, this.password);
    ***REMOVED*** catch (err) ***REMOVED***
        next(err);
    ***REMOVED***
***REMOVED***

const User = mongoose.model('User', userSchema);
export default User;
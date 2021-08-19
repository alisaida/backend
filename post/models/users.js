import mongoose from "mongoose";

const userSchema = mongoose.Schema(***REMOVED***
  userId: ***REMOVED***
    type: String,
    required: true,
    unique: true,
  ***REMOVED***,
  name: ***REMOVED***
    type: String,
    required: true,
  ***REMOVED***,
  email: ***REMOVED***
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  ***REMOVED***,
  mobile: ***REMOVED***
    type: String,
    required: false,
    unique: false,
  ***REMOVED***,
  imageUri: ***REMOVED***
    type: String,
    required: false,
  ***REMOVED***,
***REMOVED***);

const User = mongoose.model("User", userSchema);
export default User;


import mongoose, { Schema } from "mongoose";
// TODO: Import jwt (To generate tokens)
// TODO: Import bcrypt (To hash passwords)

// Define User schema
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    rootFolder: {
        type: Schema.Types.ObjectId,
        ref: "Folder",
    },
    hiddenFolder: {
        type: Schema.Types.ObjectId,
        ref: "HiddenFolder",
    },
    refreshToken: {
        type: String,
    },
});

// TODO: Add pre-save hook to hash password

// TODO: Add method to compare password using bcrypt

// TODO: Add methods to generate refresh token

// TODO: Add method to generate access token (Not stored in DB)

// Create and export User model
export const User = mongoose.model("User", userSchema);

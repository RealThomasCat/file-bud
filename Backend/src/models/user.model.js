import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define User schema
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        index: true,
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
        default: null,
        required: true,
    },
    hiddenFolder: {
        type: Schema.Types.ObjectId,
        ref: "HiddenFolder",
    },
    refreshToken: {
        type: String,
    },
    storageUsed: {
        type: Number,
        default: 0,
    },
    maxStorage: {
        type: Number,
        default: 1073741824, // 1 GB
    },
    isAccessLimited: {
        type: Boolean,
        default: false,
    },
});

// pre-save hook to hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// method to compare password using bcrypt
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// method to generate access token (Not stored in DB)
// This will add a key named generateAccessToken to the methods object
// which will have value = provided function()
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            rootFolder: this.rootFolder,
            isAccessLimited: this.isAccessLimited,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

// Create and export User model
export const User = mongoose.model("User", userSchema);

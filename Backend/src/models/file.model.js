import mongoose, { Schema } from "mongoose";

// TODO: Add mongoose aggregation pipeline

const fileSchema = new Schema(
    {
        publicId: {
            type: String, // Cloudinary public ID
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
        },
        size: {
            type: Number,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        isHidden: {
            type: Boolean,
            default: false,
        },
        parentFolder: {
            type: Schema.Types.ObjectId,
            ref: "Folder",
            required: true,
        },
        format: {
            type: String,
            // required: true,
        },
        resourceType: {
            type: String,
            required: true,
        },
        urlExpiresAt: {
            type: Number,
        },
    },
    {
        timeStamps: true,
    }
);

export const File = mongoose.model("File", fileSchema);

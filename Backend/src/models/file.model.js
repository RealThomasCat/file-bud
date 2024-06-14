import mongoose, { Schema } from "mongoose";

// TODO: Add mongoose aggregation pipeline

const fileSchema = new Schema(
    {
        fileUrl: {
            type: String, // Cloudinary URL
            // required: true,
        },
        thumbnail: {
            type: String, // Cloudinary URL
        },
        title: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
        },
        size: {
            type: String,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        isHidden: {
            type: Boolean,
            default: false,
        },
        parentFolder: {
            type: Schema.Types.ObjectId,
            ref: 'Folder',
            required: true
        }
    },
    {
        timeStamps: true,
    }
);

export const File = mongoose.model("File", fileSchema);

import mongoose, { Schema } from "mongoose";

// TODO: Add mongoose aggregation pipeline

const fileSchema = new Schema(
    {
        fileUrl: {
            type: String, // Cloudinary URL
            required: true,
        },
        thumbnail: {
            type: String, // Cloudinary URL
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
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isHidden: {
            type: Boolean,
            default: false,
        },
    },
    {
        timeStamps: true,
    }
);

export const File = mongoose.model("File", fileSchema);

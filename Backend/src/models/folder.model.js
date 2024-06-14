import mongoose, { Schema } from "mongoose";

// TODO: Add mongoose aggregation pipeline

const folderSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            // required: true,
            index: true,
        },
        files: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            },
        ],
        subfolders: [
            {
                type: Schema.Types.ObjectId,
                ref: "Folder",
            },
        ],
        parentFolder: {
            type: Schema.Types.ObjectId,
            ref: "Folder",
        },
    },
    {
        timeStamps: true,
    }
);

export const Folder = mongoose.model("Folder", folderSchema);

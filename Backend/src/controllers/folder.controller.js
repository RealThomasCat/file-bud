import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Folder } from "../models/folder.model.js";

// FETCH FOLDER
const fetchFolder = asyncHandler(async (req, res) => {
    // Get folder id from req
    const { folderId } = req.params;

    // Find folder using folderId
    const folder = await Folder.findById(folderId);

    // If folder does not exist then throw error
    if (!folder) {
        throw new ApiError(404, "Folder not found");
    }

    // Check if folder belongs to user
    if (folder.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access");
    }

    // Send folder object in response (contains file array and subfolder array to display in frontend)
    return res.status(200).json(new ApiResponse(200, folder, "Folder found"));
});

// CREATE NEW FOLDER
const createFolder = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Get data from req (user comes from token)
        const { currFolderId, title, user } = req.body;

        // Trim folder title and throw error if it is empty
        if (!title?.trim()) {
            throw new ApiError(400, "Please provide folder title");
        }

        // If current folder id is not provided then throw error
        if (!currFolderId) {
            throw new ApiError(400, "Parent folder information is missing");
        }

        // TODO: Check current folder actually exists and belongs to user

        // If parent folder does not exist then throw error
        if (!parentFolder) {
            throw new ApiError(404, "Parent folder not found");
        }

        // Check if same title folder already exists in parent folder's subfolders array
        const existedFolder = parentFolder.subfolders.find(
            (folder) => folder.title === title
        );

        // TODO: If folder already exists then append a count to title

        // Create new folder (transactional operation)
        const newFolder = await Folder.create(
            {
                title,
                ownerId: user._id,
            },
            { session }
        );

        // Add new folder id to parent folder's subfolders array
        parentFolder.subfolders.push(newFolder._id);

        // Save parent folder (transactional operation)
        await parentFolder.save({ session });

        // COMMIT TRANSACTION
        await session.commitTransaction();
        session.endSession();

        // Send response
        return res
            .status(201)
            .json(
                new ApiResponse(200, newFolder, "Folder created successfully")
            );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

// DELETE FOLDER
const deleteFolder = asyncHandler(async (req, res) => {});

export { fetchFolder, createFolder, deleteFolder };

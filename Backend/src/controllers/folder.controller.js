import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Folder } from "../models/folder.model.js";
import { User } from "../models/user.model.js";
import { File } from "../models/file.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

// Get the directory path of the current module using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Define the path to the log file
const logFilePath = path.join(__dirname, '../../logs/cloudinary_delete_log.txt');
console.log(logFilePath)

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
const deleteFolder = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { folderId } = req.body; // Assuming folderId is sent in the body
        const user = req.user; // Authenticated user information

        // Check if the folder to be deleted is the user's root folder
        if (folderId.toString() === user.rootFolder.toString()) {
            return res.status(403).json({ message: 'Cannot delete root folder' });
        }

        const folderToDelete = await Folder.findById(folderId).populate('files').populate('subfolders').exec();

        if (!folderToDelete) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        // Check if the folder belongs to the authenticated user
        if (folderToDelete.ownerId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this folder' });
        }

        // Fetch all files and subfolders
        const filesToDelete = folderToDelete.files;
        const subfoldersToDelete = folderToDelete.subfolders;

        // Prepare an array to collect all publicIds to be deleted from Cloudinary later
        let cloudinaryPublicIds = filesToDelete.map(file => file.publicId);

        // Calculate total size of all files to be deleted
        let totalSizeToDelete = filesToDelete.reduce((total, file) => total + file.size, 0);

        // Delete all files metadata if there are any files to delete
        if (filesToDelete.length > 0) {
            await File.deleteMany({ _id: { $in: filesToDelete.map(file => file._id) } }).session(session);
        }

        // Recursively delete subfolders and their contents
        const recursiveDeleteSubfolders = async (folders) => {
            for (const subfolder of folders) {
                const subfolderDetails = await Folder.findById(subfolder._id).populate('files').populate('subfolders').exec();
                const subfolderFiles = subfolderDetails.files;
                const nestedSubfolders = subfolderDetails.subfolders;

                // Collect cloudinary publicIds from subfolder files
                cloudinaryPublicIds.push(...subfolderFiles.map(file => file.publicId));

                // Calculate total size of subfolder files to be deleted
                totalSizeToDelete += subfolderFiles.reduce((total, file) => total + file.size, 0);

                // Delete subfolder files metadata if there are any files to delete
                if (subfolderFiles.length > 0) {
                    await File.deleteMany({ _id: { $in: subfolderFiles.map(file => file._id) } }).session(session);
                }

                // Recursively delete nested subfolders
                await recursiveDeleteSubfolders(nestedSubfolders);

                // Delete subfolder metadata
                await Folder.deleteOne({ _id: subfolder._id }).session(session);
            }
        };

        // Start recursive deletion
        await recursiveDeleteSubfolders(subfoldersToDelete);

        // Delete the main folder metadata
        await Folder.deleteOne({ _id: folderId }).session(session);

        // Remove folderId from the parent folder's subfolders array
        await Folder.updateOne(
            { _id: folderToDelete.parentFolder },
            { $pull: { subfolders: folderId } }
        ).session(session);

        // Reduce the storageUsed of the user
        await User.updateOne(
            { _id: user._id },
            { $inc: { storageUsed: -totalSizeToDelete } }
        ).session(session);

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        // Attempt to delete files from Cloudinary
        for (const publicId of cloudinaryPublicIds) {
            try {
                await deleteFromCloudinary(publicId);
            } catch (error) {
                // Log the error and retry later
                fs.appendFileSync(logFilePath, publicId + '\n');
            }
        }

        res.status(200).json({ message: 'Folder and its contents deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error deleting folder:', error);
        res.status(500).json({ message: 'An error occurred while deleting the folder', error: error.message });
    }
});

export { fetchFolder, createFolder, deleteFolder };

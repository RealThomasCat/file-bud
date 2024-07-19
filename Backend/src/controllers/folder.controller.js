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
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the log file path correctly
const logFilePath = path.resolve(
    __dirname,
    "../../logs/cloudinary_delete_log.txt"
);

// FETCH FOLDER
const fetchFolder = asyncHandler(async (req, res) => {
    // Get folder id from req
    const folderId = req.params.folderId;

    // Find folder using folderId
    const folder = await Folder.findById(folderId)
        .populate("files")
        .populate("subfolders")
        .exec();

    // If folder does not exist then throw error
    if (!folder) {
        throw new ApiError(404, "Folder not found");
    }

    // Check if folder belongs to user
    if (folder.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access");
    }

    // console.log(folder); //DEBUGGING

    // Send folder object in response (contains file array and subfolder array to display in frontend)
    return res.status(200).json(new ApiResponse(200, folder, "Folder found"));
});

// CREATE NEW FOLDER
const createFolder = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Get data from req (user comes from token)
        const { currFolderId, title } = req.body;

        // Trim folder title and throw error if it is empty
        if (!title?.trim()) {
            throw new ApiError(400, "Please provide folder title");
        }

        // If current folder id is not provided then throw error
        if (!currFolderId) {
            throw new ApiError(400, "Parent folder information is missing");
        }

        // Check current folder actually exists, if not throw an error.
        const parentFolder = await Folder.findById(currFolderId)
            .populate("subfolders")
            .exec()
            .catch((err) => {
                throw new ApiError(
                    500,
                    "Error finding the Folder, Please Retry!"
                );
            });

        // If parent folder does not exist then throw error
        if (!parentFolder) {
            throw new ApiError(404, "Parent folder not found");
        }

        // console.log(parentFolder); // DEBUGGING

        // Check if parent folder belongs to user, if not throw error
        if (parentFolder.ownerId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized access");
        }

        // Check if same title folder already exists in parent folder's subfolders array
        let newTitle = title;
        let counter = 1;
        while (
            parentFolder.subfolders.some((folder) => folder.title === newTitle)
        ) {
            newTitle = `${title} (${counter})`;
            counter++;
        }

        // Create new folder (transactional operation)
        const newFolder = await Folder.create(
            [
                {
                    title: newTitle,
                    ownerId: req.user._id,
                    parentFolder: currFolderId,
                },
            ],
            { session }
        );

        // Add new folder id to parent folder's subfolders array
        parentFolder.subfolders.push(newFolder[0]._id);

        // Save parent folder (transactional operation)
        await parentFolder.save({ session });

        // throw new ApiError(500, "This error tests the integrity of transaction mechanism"); // Debugging

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
        throw new ApiError(500, error.message);
    }
});

// DELETE FOLDER
const deleteFolder = asyncHandler(async (req, res) => {
    const { folderId } = req.body; // Assuming folderId is sent in the body
    const user = req.user; // Authenticated user information

    if (user.isAccessLimited) {
        throw new ApiError(
            403,
            "Deletion is not allowed for this user at the moment"
        );
    }

    const session = await mongoose.startSession();
    let isTransactionStarted = false;

    try {
        // Check if the folder to be deleted is the user's root folder
        if (folderId.toString() === user.rootFolder.toString()) {
            return res
                .status(403)
                .json({ message: "Cannot delete root folder" });
        }

        const folderToDelete = await Folder.findById(folderId)
            .populate("files")
            .populate("subfolders")
            .exec();

        if (!folderToDelete) {
            return res.status(404).json({ message: "Folder not found" });
        }

        // Check if the folder belongs to the authenticated user
        if (folderToDelete.ownerId.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You do not have permission to delete this folder",
            });
        }

        // Fetch all files and subfolders
        const filesToDelete = folderToDelete.files;
        const subfoldersToDelete = folderToDelete.subfolders;

        // Prepare arrays to collect publicIds to be deleted from Cloudinary later
        let imagePublicIds = [];
        let videoPublicIds = [];
        let rawPublicIds = [];

        // Function to categorize publicIds based on resourceType
        const categorizePublicId = (file) => {
            if (file.resourceType === "image") {
                imagePublicIds.push(file.publicId);
            } else if (file.resourceType === "video") {
                videoPublicIds.push(file.publicId);
            } else if (file.resourceType === "raw") {
                rawPublicIds.push(file.publicId);
            }
        };

        // Calculate total size of all files to be deleted
        let totalSizeToDelete = filesToDelete.reduce(
            (total, file) => total + file.size,
            0
        );

        // Categorize publicIds of the main folder files
        filesToDelete.forEach(categorizePublicId);

        // Start the transaction
        session.startTransaction();
        isTransactionStarted = true;

        // Delete all files metadata if there are any files to delete
        if (filesToDelete.length > 0) {
            await File.deleteMany({
                _id: { $in: filesToDelete.map((file) => file._id) },
            }).session(session);
        }

        // Recursively delete subfolders and their contents
        const recursiveDeleteSubfolders = async (folders) => {
            for (const subfolder of folders) {
                const subfolderDetails = await Folder.findById(subfolder._id)
                    .populate("files")
                    .populate("subfolders")
                    .exec();
                const subfolderFiles = subfolderDetails.files;
                const nestedSubfolders = subfolderDetails.subfolders;

                // Calculate total size of subfolder files to be deleted
                totalSizeToDelete += subfolderFiles.reduce(
                    (total, file) => total + file.size,
                    0
                );

                // Categorize publicIds from subfolder files
                subfolderFiles.forEach(categorizePublicId);

                // Delete subfolder files metadata if there are any files to delete
                if (subfolderFiles.length > 0) {
                    await File.deleteMany({
                        _id: { $in: subfolderFiles.map((file) => file._id) },
                    }).session(session);
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

        // console.log("folderToDelete.parentFolder", folderToDelete.parentFolder); //DEBUGGING

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
        isTransactionStarted = false;

        // Function to attempt to delete files from Cloudinary
        const attemptDeleteFromCloudinary = async (publicIds, resourceType) => {
            if (publicIds.length === 0) return;

            try {
                await deleteFromCloudinary(publicIds, resourceType);
            } catch (error) {
                // Log the error and retry later
                let logMessage = `${resourceType}: ${publicIds.join(" ")}\n`;
                fs.appendFileSync(logFilePath, logMessage);
            }
        };

        // Attempt to delete files from Cloudinary for each resourceType
        await attemptDeleteFromCloudinary(imagePublicIds, "image");
        await attemptDeleteFromCloudinary(videoPublicIds, "video");
        await attemptDeleteFromCloudinary(rawPublicIds, "raw");

        res.status(200).json({
            message: "Folder and its contents deleted successfully",
        });
    } catch (error) {
        if (isTransactionStarted) {
            await session.abortTransaction();
            session.endSession();
        }
        console.error("Error deleting folder:", error);
        res.status(500).json({
            message: "An error occurred while deleting the folder",
            error: error.message,
        });
    }
});

export { fetchFolder, createFolder, deleteFolder };

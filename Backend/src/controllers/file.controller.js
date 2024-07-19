import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import mongoose from "mongoose";
import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { downloadFromCloudinary } from "../utils/cloudinary.js";
import {
    uploadToCloudinary,
    deleteFromCloudinary,
    cloudinaryUrlProvider,
    cloudinaryPrivateDownloadUrl,
    cloudinaryThumbnailUrl,
    cloudinaryPrivateStreamUrl,
    cloudinaryVideoStreamUrl,
} from "../utils/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the log file path correctly
const logFilePath = path.resolve(
    __dirname,
    "../../logs/cloudinary_delete_log.txt"
);
// console.log(logFilePath); //DEBUGGING

// FETCH FILE ???
const fetchFile = asyncHandler(async (req, res) => {
    const { fileId } = req.query;

    console.log("File ID", fileId); //DEBUGGING

    const requestedFile = await File.findById(fileId);
    // console.log(_id);
    console.log(requestedFile);

    // If user exists then throw error
    if (!requestedFile) {
        throw new ApiError(409, "File does not Exist");
    }

    // Check if requested file belongs to user, if not throw error
    if (requestedFile.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access");
    }

    let expires_at = requestedFile.urlExpiresAt;

    console.log("requestedFile.urlExpiresAt", requestedFile.urlExpiresAt); //DEBUGGING
    console.log("Time in Seconds Right Now-", Math.floor(Date.now() / 1000)); //DEBUGGING

    if (
        !requestedFile.urlExpiresAt ||
        requestedFile.urlExpiresAt < Math.floor(Date.now() / 1000)
    ) {
        expires_at = Math.floor(Date.now() / 1000) + 3600; // URL expires in 1hr

        requestedFile.urlExpiresAt = expires_at; // Update the urlExpiresAt field
        await requestedFile.save(); // Save the changes
        console.log("URL is changed this time"); //DEBUGGING
    }

    const signed_url = cloudinaryPrivateStreamUrl(
        requestedFile.publicId,
        requestedFile.resourceType,
        requestedFile.format,
        expires_at
    );
    console.log("signed url", signed_url); //DEBUGGING

    // res.redirect(signed_url);
    res.status(200).json(
        new ApiResponse(
            200,
            { signed_url: signed_url },
            "URL to access the resource"
        )
    );
});

// Function to provide signed_url for mru8 file for HLS streaming
const streamVideo = asyncHandler(async (req, res) => {
    const { fileId } = req.query;

    console.log("File ID", fileId); //DEBUGGING

    const requestedFile = await File.findById(fileId);
    // console.log(_id);
    console.log(requestedFile);

    // If user exists then throw error
    if (!requestedFile) {
        throw new ApiError(409, "File does not Exist");
    }

    // Check if requested file belongs to user, if not throw error
    if (requestedFile.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access");
    }

    // Check if requested file is a video, if not throw error
    if (requestedFile.resourceType !== "video") {
        throw new ApiError(403, "Requested resource is not a video");
    }

    const signed_url = cloudinaryVideoStreamUrl(requestedFile.publicId);
    console.log("signed url", signed_url); //DEBUGGING

    // res.redirect(signed_url);
    res.status(200).json(
        new ApiResponse(
            200,
            { signed_url: signed_url },
            "URL to access the m3u8 file for the video"
        )
    );
});

// UPLOAD FILE
const uploadFile = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();

    // To keep track if file is uploaded to cloudinary
    let cloudinaryPublicId = null;
    let isTransactionStarted = false;
    let uploadedFileResourceType = null;

    try {
        // Extract file path, original name and current folder id from request
        var fileLocalPath = req.file?.path;
        const originalName = req.file?.originalname;
        const currentFolderId = req.body.folderId;

        if (!fileLocalPath) {
            throw new ApiError(400, "File not uploaded");
        }

        if (!originalName) {
            throw new ApiError(400, "File name not found");
        }

        if (!currentFolderId) {
            throw new ApiError(400, "Folder not selected");
        }

        // Check if user's storage limit is exceeded, if yes throw error
        if (req.user.storageUsed + req.file.size > req.user.maxStorage) {
            throw new ApiError(400, "Storage limit exceeded");
        }

        const temp = await Folder.findById(currentFolderId);

        // console.log("Current folder before populate:", temp); // DEBUGGING

        // Check if file with same name already exists in current folder
        // Fetch current folder
        const currentFolder =
            await Folder.findById(currentFolderId).populate("files");

        // console.log("Current folder after populate:", currentFolder); // DEBUGGING

        // If currentFolder does not exist then throw error
        if (!currentFolder) {
            throw new ApiError(404, "Folder not found");
        }

        // Check if current folder belongs to user, if not throw error
        if (currentFolder.ownerId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized access");
        }

        // Obtain current folder's files array
        const currentFolderFiles = currentFolder.files.map((file) =>
            file.toObject()
        );

        // Check if file with same name already exists in current folder

        let originalFileName = req.file.originalname;

        // Make a function to check if file exists in current folder
        const fileExists = (name) =>
            currentFolderFiles.some((file) => file.title === name);

        let newFileName = originalFileName;
        let count = 1;
        while (fileExists(newFileName)) {
            const nameParts = originalFileName.split(".");
            const baseName = nameParts.slice(0, -1).join(".");
            const extension =
                nameParts.length > 1
                    ? `.${nameParts[nameParts.length - 1]}`
                    : "";
            newFileName = `${baseName} (${count})${extension}`;
            count++;
        }

        console.log("Old file local path", fileLocalPath); // DEBUGGING
        console.log("Old file name", originalFileName); // DEBUGGING

        var newFilePath = fileLocalPath;

        // Rename the file in the temp folder if the name has changed
        if (newFileName !== originalFileName) {
            const tempFolderPath = path.dirname(fileLocalPath);
            newFilePath = path.join(tempFolderPath, newFileName);
            fs.renameSync(fileLocalPath, newFilePath);
        }

        console.log("New file local path ", newFilePath); // DEBUGGING
        console.log("New file name ", newFileName); // DEBUGGING

        // What if Error occurs before uploading the file to cloudinary ??????
        // --------------------------------------- FOR DEBUGGING ------------------------------------------
        // for (let i = 0; i < 1000000000; i++) {
        //     true;
        // }
        // throw Error;
        // ------------------------------------------------------------------------------------------------

        // Upload file to cloudinary
        const uploadedFile = await uploadToCloudinary(
            newFilePath,
            req.file.mimetype
        );

        // If file is not uploaded to cloudinary throw error
        if (!uploadedFile) {
            throw new ApiError(500, "Error uploading file");
        } else {
            // If file uploaded successfully then set cloudinaryPublicId
            cloudinaryPublicId = uploadedFile.public_id;
            uploadedFileResourceType = uploadedFile.resource_type;
        }

        // What if Error occurs after file is uploaded to cloudinary
        // --------------------------------------- FOR DEBUGGING ------------------------------------------
        // throw Error; //DEBUGGING
        // ------------------------------------------------------------------------------------------------

        // Start transaction after uploading the video because mongoDB allwos only a short span
        // between start and end of a trasaction
        session.startTransaction();
        isTransactionStarted = true;

        // Create new file object in database (Returns array of created files, we need to extract first element)
        const file = await File.create(
            [
                {
                    title: newFileName,
                    size: uploadedFile.bytes,
                    duration: uploadedFile?.duration,
                    ownerId: req.user._id,
                    parentFolder: currentFolder._id,
                    publicId: uploadedFile.public_id,
                    format: uploadedFile?.format,
                    resourceType: uploadedFile.resource_type,
                },
            ],
            { session }
        );

        // ***** DOUBT ***** (Populated currentFolder contains file objects, not file ids, but still eveything is working fine, check if it is correct or not)
        currentFolder.files.push(file[0]._id);
        await currentFolder.save({ session, validateBeforeSave: false }); // DOUBT

        // console.log("Current folder after pushing:", currentFolder); // DEBUGGING

        // Update user's storage used
        const user = req.user;
        console.log("User storage used before", user.storageUsed); // DEBUGGING
        user.storageUsed += uploadedFile.bytes;
        console.log("User storage used after", user.storageUsed); // DEBUGGING
        await user.save({ session, validateBeforeSave: false });

        // Commit the transaction and end the session
        await session.commitTransaction();
        session.endSession();
        isTransactionStarted = false;

        const createdFile = file[0].toObject();

        // If we are at this point then newFilePath definitely contains the path
        // Delete the locally stored file once uploaded to cloudinary
        fs.unlinkSync(newFilePath);

        // Send file object in response
        return res
            .status(200)
            .json(new ApiResponse(200, createdFile, "File uploaded"));
    } catch (error) {
        // console.log(newFilePath, fileLocalPath); //DEBUGGING

        if (newFilePath) {
            fs.unlinkSync(newFilePath);
        } else if (fileLocalPath) {
            fs.unlinkSync(fileLocalPath);
        }

        if (isTransactionStarted) {
            await session.abortTransaction();
            session.endSession();
        }

        // Delete file from cloudinary if uploaded before error (TODO: ENSURE DELTION ALWAYS HAPPENS SUCCESSFULLY)
        if (cloudinaryPublicId) {
            try {
                await deleteFromCloudinary(
                    cloudinaryPublicId,
                    uploadedFileResourceType
                );
            } catch (error) {
                fs.appendFileSync(
                    logFilePath,
                    `${uploadedFileResourceType}: ${cloudinaryPublicId}\n`
                );
            }
        }

        throw new ApiError(500, error.message); // Correct???
    }
});

// DOWNLOAD FILE (TODO: Use ApiError in catch block?)
const downloadFile = asyncHandler(async (req, res) => {
    const { fileId } = req.query;

    console.log("File ID", fileId); //DEBUGGING

    const requestedFile = await File.findById(fileId);
    // console.log(_id);
    console.log(requestedFile);

    // If user exists then throw error
    if (!requestedFile) {
        throw new ApiError(409, "File does not Exist");
    }

    // Check if requested file belongs to user, if not throw error
    if (requestedFile.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access");
    }

    const signed_url = cloudinaryPrivateDownloadUrl(
        requestedFile.publicId,
        requestedFile.resourceType,
        requestedFile.format
    );
    console.log("signed url", signed_url); //DEBUGGING

    // res.redirect(signed_url);
    res.status(200).json(
        new ApiResponse(200, { signed_url: signed_url }, "File uploaded")
    );
});

// DELETE FILE (TODO: Use ApiError in catch block?)
const deleteFile = asyncHandler(async (req, res) => {
    const { fileId } = req.body;
    const user = req.user; // Authenticated user information

    // console.log(req.user); //DEBUGGING

    if (user.isAccessLimited) {
        throw new ApiError(
            403,
            "Deletion is not allowed for this user at the moment"
        );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check whether the file with the given ID exists
        const fileToDelete = await File.findById(fileId)
            .exec()
            .catch((err) => {
                throw new ApiError(500, "Error finding the file");
            });
        if (!fileToDelete) {
            throw new ApiError(404, "File not found");
        }

        // Check whether the file belongs to the authenticated user
        if (fileToDelete.ownerId.toString() !== user._id.toString()) {
            throw new ApiError(403, "Unauthorized access");
        }

        // Decrement storage used by the size of the file to be deleted
        await User.updateOne(
            { _id: user._id },
            { $inc: { storageUsed: -fileToDelete.size } }
        )
            .session(session)
            .catch((err) => {
                throw new ApiError(500, "Error updating user storage");
            });

        // Delete the file ID from the files array of its parent folder
        await Folder.updateOne(
            { _id: fileToDelete.parentFolder },
            { $pull: { files: fileId } }
        )
            .session(session)
            .catch((err) => {
                throw new ApiError(500, "Error updating parent folder");
            });

        // Extract Cloudinary publicId before deleting the file document
        const cloudinaryPublicId = [fileToDelete.publicId];

        // Delete the file document itself
        await File.deleteOne({ _id: fileId })
            .session(session)
            .catch((err) => {
                throw new ApiError(500, "Error deleting the file");
            });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        // Attempt to delete the file from Cloudinary
        try {
            await deleteFromCloudinary(
                cloudinaryPublicId,
                fileToDelete.resourceType
            );
        } catch (error) {
            // Log the error and retry later
            fs.appendFileSync(
                logFilePath,
                `${fileToDelete.resourceType}: ${cloudinaryPublicId[0]}\n`
            );
        }

        res.status(200).json(
            new ApiResponse(200, null, "File deleted successfully")
        );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error deleting file:", error);
        throw new ApiError(
            error.statusCode || 500,
            error.message || "An error occurred while deleting the file"
        );
    }
});

// GET FILE THUMBNAIL (TODO: Use ApiError in catch block?)
const fileThumbnail = asyncHandler(async (req, res) => {
    const fileId = req.params.id;

    const requestedFile = await File.findById(fileId);
    // console.log(_id);
    // console.log(requestedFile); //DEBUGGING

    // If user exists then throw error
    if (!requestedFile) {
        throw new ApiError(409, "File does not Exist");
    }

    // Check if requested file belongs to user, if not throw error
    if (requestedFile.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access");
    }

    // Check if requested file is image or video
    if (
        requestedFile.resourceType !== "video" &&
        requestedFile.resourceType !== "image"
    ) {
        throw new ApiError(403, "Thumbnail not supported for this file");
    }

    const signed_url = cloudinaryThumbnailUrl(
        requestedFile.publicId,
        requestedFile.resourceType,
        requestedFile.format
    );
    // console.log("signed url", signed_url); //DEBUGGING

    res.redirect(signed_url);
});

export {
    fetchFile,
    uploadFile,
    downloadFile,
    deleteFile,
    fileThumbnail,
    streamVideo,
};

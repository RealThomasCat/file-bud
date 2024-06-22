import fs from "fs";
import path from "path";
import axios from "axios";
import mongoose from "mongoose";
import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { downloadFromCloudinary } from "../utils/cloudinary.js";
import {
    uploadToCloudinary,
    deleteFromCloudinary,
} from "../utils/cloudinary.js";

// FETCH FILE
const fetchFile = asyncHandler(async (req, res) => {
    // Get file id from req
    const { fileId } = req.body;

    // Find file using fileId
    const file = await File.findById(fileId);

    // If file does not exist then throw error
    if (!file) {
        throw new ApiError(404, "File not found");
    }

    // Check if file belongs to user
    if (file.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access");
    }

    // Get file url from file object
    const fileURL = file.fileUrl;

    // If file url is not found throw error
    if (!fileURL) {
        throw new ApiError(404, "File can't be fetched");
    }

    // TODO: Bring file from cloudinary to server's public/temp folder
    const downloadedFile = await downloadFromCloudinary(fileURL);

    // If file is not downloaded throw error
    if (!downloadedFile) {
        throw new ApiError(500, "Error downloading file");
    }

    // TODO: GAND FATT GYI

    // TODO: Construct file path

    ////  Creates a readable stream from the file located at filePath.
    // const fileStream = fs.createReadStream(filePath);

    //// Sets up an event listener on the fileStream to handle the 'open' event, which is emitted when the file is successfully opened for reading.
    // fileStream.on("open", () => {
    //     // Sets the Content-Type header of the HTTP response to the MIME type of the file.
    //     // This informs the browser about the type of file being sent
    //     res.setHeader("Content-Type", file.mimeType);

    //     // Pipe the data from the file stream directly to the HTTP response.
    //     // This streams the file content to the client as it is read from disk.
    //     fileStream.pipe(res);
    // });

    ////  Set up an event listener on the fileStream to handle the 'error' event, which is emitted if an error occurs while reading the file.
    // fileStream.on("error", (err) => {
    //     throw new ApiError(500, "Error reading file");
    // });

    // Send file object in response ?
    return res
        .status(200)
        .json(new ApiResponse(200, downloadedFile, "File found"));
});

// UPLOAD FILE *** DOUBT *** (TODO: Thumbnail has to be configured in cloudinary)
const uploadFile = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    // To keep track if file is uploaded to cloudinary
    let cloudinaryPublicId = null;

    try {
        // Extract file path, original name and current folder id from request
        const fileLocalPath = req.file?.path;
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
        if (req.user.storageUsed + req.file.size > req.user.storageLimit) {
            throw new ApiError(400, "Storage limit exceeded");
        }

        const temp = await Folder.findById(currentFolderId);

        console.log("Current folder before populate:", temp); // DEBUGGING

        // Check if file with same name already exists in current folder
        // Fetch current folder
        const currentFolder = await Folder.findById(currentFolderId)
            .populate("files")
            .session(session);

        console.log("Current folder after populate:", currentFolder); // DEBUGGING

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

        let newFilePath = fileLocalPath;

        // Rename the file in the temp folder if the name has changed
        if (newFileName !== originalFileName) {
            const tempFolderPath = path.dirname(fileLocalPath);
            newFilePath = path.join(tempFolderPath, newFileName);
            fs.renameSync(fileLocalPath, newFilePath);
        }

        console.log("New file local path ", newFilePath); // DEBUGGING
        console.log("New file name ", newFileName); // DEBUGGING

        const uploadedFile = await uploadToCloudinary(newFilePath);

        if (!uploadedFile) {
            throw new ApiError(500, "Error uploading file");
        }

        cloudinaryPublicId = uploadedFile.public_id;

        // Create new file object in database (Returns array of created files, we need to extract first element)
        const file = await File.create(
            [
                {
                    title: newFileName,
                    fileUrl: uploadedFile.url,
                    thumbnail: uploadedFile?.thumbnail_url, // Thubnail url has to be configured in cloudinary
                    size: uploadedFile.bytes,
                    duration: uploadedFile?.duration,
                    ownerId: req.user._id,
                    parentFolder: currentFolder._id,
                    publicId: uploadedFile.public_id,
                    format: uploadedFile.format,
                    resourceType: uploadedFile.resource_type,
                },
            ],
            { session }
        );

        // ***** DOUBT ***** (Populated cuurentFolder contains file objects, not file ids, but still eveything is working fine, check if it is correct or not)
        currentFolder.files.push(file[0]._id);
        await currentFolder.save({ session, validateBeforeSave: false }); // DOUBT

        console.log("Current folder after pushing:", currentFolder); // DEBUGGING

        // Update user's storage used
        const user = req.user;
        console.log("User storage used before", user.storageUsed); // DEBUGGING
        user.storageUsed += uploadedFile.bytes;
        console.log("User storage used after", user.storageUsed); // DEBUGGING
        await user.save({ session, validateBeforeSave: false });

        // Commit the transaction and end the session
        await session.commitTransaction();
        session.endSession();

        // Remove publicId and fileUrl from file object before sending in response
        const createdFile = file[0].toObject();
        delete createdFile.publicId;
        delete createdFile.fileUrl;

        // Send file object in response
        return res
            .status(200)
            .json(new ApiResponse(200, createdFile, "File uploaded"));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        // Delete file from cloudinary if uploaded before error (TODO: ENSURE DELTION ALWAYS HAPPENS SUCCESSFULLY)
        if (cloudinaryPublicId) {
            try {
                await deleteFromCloudinary(cloudinaryPublicId);
            } catch (error) {
                throw new ApiError(
                    500,
                    "Error deleting file, " + error.message
                );
            }
        }

        throw new ApiError(500, error.message); // Correct???
    }
});

// DOWNLOAD FILE (TODO: Use ApiError in catch block?)
const downloadFile = asyncHandler(async (req, res) => {
    const { fileId } = req.body;

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

    try {
        const response = await axios({
            url: requestedFile.fileUrl,
            method: "GET",
            responseType: "stream",
        });

        // Set the appropriate headers
        const File_mimeType =
            requestedFile.resourceType + "/" + requestedFile.format;
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${requestedFile.title}"`
        );
        res.setHeader("Content-Type", File_mimeType);

        // Log headers for debugging (optional)
        console.log(
            `Content-Disposition: attachment; filename="${requestedFile.title}"`
        );
        console.log(`Content-Type: ${File_mimeType}`);

        // Pipe the response data to the client
        response.data.pipe(res);
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).send("Error downloading file");
    }
});

export { fetchFile, uploadFile, downloadFile };

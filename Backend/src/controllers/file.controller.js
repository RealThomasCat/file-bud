import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { downloadFromCloudinary } from "../utils/cloudinary.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

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

// UPLOAD FILE (TODO: TESTING)
const uploadFile = asyncHandler(async (req, res) => {
    const fileLocalPath = req.file?.path;

    // console.log(req.file); // DEBUGGING

    if (!fileLocalPath) {
        throw new ApiError(400, "File not uploaded");
    }

    // Check if file with same name already exists in current folder
    // Fetch current folder
    const currentFolder = await Folder.findById(req.body.folderId);

    // If currentFolder does not exist then throw error
    if (!currentFolder) {
        throw new ApiError(404, "Folder not found");
    }

    // Check if current folder belongs to user, if not throw error
    if (currentFolder.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access");
    }

    // Obtain current folder's files array
    const currentFolderFiles = currentFolder.files;

    // Check if file with same name already exists in current folder

    let originalFileName = req.file.originalname;

    // Make a function to check if file exists in current folder
    const fileExists = (name) =>
        currentFolderFiles.some((file) => file.name === name);

    let newFileName = originalFileName;
    let count = 1;
    while (fileExists(newFileName)) {
        const nameParts = originalFileName.split(".");
        const baseName = nameParts.slice(0, -1).join(".");
        const extension =
            nameParts.length > 1 ? `.${nameParts[nameParts.length - 1]}` : "";
        newFileName = `${baseName} (${count})${extension}`;
        count++;
    }

    console.log(fileLocalPath); // DEBUGGING

    let newFilePath = fileLocalPath;

    // Rename the file in the temp folder if the name has changed
    if (newFileName !== originalFileName) {
        const tempFolderPath = path.dirname(fileLocalPath);
        newFilePath = path.join(tempFolderPath, newFileName);
        fs.renameSync(fileLocalPath, newFilePath);
    }

    console.log(newFileName); // DEBUGGING

    const file = await uploadToCloudinary(newFilePath);

    if (!file) {
        throw new ApiError(500, "Error uploading file");
    }

    // Create new file object in database
    const newFile = await File.create({
        title: newFileName,
        fileUrl: file.secure_url,
        mimeType: file.format,
        size: file.bytes,
        ownerId: req.user._id,
    });

    // TODO: Add new file to current folder's files array

    // Send file object in response
    res.status(200).json(new ApiResponse(200, file, "File uploaded"));
});

// DOWNLOAD FILE
const downloadFile = asyncHandler(async (req, res) => {
    const { fileId } = req.body;

    // console.log(fileId);

    // console.log(req.user._id);

    // const { _id, email, rootFolder } = req.user;

    // const FileExists = await File.findOne({ fil });
    const requestedFile = await File.findById(fileId);
    // console.log(_id);
    console.log(requestedFile)

    // If user exists then throw error
    if (!requestedFile) {
        throw new ApiError(409, "File does not Exist");
    }

    // Check if requested file belongs to user, if not throw error
    if (requestedFile.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access");
    }



});

export { fetchFile, uploadFile, downloadFile };

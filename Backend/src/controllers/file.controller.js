import { File } from "../models/file.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { downloadFromCloudinary } from "../utils/cloudinary.js";

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

export { fetchFile };

import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Method to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // Fetch user using userId
        const user = await User.findById(userId);

        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken(); // Short-lived token, for authentication
        const refreshToken = user.generateRefreshToken(); // Long-lived token, for getting new access token

        // Update and save only refreshToken in DB (user document)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); // Skip validation (improve performance)

        // Return both tokens
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

// REGISTER USER USING TRANSACTION
const registerUser = asyncHandler(async (req, res) => {
    // A session is started using mongoose.startSession(), to group multiple operations into a single transaction.
    const session = await mongoose.startSession();

    // The transaction is started with session.startTransaction().
    // All subsequent operations associated with this session will be part of this transaction.
    session.startTransaction();
    try {
        // Get data from req
        const { email, password, fullname } = req.body;
        console.log(email, password, fullname);

        // If field exists then trim it and return true if it is empty
        if ([email, password, fullname].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "Please provide all required fields");
        }

        // Check if email is valid using javascript's regular expression test method
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(400, "Invalid email format");
        }

        // Check if user already exists: email
        const existedUser = await User.findOne({ email });

        // If user exists then throw error
        if (existedUser) {
            throw new ApiError(409, "User already exists");
        }

        // Create a root folder for the user. The { session } parameter ensures this operation is part of the transaction.
        const rootFolder = await Folder.create([{ title: "Root" }], {
            session,
        });

        // Creates the user and links the root folder's ID to the user.
        // Again, { session } ensures this operation is part of the transaction.
        const user = await User.create(
            [
                {
                    email,
                    password,
                    fullname,
                    rootFolder: rootFolder[0]._id,
                },
            ],
            { session }
        );

        // Updates the root folder to include the owner's ID and saves it within the transaction.
        rootFolder[0].ownerId = user[0]._id;
        await rootFolder[0].save({ validateBeforeSave: false, session }); // Skip validation (improve performance)

        // If all operations succeed, session.commitTransaction() commits the transaction, making all changes permanent.
        // The session is then ended with session.endSession().
        await session.commitTransaction();
        session.endSession();

        // Remove password and refreshToken from user object
        const createdUser = await User.findById(user[0]._id).select(
            "-password -refreshToken"
        );

        // Check for user creation error
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while creating user");
        }

        // Send response if user is created successfully
        return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    createdUser,
                    "User registered successfully"
                )
            );
    } catch (error) {
        // If any operation fails, the catch block is executed. session.abortTransaction() aborts the transaction, rolling back all changes.
        await session.abortTransaction();

        // The session is then ended, and the error is thrown to be handled by the error-handling middleware.
        session.endSession();
        throw error;
    }
});

// REGISTER USER OLD
const registerUserOld = asyncHandler(async (req, res) => {
    // Get data from req
    const { email, password, fullname } = req.body;
    console.log(email, password, fullname);

    // If field exists then trim it and return true if it is empty
    if ([email, password, fullname].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Please provide all required fields");
    }

    // Check if email is valid using javascript's regular expression test method
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Check if user already exists: email
    const existedUser = await User.findOne({ email });

    // If user exists then throw error
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // Create user object - create entry in DB
    const user = await User.create({
        email,
        password,
        fullname,
        // rootFolder: null,
    });

    console.log("user: ", user);

    // TODO: Remove password and refreshToken from user object
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // Check for user creation error
    if (!createdUser) {
        throw new ApiError(500, "Something went wront while creating user");
    }

    // If user is successfully created then make root folder for user
    const rootFolder = await Folder.create({
        title: "Root",
        ownerId: createdUser._id,
    });

    // FIND WORKARROUND FOR THIS (TRANSACTION)

    // Check for root folder creation error
    if (!rootFolder) {
        throw new ApiError(
            500,
            "Something went wrong while creating root folder"
        );
    }

    // Update user with root folder
    createdUser.rootFolder = rootFolder._id;
    await createdUser.save({ validateBeforeSave: false }); // Skip validation (improve performance)

    // Send response if user is created successfully
    return res.status(201).json(
        // Create and pass a new ApiResponse object
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
    // Get data from user
    const { email, password } = req.body;

    // If field exists then trim it and return true if it is empty
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Please provide all required fields");
    }

    // Check if email is valid using javascript's regular expression test method
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email");
    }

    // Find user using email
    const user = await User.findOne({ email });

    // If user does not exist then throw error
    if (!user) {
        throw new ApiError(404, "User not found with this email");
    }

    // Check if password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);

    // If password is not valid then throw error
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    /*
    DOUBT:
        -> Here we have reference of user object without or old refreshtoken.
        -> We have two choices:
            -> Again fetch user object from DB which is updated with refreshtoken or
            -> Update old user object with refreshtoken and send it in response
    */

    // console.log("user: ", user); // DEBUGGING
    // const loggedInUser = { ...user }; // *** DOUBT: Why getting additional fields after spreading user object? ***

    // Set password to undefined
    // const loggedInUser = {
    //     ...user.toObject(), // *** WHY toObject() ? ***
    //     password: undefined,
    //     refreshToken: undefined,
    // };

    // Create a new object without password and refreshToken properties
    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    // console.log("loggedInUser: ", loggedInUser); // DEBUGGING

    // Cookie options
    const options = {
        // HttpOnly: Indicates if the cookie is accessible only through the HTTP protocol and not through client-side scripts.
        httpOnly: true,
        // Secure: Indicates if the cookie should only be transmitted over secure HTTPS connections.
        secure: true,
    };

    // Send response
    return res
        .status(200)
        .cookie("accessToken", accessToken, options) // Set cookie in client browser
        .cookie("refreshToken", refreshToken, options) // Set cookie in client browser
        .json(
            new ApiResponse(
                200,
                {
                    // Good practice to also send tokens in response so to give some control to client
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});

// LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
    /*
        -> For logging out user first we need to have either id or email of user.
        -> And only the authorized user can logout, which we can verify using token.
        -> Before running the logout logic, we will use verifyJWT middleware.
        -> verifyJWT middleware will first verify the user on basis of access token.
        -> If token is valid then it will find and add the user object to req object.
        -> Then out logout method can use req object to get user object.
    */

    // Remove refresh token from DB
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true, // Return updated document rather than original document
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    // Clear cookies and send response
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

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

// FETCH FILE
const fetchFile = asyncHandler(async (req, res) => {
    // Get file id from req
    const { fileId } = req.params;

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
        throw new ApiError(404, "File data not found");
    }

    // TODO: Bring file from cloudinary to server's public/temp folder

    // TODO: GAND FATT GYI

    // TODO: Construct file path

    //  Creates a readable stream from the file located at filePath.
    const fileStream = fs.createReadStream(filePath);

    // Sets up an event listener on the fileStream to handle the 'open' event, which is emitted when the file is successfully opened for reading.
    fileStream.on("open", () => {
        // Sets the Content-Type header of the HTTP response to the MIME type of the file.
        // This informs the browser about the type of file being sent
        res.setHeader("Content-Type", file.mimeType);

        // Pipe the data from the file stream directly to the HTTP response.
        // This streams the file content to the client as it is read from disk.
        fileStream.pipe(res);
    });

    //  Set up an event listener on the fileStream to handle the 'error' event, which is emitted if an error occurs while reading the file.
    fileStream.on("error", (err) => {
        throw new ApiError(500, "Error reading file");
    });

    // Send file object in response ?
    // return res.status(200).json(new ApiResponse(200, file, "File found"));
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

export {
    registerUser,
    loginUser,
    logoutUser,
    fetchFolder,
    fetchFile,
    createFolder,
};

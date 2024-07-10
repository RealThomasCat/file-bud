import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Folder } from "../models/folder.model.js";
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
        throw new ApiError(500, error.message);
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
        secure: false, // TODO: Change to true in production
        maxAge: 24 * 60 * 60 * 1000, //cookie will expire after 1 day
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
            $unset: {
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

// GET USER
const getUser = asyncHandler(async (req, res) => {
    // console.log(req.user);
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User authenticated"));
});

export { registerUser, loginUser, logoutUser, getUser };

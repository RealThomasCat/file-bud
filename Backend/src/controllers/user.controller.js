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
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Update and save only refreshToken in DB (user document)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); // Skip validation (improve performance)

        // Return both tokens
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
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
            "Something went wront while creating root folder"
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

    // console.log("user: ", user);
    // const loggedInUser = { ...user }; // *** DOUBT: Why getting additional fields after spreading user object? ***

    // Set password to undefined
    // const loggedInUser = {
    //     ...user.toObject(), // *** IMPORTANT ***
    //     password: undefined,
    //     refreshToken: undefined,
    // };

    // Create a new object without password and refreshToken properties
    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    console.log("loggedInUser: ", loggedInUser);

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

// TODO: LOGOUT USER

export { registerUser, loginUser };

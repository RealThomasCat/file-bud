import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // Get data from req
    const { email, password, fullname } = req.body;
    console.log(email, password, fullname);

    // If field exists then trim it and return true if it is empty
    if ([email, password, fullname].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Please provide all required fields");
    }

    // TODO: Check if email is valid

    // Check if user already exists: email
    const existedUser = await User.findOne({ email });

    // If user exists then throw error
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // TODO: Add root folder

    // Create user object - create entry in DB
    const user = await User.create({
        email,
        password,
        fullname,
        // root folder ???
    });

    // Remove password and refreshToken from user object
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // Check for user creation error
    if (!createdUser) {
        throw new ApiError(500, "Something went wront while creating user");
    }

    // Send response if user is created successfully
    return res.status(201).json(
        // Create and pass a new ApiResponse object
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

export { registerUser };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Method to verify JWT token then find and inject authenticated user to req object
export const verifyJWT = asyncHandler(async (req, res, next) => {
    // DOUBT: Why do we need to use try-catch block here? If we already used asyncHandler?
    try {
        // Get access token from cookies or header (Header Format-> "Authorization: Bearer <token>")
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", ""); // Separating token from header

        // Check if token exists
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify token using jwt.verify method
        // If the token is valid, jwt.verify extracts and returns the decoded payload.
        // Throws error if token is invalid or expired
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Using user id from decoded token, find user from DB
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        // If user doesn't exist then throw error
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user; // Middleware adds user to req object
        next(); // Move to next (Like logout, delete user, etc.)
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

// Importing Router from express
import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// Creating a new router
const router = Router();

// Routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;

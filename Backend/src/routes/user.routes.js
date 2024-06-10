// Importing Router from express
import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";

// Creating a new router
const router = Router();

// Defining routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

export default router;

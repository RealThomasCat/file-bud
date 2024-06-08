// Importing Router from express
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

// Creating a new router
const router = Router();

// Registering a new user
router.route("/register").post(registerUser);

export default router;

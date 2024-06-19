import { Router } from "express";
import { uploadFile } from "../controllers/file.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// Creating a new router
const router = Router();

// Routes
// Secured routes
router.route("/uploadFile").post(verifyJWT, uploadFile);

export default router;

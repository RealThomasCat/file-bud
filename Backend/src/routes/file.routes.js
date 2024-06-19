import { Router } from "express";
import { uploadFile } from "../controllers/file.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// Creating a new router
const router = Router();

// Routes
// Secured routes
router.route("/fetchFile").post(verifyJWT, fetchFile);
router.route("/uploadFile").post(verifyJWT, uploadFile);
router.route("/downloadFile").post(verifyJWT, downloadFile);

export default router;

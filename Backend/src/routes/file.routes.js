import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    uploadFile,
    fetchFile,
    downloadFile,
} from "../controllers/file.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

// Creating a new router
const router = Router();

// Routes
// Secured routes
router.route("/fetch").post(verifyJWT, fetchFile);
router.route("/upload").post(verifyJWT, upload.single("file"), uploadFile); // TODO: Make secure
router.route("/download").post(verifyJWT, downloadFile);

export default router;

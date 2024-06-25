import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    uploadFile,
    fetchFile,
    downloadFile,
    deleteFile
} from "../controllers/file.controller.js";
import {
    multerErrorHandler,
    upload,
} from "../middlewares/multer.middleware.js";

// Creating a new router
const router = Router();

// Routes
// Secured routes
router.route("/fetch").post(verifyJWT, fetchFile);
router.route("/upload").post(
    verifyJWT,
    upload.single("file"),
    multerErrorHandler, // REVIEW: Is this necessary?
    uploadFile
); // TODO: Make secure
router.route("/download").post(verifyJWT, downloadFile);
router.route("/delete").post(verifyJWT, deleteFile);

export default router;

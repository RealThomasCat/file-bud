import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    uploadFile,
    fetchFile,
    downloadFile,
    deleteFile,
    fileThumbnail,
    streamVideo,
} from "../controllers/file.controller.js";
import {
    multerErrorHandler,
    upload,
} from "../middlewares/multer.middleware.js";

// Creating a new router
const router = Router();

// Routes
// Secured routes
router.route("/fetch").get(verifyJWT, fetchFile);
router.route("/stream").get(verifyJWT, streamVideo);
router.route("/upload").post(
    verifyJWT,
    upload.single("file"),
    multerErrorHandler, // REVIEW: Is this necessary?
    uploadFile
); // TODO: Make secure
router.route("/download").get(verifyJWT, downloadFile);
router.route("/delete").delete(verifyJWT, deleteFile);
router.route("/thumbnail/:id").get(verifyJWT, fileThumbnail);

export default router;

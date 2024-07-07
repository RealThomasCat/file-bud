// Importing Router from express
import { Router } from "express";
import {
    createFolder,
    fetchFolder,
    deleteFolder,
} from "../controllers/folder.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// Creating a new router
const router = Router();

// Routes
// Secured routes
router.route("/create").post(verifyJWT, createFolder);
router.route("/fetch/:id").get(verifyJWT, fetchFolder);
router.route("/delete").post(verifyJWT, deleteFolder);

export default router;

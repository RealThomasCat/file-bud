import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // TODO: Change file name to unique name
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB
    },
});

export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res
                .status(413)
                .send(
                    "Error: File size is too large. Maximum allowed size is 100 MB."
                );
        }
        // Handle other Multer errors
        return res.status(400).send(`Multer error: ${err.message}`);
    }
    next(err); // Pass to the next middleware if not a Multer error
};

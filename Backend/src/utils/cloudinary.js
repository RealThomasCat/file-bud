import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// UPLOAD FILE TO CLOUDINARY
const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            type: 'authenticated'
        });

        // file has been uploaded successfully
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        console.log("Error uploading file to cloudinary", error.message);
        return null;
    }
};

// DOWNLOAD FILE FROM CLOUDINARY TO LOCAL STORAGE (TODO: TEST)
const downloadFromCloudinary = async (fileURL) => {
    try {
        if (!fileURL) return null;

        // Fetch the file from cloudinary
        const response = await cloudinary.uploader.fetch(fileURL);

        const fileTitle = response.title;

        // Append userId to the file title
        fileTitle = `${Date.now()}-${fileTitle}`;

        // Save the downloaded file on local storage
        fs.writeFileSync(fileTitle, response);

        return response;
    } catch (error) {
        return null;
    }
};

// DELETE FILE FROM CLOUDINARY (TODO: TEST) DOUBT: fileURL or public_id?
const deleteFromCloudinary = async (fileURL) => {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
            if (!fileURL) return null;

            // Fetch the file from cloudinary
            const response = await cloudinary.uploader.destroy(fileURL);

            return response;
        } catch (error) {
            attempt++;
            if (attempt < MAX_RETRIES) {
                console.error(
                    `Attempt ${attempt} to delete file failed, retrying...`
                );
                await new Promise((resolve) =>
                    setTimeout(resolve, RETRY_DELAY)
                );
            } else {
                console.error("All attempts to delete the file failed");
                throw new Error("Failed to delete file from Cloudinary");
            }
        }
    }
};

// Provides signed url for authenticated uploads
const cloudinaryUrlProvider = (publicId, resource_type) => {

    return cloudinary.url(publicId, {
        type: "authenticated",
        resource_type: resource_type,
        sign_url: true,
    });
};

export { uploadToCloudinary, downloadFromCloudinary, deleteFromCloudinary, cloudinaryUrlProvider };

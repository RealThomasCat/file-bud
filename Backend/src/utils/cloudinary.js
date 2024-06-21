import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Debugging
console.log(
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET
);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// UPLOAD FILE TO CLOUDINARY
const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
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

// DELETE FILE FROM CLOUDINARY (TODO: TEST)
const deleteFromCloudinary = async (fileURL) => {
    try {
        if (!fileURL) return null;

        // Fetch the file from cloudinary
        const response = await cloudinary.uploader.destroy(fileURL);

        return response;
    } catch (error) {
        return null;
    }
};

export { uploadToCloudinary, downloadFromCloudinary, deleteFromCloudinary };

import { v2 as cloudinary } from "cloudinary";
import { timeStamp } from "console";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// UPLOAD FILE TO CLOUDINARY
const uploadToCloudinary = async (localFilePath, mimeType) => {
    try {
        // throw Error; //DEBUGGING
        if (!localFilePath) return null;

        const response = mimeType.startsWith("video")
            ? await cloudinary.uploader.upload(localFilePath, {
                  resource_type: "video",
                  type: "authenticated",
                  eager: [{ streaming_profile: "hd", format: "m3u8" }],
                  eager_async: true,
              })
            : await cloudinary.uploader.upload(localFilePath, {
                  resource_type: "auto",
                  type: "authenticated",
              });

        // file has been uploaded successfully
        // fs.unlinkSync(localFilePath);
        // console.log(response); //DEBUGGING
        return response;
    } catch (error) {
        // fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
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

// ***OLD*** DELETE FILE FROM CLOUDINARY (TODO: TEST) DOUBT: fileURL or public_id?
// const deleteFromCloudinary = async (fileURL) => {
//     let attempt = 0;
//     while (attempt < MAX_RETRIES) {
//         try {
//             if (!fileURL) return null;

//             // Fetch the file from cloudinary
//             const response = await cloudinary.uploader.destroy(fileURL);

//             return response;
//         } catch (error) {
//             attempt++;
//             if (attempt < MAX_RETRIES) {
//                 console.error(
//                     `Attempt ${attempt} to delete file failed, retrying...`
//                 );
//                 await new Promise((resolve) =>
//                     setTimeout(resolve, RETRY_DELAY)
//                 );
//             } else {
//                 console.error("All attempts to delete the file failed");
//                 throw new Error("Failed to delete file from Cloudinary");
//             }
//         }
//     }
// };

// ***NEW*** DELETE A SINGLE FILE or AN ARRAY OF FILES (of same resource_type) FROM CLOUDINARY
const deleteFromCloudinary = async (publicIds, resourceType) => {
    // throw Error; //DEBUGGING
    const result = await cloudinary.api.delete_resources(publicIds, {
        type: "authenticated",
        resource_type: resourceType,
    });
    // console.log("Files deleted:", result); //DEBUGGING
};

// Provides signed url for authenticated uploads
const cloudinaryUrlProvider = (publicId, resource_type) => {
    return cloudinary.url(publicId, {
        type: "authenticated",
        resource_type: resource_type,
        sign_url: true,
    });
};

// Provides TIME LIMITED downloadable signed url for authenticated uploads
const cloudinaryPrivateDownloadUrl = (publicId, resource_type, format) => {
    const options = {
        type: "authenticated", // Use 'authenticated' type for private videos
        resource_type: resource_type,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // URL expires in 1hr
        attachment: true, // Indicate that the content should be downloaded
    };

    return cloudinary.utils.private_download_url(publicId, format, options);
};

// Provides TIME LIMITED streamable signed url for authenticated uploads
const cloudinaryPrivateStreamUrl = (
    publicId,
    resource_type,
    format,
    expires_at
) => {
    const options = {
        type: "authenticated", // Use 'authenticated' type for private videos
        resource_type: resource_type,
        expires_at: expires_at,
        timestamp: 323123123123,
    };

    return cloudinary.utils.private_download_url(publicId, format, options);
};

// Provides m3u8 file signed url for HLS streaming authenticated video uploads
const cloudinaryVideoStreamUrl = (publicId) => {
    const options = {
        resource_type: "video",
        type: "authenticated", // Use 'authenticated' type for private videos
        streaming_profile: "hd",
        format: "m3u8",
        secure: true,
        sign_url: true,
        // flags: 'attachment'  //Just add this if you want to download the file
    };

    return cloudinary.url(publicId, options);
};

// Provides signed url for thumnail of authenticated uploads
const cloudinaryThumbnailUrl = (publicId, resource_type, format) => {
    let thumbnailUrl = null;
    if (resource_type === "image" || resource_type === "video") {
        const transformations = [
            { width: 300, height: 300, crop: "thumb", gravity: "north" },
        ];

        if (resource_type === "video") {
            transformations.push(
                { fetch_format: "jpg" },
                { start_offset: "auto" }
            );
        } else if (resource_type === "image" && format === "pdf") {
            transformations.push({ page: 1, fetch_format: "jpg" });
        }

        thumbnailUrl = cloudinary.url(publicId, {
            resource_type: resource_type,
            type: "authenticated",
            sign_url: true,
            transformation: transformations,
            format: "jpg", // Ensure the output is in JPG format for videos and PDFs
        });
    }

    return thumbnailUrl;
};

export {
    uploadToCloudinary,
    downloadFromCloudinary,
    deleteFromCloudinary,
    cloudinaryUrlProvider,
    cloudinaryPrivateDownloadUrl,
    cloudinaryThumbnailUrl,
    cloudinaryPrivateStreamUrl,
    cloudinaryVideoStreamUrl,
};

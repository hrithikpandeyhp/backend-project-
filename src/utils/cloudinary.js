
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    
        cloud_name: "vynf7fy5",
        api_key: "271672546955418",
        api_secret: "**********",
});

console.log("Cloudinary environment check:", {
    cloudName: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    apiKey: Boolean(process.env.CLOUDINARY_API_KEY),
    apiSecret: Boolean(process.env.CLOUDINARY_API_SECRET),
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) {
        console.log("No local file path provided");
        return null;
    }

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("Cloudinary upload successful!");
        console.log("URL:", response.secure_url);
        console.log("Public ID:", response.public_id);

        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        return null;
    } finally {
        // Delete temporary file whether upload succeeds or fails
        fs.promises.unlink(localFilePath).catch((err) => {
            if (err.code !== "ENOENT") {
                console.error("Temporary file cleanup failed:", err.message);
            }
        });
    }
};

export { uploadOnCloudinary };

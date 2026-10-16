import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    // 1. Postman / Frontend se details lena
    const { fullName, email, username, password } = req.body;

    // 2. Validation - check karna ki koi field empty toh nahi hai
    if (
        [fullName, email, username, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields (fullName, email, username, password) are required");
    }

    // 3. Check karna ki user pehle se exist toh nahi karta (username ya email se)
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // 4. File paths check karna (Multer se req.files me aati hain)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // 5. Cloudinary par upload karna
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;
    console.log("Avatar path:", avatarLocalPath);
    console.log("Cover image path:", coverImageLocalPath);
    console.log("Avatar:", avatar);
    console.log("Cover image:", coverImage);
    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed on Cloudinary");
    }

    // 6. MongoDB Atlas me user create karna
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // 7. Response ke liye user fetch karna bina password aur refreshToken ke
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 8. Success response bhejna
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export { registerUser };
// Aise import karein (bina braces ke):
import asyncHandler from "../utils/asyncHandler.js";

// Option A: Agar aap 'export const' use kar rahe hain
export const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok"
    });
});

// YA Option B: Agar aap niche export kar rahe hain (jaisa aapne pehle bheja tha)
/*
const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok"
    });
});

export { registerUser };
*/
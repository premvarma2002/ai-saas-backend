import express from "express";
import {
    getMe,
    getUserStats,
    getAchievements,
    updateProfile,
    changePassword,
    deleteAccount,
} from "../Controller/UserController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

// Protected routes
router.get("/me", verifyToken, getMe);
router.get("/stats", verifyToken, getUserStats);
router.get("/achievements", verifyToken, getAchievements);
router.put("/profile", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);
router.delete("/account", verifyToken, deleteAccount);

export default router;

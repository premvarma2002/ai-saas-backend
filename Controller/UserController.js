import Auth from "../Schema/AuthSchema.js";
import { errorHandler } from "../Utils/ErrorHandler.js";
import { SuccessHandler } from "../Utils/SuccessHandler.js";

// Get current user profile
const getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await Auth.findById(userId).select("-password -refreshToken");
        if (!user) {
            return errorHandler(res, {}, 404, "User not found");
        }

        return SuccessHandler(res, 200, "User profile retrieved successfully", {
            id: user._id,
            name: user.name,
            email: user.email,
            plan: user.plan,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.log("Error fetching user profile:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Get user statistics
const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // For now, returning mock data. In future, calculate from actual portfolio data
        const stats = {
            memberSince: "Jan 2024",
            totalTrades: 124,
            winRate: 68,
            bestReturn: 45.2,
        };

        return SuccessHandler(res, 200, "User stats retrieved successfully", stats);
    } catch (error) {
        console.log("Error fetching user stats:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Get user achievements
const getAchievements = async (req, res) => {
    try {
        const achievements = [
            {
                id: "first_trade",
                title: "First Trade",
                description: "Made your first stock purchase",
                unlocked: true,
            },
            {
                id: "portfolio_builder",
                title: "Portfolio Builder",
                description: "Added 10+ stocks to portfolio",
                unlocked: false,
            },
            {
                id: "profit_maker",
                title: "Profit Maker",
                description: "Achieved 10%+ return",
                unlocked: false,
            },
            {
                id: "ai_expert",
                title: "AI Expert",
                description: "Used AI insights 50+ times",
                unlocked: false,
            },
            {
                id: "diamond_hands",
                title: "Diamond Hands",
                description: "Held a stock for 1+ year",
                unlocked: false,
            },
            {
                id: "diversified",
                title: "Diversified",
                description: "Own stocks in 5+ sectors",
                unlocked: false,
            },
        ];

        return SuccessHandler(
            res,
            200,
            "Achievements retrieved successfully",
            achievements
        );
    } catch (error) {
        console.log("Error fetching achievements:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, avatarUrl } = req.body;

        if (!name && !avatarUrl) {
            return errorHandler(
                res,
                {},
                400,
                "Please provide name or avatarUrl to update"
            );
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (avatarUrl) updateData.avatarUrl = avatarUrl;

        const updatedUser = await Auth.findByIdAndUpdate(userId, updateData, {
            new: true,
        }).select("-password -refreshToken");

        return SuccessHandler(res, 200, "Profile updated successfully", {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            plan: updatedUser.plan,
        });
    } catch (error) {
        console.log("Error updating profile:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return errorHandler(
                res,
                {},
                400,
                "Current password and new password are required"
            );
        }

        const user = await Auth.findById(userId);
        if (!user) {
            return errorHandler(res, {}, 404, "User not found");
        }

        // Verify current password
        const bcrypt = (await import("bcrypt")).default;
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return errorHandler(res, {}, 400, "Current password is incorrect");
        }

        // Hash new password
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        return SuccessHandler(res, 200, "Password changed successfully", {});
    } catch (error) {
        console.log("Error changing password:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Delete account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { confirmation } = req.body;

        if (confirmation !== "DELETE") {
            return errorHandler(
                res,
                {},
                400,
                'Confirmation must be "DELETE"'
            );
        }

        await Auth.findByIdAndDelete(userId);

        return SuccessHandler(res, 200, "Account deleted successfully", {});
    } catch (error) {
        console.log("Error deleting account:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

export {
    getMe,
    getUserStats,
    getAchievements,
    updateProfile,
    changePassword,
    deleteAccount,
};

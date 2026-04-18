import Alert from "../Schema/AlertSchema.js";
import AlertPreferences from "../Schema/AlertPreferencesSchema.js";
import { errorHandler } from "../Utils/ErrorHandler.js";
import { SuccessHandler } from "../Utils/SuccessHandler.js";

// Get paginated alerts
const getAlerts = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            page = 1,
            limit = 20,
            type = "all",
            unread = false,
        } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build filter
        const filter = { userId };
        if (type && type !== "all") {
            filter.type = type;
        }
        if (unread === "true") {
            filter.read = false;
        }

        // Get total count
        const total = await Alert.countDocuments(filter);

        // Get paginated alerts
        const alerts = await Alert.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        // Count unread
        const unreadCount = await Alert.countDocuments({
            userId,
            read: false,
        });

        return SuccessHandler(res, 200, "Alerts retrieved successfully", {
            total,
            unread: unreadCount,
            page: pageNum,
            limit: limitNum,
            alerts: alerts.map((alert) => ({
                id: alert._id,
                type: alert.type,
                stock: alert.stock,
                title: alert.title,
                message: alert.message,
                read: alert.read,
                createdAt: alert.createdAt,
            })),
        });
    } catch (error) {
        console.log("Error fetching alerts:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Get alert statistics
const getAlertStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const total = await Alert.countDocuments({ userId });
        const unread = await Alert.countDocuments({ userId, read: false });
        const priceAlerts = await Alert.countDocuments({
            userId,
            type: "price",
        });
        const aiSignals = await Alert.countDocuments({
            userId,
            type: "ai",
        });

        return SuccessHandler(res, 200, "Alert stats retrieved successfully", {
            total,
            unread,
            priceAlerts,
            aiSignals,
        });
    } catch (error) {
        console.log("Error fetching alert stats:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Mark single alert as read
const markAlertAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const alert = await Alert.findById(id);
        if (!alert) {
            return errorHandler(res, {}, 404, "Alert not found");
        }

        // Verify ownership
        if (alert.userId.toString() !== userId) {
            return errorHandler(res, {}, 403, "Unauthorized");
        }

        alert.read = true;
        await alert.save();

        return SuccessHandler(res, 200, "Alert marked as read", {});
    } catch (error) {
        console.log("Error marking alert as read:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Mark all alerts as read
const markAllAlertsAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Alert.updateMany({ userId, read: false }, { read: true });

        return SuccessHandler(res, 200, "All alerts marked as read", {});
    } catch (error) {
        console.log("Error marking all alerts as read:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Delete (dismiss) a single alert
const deleteAlert = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const alert = await Alert.findById(id);
        if (!alert) {
            return errorHandler(res, {}, 404, "Alert not found");
        }

        // Verify ownership
        if (alert.userId.toString() !== userId) {
            return errorHandler(res, {}, 403, "Unauthorized");
        }

        await Alert.findByIdAndDelete(id);

        return SuccessHandler(res, 200, "Alert dismissed successfully", {});
    } catch (error) {
        console.log("Error deleting alert:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Get alert preferences
const getAlertPreferences = async (req, res) => {
    try {
        const userId = req.user.id;

        let preferences = await AlertPreferences.findOne({ userId });

        // Create default preferences if not found
        if (!preferences) {
            preferences = new AlertPreferences({
                userId,
                priceAlerts: true,
                aiRecommendations: true,
                newsUpdates: false,
                marketTrends: true,
                portfolioChanges: true,
            });
            await preferences.save();
        }

        return SuccessHandler(
            res,
            200,
            "Alert preferences retrieved successfully",
            {
                priceAlerts: preferences.priceAlerts,
                aiRecommendations: preferences.aiRecommendations,
                newsUpdates: preferences.newsUpdates,
                marketTrends: preferences.marketTrends,
                portfolioChanges: preferences.portfolioChanges,
            }
        );
    } catch (error) {
        console.log("Error fetching alert preferences:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Update alert preferences
const updateAlertPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            priceAlerts,
            aiRecommendations,
            newsUpdates,
            marketTrends,
            portfolioChanges,
        } = req.body;

        const updateData = {};
        if (priceAlerts !== undefined) updateData.priceAlerts = priceAlerts;
        if (aiRecommendations !== undefined)
            updateData.aiRecommendations = aiRecommendations;
        if (newsUpdates !== undefined) updateData.newsUpdates = newsUpdates;
        if (marketTrends !== undefined) updateData.marketTrends = marketTrends;
        if (portfolioChanges !== undefined)
            updateData.portfolioChanges = portfolioChanges;

        let preferences = await AlertPreferences.findOne({ userId });

        if (!preferences) {
            preferences = new AlertPreferences({ userId, ...updateData });
        } else {
            Object.assign(preferences, updateData);
        }

        await preferences.save();

        return SuccessHandler(
            res,
            200,
            "Alert preferences updated successfully",
            {
                priceAlerts: preferences.priceAlerts,
                aiRecommendations: preferences.aiRecommendations,
                newsUpdates: preferences.newsUpdates,
                marketTrends: preferences.marketTrends,
                portfolioChanges: preferences.portfolioChanges,
            }
        );
    } catch (error) {
        console.log("Error updating alert preferences:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Create price alert
const createPriceAlert = async (req, res) => {
    try {
        const userId = req.user.id;
        const { symbol, targetPrice, condition } = req.body;

        if (!symbol || !targetPrice || !condition) {
            return errorHandler(
                res,
                {},
                400,
                "Symbol, targetPrice, and condition are required"
            );
        }

        if (!["above", "below"].includes(condition)) {
            return errorHandler(
                res,
                {},
                400,
                "Condition must be 'above' or 'below'"
            );
        }

        const alert = new Alert({
            userId,
            type: "price",
            stock: symbol.toUpperCase(),
            title: `Price Alert: ${symbol}`,
            message: `${symbol} reached your target price of $${targetPrice}`,
            read: false,
        });

        await alert.save();

        return SuccessHandler(res, 201, "Price alert created successfully", {
            id: alert._id,
            symbol: alert.stock,
            targetPrice,
            condition,
        });
    } catch (error) {
        console.log("Error creating price alert:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

export {
    getAlerts,
    getAlertStats,
    markAlertAsRead,
    markAllAlertsAsRead,
    deleteAlert,
    getAlertPreferences,
    updateAlertPreferences,
    createPriceAlert,
};

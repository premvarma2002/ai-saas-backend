import Settings from "../Schema/SettingsSchema.js";
import Session from "../Schema/SessionSchema.js";
import { errorHandler } from "../Utils/ErrorHandler.js";
import { SuccessHandler } from "../Utils/SuccessHandler.js";

// Get all user settings
const getSettings = async (req, res) => {
    try {
        const userId = req.user.id;

        let settings = await Settings.findOne({ userId });

        // Create default settings if not found
        if (!settings) {
            settings = new Settings({
                userId,
                general: {
                    language: "English",
                    currency: "USD",
                    timezone: "UTC",
                },
                notifications: {
                    email: true,
                    push: true,
                    sms: false,
                    priceAlerts: true,
                    aiInsights: true,
                    marketNews: true,
                },
                security: {
                    twoFactorEnabled: false,
                },
                appearance: {
                    theme: "dark",
                    compactMode: false,
                },
            });
            await settings.save();
        }

        return SuccessHandler(res, 200, "Settings retrieved successfully", {
            general: settings.general,
            notifications: settings.notifications,
            security: {
                twoFactorEnabled: settings.security.twoFactorEnabled,
            },
            appearance: settings.appearance,
        });
    } catch (error) {
        console.log("Error fetching settings:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Update user settings (partial update supported)
const updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { general, notifications, appearance } = req.body;

        let settings = await Settings.findOne({ userId });

        if (!settings) {
            settings = new Settings({ userId });
        }

        // Update general settings
        if (general) {
            if (general.language) settings.general.language = general.language;
            if (general.currency) settings.general.currency = general.currency;
            if (general.timezone) settings.general.timezone = general.timezone;
        }

        // Update notifications
        if (notifications) {
            if (notifications.email !== undefined)
                settings.notifications.email = notifications.email;
            if (notifications.push !== undefined)
                settings.notifications.push = notifications.push;
            if (notifications.sms !== undefined)
                settings.notifications.sms = notifications.sms;
            if (notifications.priceAlerts !== undefined)
                settings.notifications.priceAlerts = notifications.priceAlerts;
            if (notifications.aiInsights !== undefined)
                settings.notifications.aiInsights = notifications.aiInsights;
            if (notifications.marketNews !== undefined)
                settings.notifications.marketNews = notifications.marketNews;
        }

        // Update appearance
        if (appearance) {
            if (appearance.theme) settings.appearance.theme = appearance.theme;
            if (appearance.compactMode !== undefined)
                settings.appearance.compactMode = appearance.compactMode;
        }

        await settings.save();

        return SuccessHandler(res, 200, "Settings updated successfully", {
            general: settings.general,
            notifications: settings.notifications,
            appearance: settings.appearance,
        });
    } catch (error) {
        console.log("Error updating settings:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Get active sessions
const getActiveSessions = async (req, res) => {
    try {
        const userId = req.user.id;

        const sessions = await Session.find({ userId })
            .sort({ lastActive: -1 })
            .select("-sessionToken");

        return SuccessHandler(res, 200, "Sessions retrieved successfully", {
            sessions: sessions.map((session) => ({
                id: session._id,
                device: session.device,
                ip: session.ip,
                location: session.location,
                lastActive: session.lastActive,
                current: session.isCurrent,
            })),
        });
    } catch (error) {
        console.log("Error fetching sessions:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Revoke (delete) a specific session
const revokeSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            return errorHandler(res, {}, 404, "Session not found");
        }

        // Verify ownership
        if (session.userId.toString() !== userId) {
            return errorHandler(res, {}, 403, "Unauthorized");
        }

        await Session.findByIdAndDelete(id);

        return SuccessHandler(res, 200, "Session revoked successfully", {});
    } catch (error) {
        console.log("Error revoking session:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Enable 2FA - generate QR code and secret
const enable2FA = async (req, res) => {
    try {
        const userId = req.user.id;

        // In production, use speakeasy or similar library to generate secret
        // For now, returning mock data
        const secret = "JBSWY3DPEHPK3PXP"; // Mock secret
        const qrCode =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="; // Mock QR code

        return SuccessHandler(res, 200, "2FA setup initiated", {
            qrCode,
            secret,
            message: "Scan this QR code with your authenticator app",
        });
    } catch (error) {
        console.log("Error enabling 2FA:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Verify and confirm 2FA
const verify2FA = async (req, res) => {
    try {
        const userId = req.user.id;
        const { code } = req.body;

        if (!code) {
            return errorHandler(res, {}, 400, "Verification code is required");
        }

        // In production, verify code against secret using speakeasy
        // For now, assuming code is valid if 6 digits
        if (!/^\d{6}$/.test(code)) {
            return errorHandler(res, {}, 400, "Invalid code format");
        }

        let settings = await Settings.findOne({ userId });
        if (!settings) {
            settings = new Settings({ userId });
        }

        settings.security.twoFactorEnabled = true;
        settings.security.twoFactorSecret = "JBSWY3DPEHPK3PXP"; // In production, store the actual secret
        await settings.save();

        return SuccessHandler(res, 200, "2FA enabled successfully", {
            twoFactorEnabled: true,
        });
    } catch (error) {
        console.log("Error verifying 2FA:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Disable 2FA
const disable2FA = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        if (!password) {
            return errorHandler(res, {}, 400, "Password is required");
        }

        let settings = await Settings.findOne({ userId });
        if (!settings) {
            return errorHandler(res, {}, 404, "Settings not found");
        }

        settings.security.twoFactorEnabled = false;
        settings.security.twoFactorSecret = undefined;
        await settings.save();

        return SuccessHandler(res, 200, "2FA disabled successfully", {
            twoFactorEnabled: false,
        });
    } catch (error) {
        console.log("Error disabling 2FA:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

export {
    getSettings,
    updateSettings,
    getActiveSessions,
    revokeSession,
    enable2FA,
    verify2FA,
    disable2FA,
};

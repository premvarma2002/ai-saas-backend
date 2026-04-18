import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
            unique: true,
        },
        general: {
            language: {
                type: String,
                default: "English",
            },
            currency: {
                type: String,
                default: "USD",
            },
            timezone: {
                type: String,
                default: "UTC",
            },
        },
        notifications: {
            email: {
                type: Boolean,
                default: true,
            },
            push: {
                type: Boolean,
                default: true,
            },
            sms: {
                type: Boolean,
                default: false,
            },
            priceAlerts: {
                type: Boolean,
                default: true,
            },
            aiInsights: {
                type: Boolean,
                default: true,
            },
            marketNews: {
                type: Boolean,
                default: true,
            },
        },
        security: {
            twoFactorEnabled: {
                type: Boolean,
                default: false,
            },
            twoFactorSecret: {
                type: String,
            },
        },
        appearance: {
            theme: {
                type: String,
                enum: ["light", "dark"],
                default: "dark",
            },
            compactMode: {
                type: Boolean,
                default: false,
            },
        },
    },
    { timestamps: true, versionKey: false }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;

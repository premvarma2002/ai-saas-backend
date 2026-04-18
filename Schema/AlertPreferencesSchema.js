import mongoose from "mongoose";

const alertPreferencesSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
            unique: true,
        },
        priceAlerts: {
            type: Boolean,
            default: true,
        },
        aiRecommendations: {
            type: Boolean,
            default: true,
        },
        newsUpdates: {
            type: Boolean,
            default: false,
        },
        marketTrends: {
            type: Boolean,
            default: true,
        },
        portfolioChanges: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, versionKey: false }
);

const AlertPreferences = mongoose.model("AlertPreferences", alertPreferencesSchema);
export default AlertPreferences;

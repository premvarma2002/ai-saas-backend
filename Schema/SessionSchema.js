import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },
        sessionToken: {
            type: String,
            required: true,
            unique: true,
        },
        device: {
            type: String,
            default: "Unknown Device",
        },
        ip: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            default: "Unknown Location",
        },
        lastActive: {
            type: Date,
            default: Date.now,
        },
        isCurrent: {
            type: Boolean,
            default: false,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
    },
    { timestamps: true, versionKey: false }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;

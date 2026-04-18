import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },
        type: {
            type: String,
            enum: ["price", "ai", "news", "warning"],
            default: "price",
        },
        stock: {
            type: String,
            uppercase: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false }
);

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;

import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        plan: {
            type: String,
            enum: ["free", "premium"],
            default: "free",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true, versionKey: false }
);

const Auth = mongoose.model("Auth", authSchema);
export default Auth;

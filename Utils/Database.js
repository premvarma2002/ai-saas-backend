import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || typeof mongoUri !== "string" || mongoUri.trim() === "") {
        console.error(
            "MongoDB connection failed: MONGO_URI is not set. Please define MONGO_URI in your environment or .env file."
        );
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log(
            "MongoDB connected successfully",
            mongoose.connection.host.toString()
        );
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit process with failure
    }
};
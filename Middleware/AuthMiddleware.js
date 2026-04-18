import jwt from "jsonwebtoken";
import { errorHandler } from "../Utils/ErrorHandler.js";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
        
        if (!token) {
            return errorHandler(res, {}, 401, "No token provided");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return errorHandler(res, error.message, 401, "Token expired");
        }
        return errorHandler(res, error.message, 401, "Invalid token");
    }
};

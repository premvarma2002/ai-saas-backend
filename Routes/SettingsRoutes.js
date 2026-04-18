import express from "express";
import {
    getSettings,
    updateSettings,
    getActiveSessions,
    revokeSession,
    enable2FA,
    verify2FA,
    disable2FA,
} from "../Controller/SettingsController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

// Settings Routes
router.get("/", verifyToken, getSettings);
router.put("/", verifyToken, updateSettings);

// Session Routes
router.get("/sessions", verifyToken, getActiveSessions);
router.delete("/sessions/:id", verifyToken, revokeSession);

// 2FA Routes
router.post("/2fa/enable", verifyToken, enable2FA);
router.post("/2fa/verify", verifyToken, verify2FA);
router.post("/2fa/disable", verifyToken, disable2FA);

export default router;

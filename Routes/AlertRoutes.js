import express from "express";
import {
    getAlerts,
    getAlertStats,
    markAlertAsRead,
    markAllAlertsAsRead,
    deleteAlert,
    getAlertPreferences,
    updateAlertPreferences,
    createPriceAlert,
} from "../Controller/AlertController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

// Alert Routes
router.get("/", verifyToken, getAlerts);
router.get("/stats", verifyToken, getAlertStats);
router.patch("/:id/read", verifyToken, markAlertAsRead);
router.patch("/read-all", verifyToken, markAllAlertsAsRead);
router.delete("/:id", verifyToken, deleteAlert);

// Alert Preferences Routes
router.get("/preferences", verifyToken, getAlertPreferences);
router.put("/preferences", verifyToken, updateAlertPreferences);

// Price Alert Routes
router.post("/price-alert", verifyToken, createPriceAlert);

export default router;

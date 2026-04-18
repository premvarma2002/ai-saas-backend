import express from "express";
import {
    getSubscription,
    getBillingHistory,
    changePlan,
    cancelSubscription,
} from "../Controller/BillingController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

// Billing Routes
router.get("/subscription", verifyToken, getSubscription);
router.get("/history", verifyToken, getBillingHistory);
router.post("/change-plan", verifyToken, changePlan);
router.post("/cancel", verifyToken, cancelSubscription);

export default router;

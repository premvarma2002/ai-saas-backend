import express from "express";
import {
    getPortfolioPerformance,
    getPortfolioAllocation,
    getTopPerformers,
    getMonthlyPerformance,
} from "../Controller/StockController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

// Portfolio Analytics Routes
router.get("/performance", verifyToken, getPortfolioPerformance);
router.get("/allocation", verifyToken, getPortfolioAllocation);
router.get("/top-performers", verifyToken, getTopPerformers);
router.get("/monthly-performance", verifyToken, getMonthlyPerformance);

export default router;

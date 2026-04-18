import express from "express";
import {
    getPortfolioSummary,
    getPortfolioStocks,
    addStock,
    updateStock,
    deleteStock,
    clearPortfolio,
} from "../Controller/PortfolioController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

// Protected routes
router.get("/summary", verifyToken, getPortfolioSummary);
router.get("/stocks", verifyToken, getPortfolioStocks);
router.post("/stocks", verifyToken, addStock);
router.put("/stocks/:id", verifyToken, updateStock);
router.delete("/stocks/:id", verifyToken, deleteStock);
router.delete("/clear", verifyToken, clearPortfolio);

export default router;

import Stock from "../Schema/StockSchema.js";
import { errorHandler } from "../Utils/ErrorHandler.js";
import { SuccessHandler } from "../Utils/SuccessHandler.js";

// Get portfolio summary - 4 stat cards
const getPortfolioSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const stocks = await Stock.find({ userId });

        // Calculate stats
        let portfolioValue = 0;
        let totalInvested = 0;

        stocks.forEach((stock) => {
            const stockValue = stock.shares * (stock.currentPrice || stock.avgCost);
            const stockInvested = stock.shares * stock.avgCost;
            portfolioValue += stockValue;
            totalInvested += stockInvested;
        });

        const totalGain = portfolioValue - totalInvested;
        const totalGainPercent =
            totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(2) : 0;
        const activeStocksCount = stocks.length;
        const aiPredictionAccuracy = 87; // Mock data for now

        return SuccessHandler(
            res,
            200,
            "Portfolio summary retrieved successfully",
            {
                portfolioValue: parseFloat(portfolioValue.toFixed(2)),
                totalGain: parseFloat(totalGain.toFixed(2)),
                totalGainPercent: parseFloat(totalGainPercent),
                activeStocksCount,
                aiPredictionAccuracy,
            }
        );
    } catch (error) {
        console.log("Error fetching portfolio summary:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Get all stocks in portfolio
const getPortfolioStocks = async (req, res) => {
    try {
        const userId = req.user.id;

        const stocks = await Stock.find({ userId });

        // Map to response format with calculated gain/loss
        const formattedStocks = stocks.map((stock) => ({
            id: stock._id,
            symbol: stock.symbol,
            name: stock.name,
            shares: stock.shares,
            avgCost: stock.avgCost,
            currentPrice: stock.currentPrice || stock.avgCost,
            value: parseFloat((stock.shares * (stock.currentPrice || stock.avgCost)).toFixed(2)),
            gain: parseFloat((stock.shares * ((stock.currentPrice || stock.avgCost) - stock.avgCost)).toFixed(2)),
            gainPercent:
                stock.avgCost > 0
                    ? parseFloat(
                        (
                            (((stock.currentPrice || stock.avgCost) - stock.avgCost) /
                            stock.avgCost) *
                            100
                        ).toFixed(2)
                    )
                    : 0,
            trend: (stock.currentPrice || stock.avgCost) >= stock.avgCost ? "up" : "down",
            sector: stock.sector,
        }));

        return SuccessHandler(
            res,
            200,
            "Portfolio stocks retrieved successfully",
            formattedStocks
        );
    } catch (error) {
        console.log("Error fetching portfolio stocks:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Add a new stock to portfolio
const addStock = async (req, res) => {
    try {
        const userId = req.user.id;
        const { symbol, shares, avgCost, purchaseDate, name, sector } = req.body;

        // Validation
        if (!symbol || shares === undefined || !avgCost) {
            return errorHandler(
                res,
                {},
                400,
                "Symbol, shares, and avgCost are required"
            );
        }

        if (shares <= 0 || avgCost <= 0) {
            return errorHandler(
                res,
                {},
                400,
                "Shares and avgCost must be positive numbers"
            );
        }

        const newStock = new Stock({
            userId,
            symbol: symbol.toUpperCase(),
            name: name || symbol,
            shares,
            avgCost,
            purchaseDate: purchaseDate || new Date(),
            sector: sector || "Technology",
        });

        await newStock.save();

        return SuccessHandler(res, 201, "Stock added successfully", {
            id: newStock._id,
            symbol: newStock.symbol,
            name: newStock.name,
            shares: newStock.shares,
            avgCost: newStock.avgCost,
            purchaseDate: newStock.purchaseDate,
            sector: newStock.sector,
        });
    } catch (error) {
        console.log("Error adding stock:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Update a stock in portfolio
const updateStock = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { shares, avgCost, currentPrice, sector } = req.body;

        if (!shares && !avgCost && !currentPrice && !sector) {
            return errorHandler(
                res,
                {},
                400,
                "At least one field is required to update"
            );
        }

        const updateData = {};
        if (shares !== undefined) {
            if (shares <= 0) {
                return errorHandler(res, {}, 400, "Shares must be positive");
            }
            updateData.shares = shares;
        }
        if (avgCost !== undefined) {
            if (avgCost <= 0) {
                return errorHandler(res, {}, 400, "avgCost must be positive");
            }
            updateData.avgCost = avgCost;
        }
        if (currentPrice !== undefined) updateData.currentPrice = currentPrice;
        if (sector) updateData.sector = sector;

        const updatedStock = await Stock.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedStock) {
            return errorHandler(res, {}, 404, "Stock not found");
        }

        // Verify ownership
        if (updatedStock.userId.toString() !== userId) {
            return errorHandler(res, {}, 403, "Unauthorized");
        }

        return SuccessHandler(res, 200, "Stock updated successfully", {
            id: updatedStock._id,
            symbol: updatedStock.symbol,
            name: updatedStock.name,
            shares: updatedStock.shares,
            avgCost: updatedStock.avgCost,
            currentPrice: updatedStock.currentPrice,
        });
    } catch (error) {
        console.log("Error updating stock:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Delete a stock from portfolio
const deleteStock = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const stock = await Stock.findById(id);

        if (!stock) {
            return errorHandler(res, {}, 404, "Stock not found");
        }

        // Verify ownership
        if (stock.userId.toString() !== userId) {
            return errorHandler(res, {}, 403, "Unauthorized");
        }

        await Stock.findByIdAndDelete(id);

        return SuccessHandler(res, 200, "Stock removed successfully", {});
    } catch (error) {
        console.log("Error deleting stock:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Clear all portfolio data (Danger Zone)
const clearPortfolio = async (req, res) => {
    try {
        const userId = req.user.id;
        const { confirmation } = req.body;

        if (confirmation !== "CLEAR_ALL") {
            return errorHandler(
                res,
                {},
                400,
                'Confirmation must be "CLEAR_ALL"'
            );
        }

        // Delete all stocks for this user
        await Stock.deleteMany({ userId });

        return SuccessHandler(res, 200, "Portfolio cleared successfully", {});
    } catch (error) {
        console.log("Error clearing portfolio:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

export {
    getPortfolioSummary,
    getPortfolioStocks,
    addStock,
    updateStock,
    deleteStock,
    clearPortfolio,
};

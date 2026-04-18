import Stock from "../Schema/StockSchema.js";
import { errorHandler } from "../Utils/ErrorHandler.js";
import { SuccessHandler } from "../Utils/SuccessHandler.js";

// Get portfolio performance time-series data
const getPortfolioPerformance = async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = "30d" } = req.query;

        // Map period to days
        const periodDays = {
            "7d": 7,
            "30d": 30,
            "90d": 90,
            "1y": 365,
        };

        const days = periodDays[period] || 30;
        const series = [];

        // Generate mock time-series data (in production, calculate from historical price data)
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });

            // Generate realistic portfolio values (with some variance)
            const baseValue = 20000;
            const variance = Math.sin(i * 0.1) * 2000 + Math.random() * 1000;
            const value = parseFloat((baseValue + variance).toFixed(2));

            series.push({ date: dateStr, value });
        }

        return SuccessHandler(
            res,
            200,
            "Portfolio performance retrieved successfully",
            { period, series }
        );
    } catch (error) {
        console.log("Error fetching portfolio performance:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Get portfolio allocation by sector
const getPortfolioAllocation = async (req, res) => {
    try {
        const userId = req.user.id;

        const stocks = await Stock.find({ userId });

        // Group by sector and calculate percentages
        const sectorMap = {};
        let totalValue = 0;

        stocks.forEach((stock) => {
            const value = stock.shares * (stock.currentPrice || stock.avgCost);
            totalValue += value;

            if (!sectorMap[stock.sector]) {
                sectorMap[stock.sector] = 0;
            }
            sectorMap[stock.sector] += value;
        });

        const allocation = Object.entries(sectorMap).map(([sector, value]) => ({
            sector,
            percent: totalValue > 0 ? parseInt((value / totalValue) * 100) : 0,
            value: parseFloat(value.toFixed(2)),
        }));

        // Sort by value descending
        allocation.sort((a, b) => b.value - a.value);

        return SuccessHandler(
            res,
            200,
            "Portfolio allocation retrieved successfully",
            allocation
        );
    } catch (error) {
        console.log("Error fetching portfolio allocation:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Get top performing stocks
const getTopPerformers = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 5 } = req.query;

        const stocks = await Stock.find({ userId }).limit(parseInt(limit));

        // Calculate gain percent and sort
        const performers = stocks
            .map((stock) => {
                const currentPrice = stock.currentPrice || stock.avgCost;
                const gainPercent =
                    stock.avgCost > 0
                        ? ((currentPrice - stock.avgCost) / stock.avgCost) * 100
                        : 0;

                return {
                    symbol: stock.symbol,
                    name: stock.name,
                    currentPrice,
                    changePercent: parseFloat(gainPercent.toFixed(2)),
                    trend: currentPrice >= stock.avgCost ? "up" : "down",
                    holdingsValue: parseFloat(
                        (stock.shares * currentPrice).toFixed(2)
                    ),
                };
            })
            .sort((a, b) => b.changePercent - a.changePercent);

        return SuccessHandler(
            res,
            200,
            "Top performers retrieved successfully",
            performers.slice(0, parseInt(limit))
        );
    } catch (error) {
        console.log("Error fetching top performers:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Get monthly performance (gain/loss by month)
const getMonthlyPerformance = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year = new Date().getFullYear() } = req.query;

        // Generate mock monthly data (in production, calculate from actual transactions)
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const monthlyData = months.map((month, index) => ({
            month,
            gain: parseFloat((Math.random() * 2000 + 500).toFixed(2)),
            loss: parseFloat((Math.random() * 500).toFixed(2)),
        }));

        return SuccessHandler(
            res,
            200,
            "Monthly performance retrieved successfully",
            monthlyData
        );
    } catch (error) {
        console.log("Error fetching monthly performance:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

export {
    getPortfolioPerformance,
    getPortfolioAllocation,
    getTopPerformers,
    getMonthlyPerformance,
};

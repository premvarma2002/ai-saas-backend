import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./Utils/Database.js";
import AuthRouter from "./Routes/AuthRoutes.js";
import UserRouter from "./Routes/UserRoutes.js";
import PortfolioRouter from "./Routes/PortfolioRoutes.js";
import StockRouter from "./Routes/StockRoutes.js";
import AlertRouter from "./Routes/AlertRoutes.js";
import SettingsRouter from "./Routes/SettingsRoutes.js";
import BillingRouter from "./Routes/BillingRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Hello World Backend API!");
});

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/portfolio", PortfolioRouter);
app.use("/api/stocks", StockRouter);
app.use("/api/alerts", AlertRouter);
app.use("/api/settings", SettingsRouter);
app.use("/api/billing", BillingRouter);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();

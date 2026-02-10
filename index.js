import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./Utils/Database.js";
import AuthRouter from "./Routes/AuthRoutes.js";

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

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});

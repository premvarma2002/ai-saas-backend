import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },
        symbol: {
            type: String,
            required: true,
            uppercase: true,
        },
        name: {
            type: String,
            required: true,
        },
        shares: {
            type: Number,
            required: true,
            min: 0,
        },
        avgCost: {
            type: Number,
            required: true,
            min: 0,
        },
        currentPrice: {
            type: Number,
            default: 0,
        },
        purchaseDate: {
            type: Date,
            default: Date.now,
        },
        sector: {
            type: String,
            default: "Technology",
        },
    },
    { timestamps: true, versionKey: false }
);

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;

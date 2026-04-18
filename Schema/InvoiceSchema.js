import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },
        invoiceId: {
            type: String,
            required: true,
            unique: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "USD",
        },
        billingDate: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["paid", "pending", "failed", "canceled"],
            default: "paid",
        },
        plan: {
            type: String,
            enum: ["free", "pro", "enterprise"],
        },
        downloadUrl: {
            type: String,
        },
        stripeInvoiceId: {
            type: String,
        },
    },
    { timestamps: true, versionKey: false }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;

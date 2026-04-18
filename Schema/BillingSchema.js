import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
            unique: true,
        },
        plan: {
            type: String,
            enum: ["free", "pro", "enterprise"],
            default: "free",
        },
        price: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "USD",
        },
        billingCycle: {
            type: String,
            enum: ["monthly", "yearly", null],
            default: null,
        },
        nextBillingDate: {
            type: Date,
            default: null,
        },
        stripeCustomerId: {
            type: String,
        },
        stripeSubscriptionId: {
            type: String,
        },
        features: {
            type: [String],
            default: ["5 stocks", "basic AI insights"],
        },
        status: {
            type: String,
            enum: ["active", "inactive", "canceled", "past_due"],
            default: "active",
        },
    },
    { timestamps: true, versionKey: false }
);

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;

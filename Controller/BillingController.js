import Billing from "../Schema/BillingSchema.js";
import Invoice from "../Schema/InvoiceSchema.js";
import { errorHandler } from "../Utils/ErrorHandler.js";
import { SuccessHandler } from "../Utils/SuccessHandler.js";

// Get subscription details
const getSubscription = async (req, res) => {
    try {
        const userId = req.user.id;

        let billing = await Billing.findOne({ userId });

        // Create default billing if not found
        if (!billing) {
            billing = new Billing({
                userId,
                plan: "free",
                price: 0,
                currency: "USD",
                billingCycle: null,
                nextBillingDate: null,
                features: ["5 stocks", "basic AI insights"],
                status: "active",
            });
            await billing.save();
        }

        return SuccessHandler(
            res,
            200,
            "Subscription retrieved successfully",
            {
                plan: billing.plan,
                price: billing.price,
                currency: billing.currency,
                billingCycle: billing.billingCycle,
                nextBillingDate: billing.nextBillingDate,
                features: billing.features,
                status: billing.status,
            }
        );
    } catch (error) {
        console.log("Error fetching subscription:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Get billing history (invoices)
const getBillingHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const total = await Invoice.countDocuments({ userId });

        const invoices = await Invoice.find({ userId })
            .sort({ billingDate: -1 })
            .skip(skip)
            .limit(limitNum)
            .select("-stripeInvoiceId");

        return SuccessHandler(res, 200, "Billing history retrieved successfully", {
            total,
            page: pageNum,
            limit: limitNum,
            invoices: invoices.map((invoice) => ({
                id: invoice.invoiceId,
                date: invoice.billingDate,
                amount: invoice.amount,
                currency: invoice.currency,
                status: invoice.status,
                plan: invoice.plan,
                downloadUrl: invoice.downloadUrl,
            })),
        });
    } catch (error) {
        console.log("Error fetching billing history:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Upgrade/change plan (mock implementation)
const changePlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { plan } = req.body;

        if (!plan || !["free", "pro", "enterprise"].includes(plan)) {
            return errorHandler(res, {}, 400, "Invalid plan");
        }

        let billing = await Billing.findOne({ userId });
        if (!billing) {
            billing = new Billing({ userId });
        }

        const planDetails = {
            free: {
                price: 0,
                features: ["5 stocks", "basic AI insights"],
                billingCycle: null,
            },
            pro: {
                price: 29,
                features: [
                    "Unlimited stocks",
                    "Advanced AI insights",
                    "Real-time alerts",
                    "Priority support",
                ],
                billingCycle: "monthly",
            },
            enterprise: {
                price: 99,
                features: [
                    "Unlimited stocks",
                    "Advanced AI insights",
                    "Real-time alerts",
                    "API access",
                    "Dedicated support",
                ],
                billingCycle: "monthly",
            },
        };

        const details = planDetails[plan];

        billing.plan = plan;
        billing.price = details.price;
        billing.features = details.features;
        billing.billingCycle = details.billingCycle;

        if (plan !== "free") {
            const nextBillingDate = new Date();
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
            billing.nextBillingDate = nextBillingDate;
        } else {
            billing.nextBillingDate = null;
        }

        await billing.save();

        return SuccessHandler(res, 200, "Plan upgraded successfully", {
            plan: billing.plan,
            price: billing.price,
            features: billing.features,
            nextBillingDate: billing.nextBillingDate,
        });
    } catch (error) {
        console.log("Error changing plan:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

// Cancel subscription (mock)
const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user.id;

        let billing = await Billing.findOne({ userId });
        if (!billing) {
            return errorHandler(res, {}, 404, "Billing record not found");
        }

        billing.plan = "free";
        billing.price = 0;
        billing.features = ["5 stocks", "basic AI insights"];
        billing.status = "canceled";
        billing.billingCycle = null;
        billing.nextBillingDate = null;

        await billing.save();

        return SuccessHandler(res, 200, "Subscription canceled successfully", {
            plan: "free",
            status: "canceled",
        });
    } catch (error) {
        console.log("Error canceling subscription:", error);
        return errorHandler(res, error.message, 500, "Server error");
    }
};

export {
    getSubscription,
    getBillingHistory,
    changePlan,
    cancelSubscription,
};

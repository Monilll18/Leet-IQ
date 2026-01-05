import mongoose from "mongoose";

const storeOrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StoreProduct",
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        productImage: {
            type: String,
            default: "",
        },
        coinsCost: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled", "completed"],
            default: "pending",
        },
        // For physical items
        shippingAddress: {
            name: String,
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
            phone: String,
        },
        // For premium redemptions
        premiumActivated: {
            type: Boolean,
            default: false,
        },
        // Tracking info
        trackingNumber: {
            type: String,
            default: null,
        },
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const StoreOrder = mongoose.model("StoreOrder", storeOrderSchema);

export default StoreOrder;

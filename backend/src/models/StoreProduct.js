import mongoose from "mongoose";

const storeProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            enum: ["featured", "merchandise", "premium", "digital", "earn"],
            default: "merchandise",
        },
        stock: {
            type: Number,
            default: -1, // -1 means unlimited
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        // For premium products - duration in days
        premiumDays: {
            type: Number,
            default: null,
        },
        // For earn products - coins rewarded
        coinsReward: {
            type: Number,
            default: null,
        },
        // Track redemptions
        totalRedemptions: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const StoreProduct = mongoose.model("StoreProduct", storeProductSchema);

export default StoreProduct;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        profileImage: {
            type: String,
            default: "",
        },
        clerkId: {
            type: String,
            required: true,
            unique: true,
        },
        coins: {
            type: Number,
            default: 0,
        },
        streak: {
            type: Number,
            default: 0,
        },
        lastSolvedDate: {
            type: Date,
            default: null,
        },
        dailyCheckInDate: {
            type: Date,
            default: null,
        },
        solvedProblems: [{
            type: String,
        }],
        isAdmin: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        banned: {
            type: Boolean,
            default: false,
        },
        bannedReason: {
            type: String,
            default: null,
        },
        bannedAt: {
            type: Date,
            default: null,
        },
        // Premium Subscription Fields
        isPremium: {
            type: Boolean,
            default: false,
        },
        premiumPlan: {
            type: String,
            enum: ['monthly', 'yearly', null],
            default: null,
        },
        premiumExpiresAt: {
            type: Date,
            default: null,
        },
        stripeCustomerId: {
            type: String,
            default: null,
        },
        stripeSubscriptionId: {
            type: String,
            default: null,
        },
        // Track daily problem solving for free tier limits
        dailyProblemsSolved: {
            type: Number,
            default: 0,
        },
        lastProblemSolvedDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true } // createdAt, updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;

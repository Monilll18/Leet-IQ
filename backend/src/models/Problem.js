import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            text: {
                type: String,
                required: true,
            },
            notes: [{
                type: String,
            }],
        },
        examples: [{
            input: String,
            output: String,
            explanation: String,
        }],
        constraints: [{
            type: String,
        }],
        functionName: {
            type: String,
            required: true,
        },
        testCases: [{
            params: mongoose.Schema.Types.Mixed,
            expected: mongoose.Schema.Types.Mixed,
        }],
        timeLimit: {
            type: Number,
            default: 2000, // milliseconds
        },
        memoryLimit: {
            type: Number,
            default: 128, // MB
        },
        starterCode: {
            javascript: String,
            python: String,
            java: String,
            cpp: String,
        },
        hints: [{
            type: String,
        }],
        tags: [{
            type: String,
        }],
        companyTags: [{
            type: String,
            enum: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'Spotify', 'Adobe', 'Oracle', 'Salesforce', 'PayPal', 'Stripe', 'Bloomberg', 'Goldman Sachs', 'JPMorgan', 'Other'],
        }],
        isPremiumOnly: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;

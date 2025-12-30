import mongoose from "mongoose";
import Problem from "./src/models/Problem.js";
import { PROBLEMS as BACKEND_PROBLEMS } from "./src/data/problems.js";
import dotenv from "dotenv";

dotenv.config();

// Import frontend problems data (has full metadata)
const FRONTEND_PROBLEMS = {
    "two-sum": {
        title: "Two Sum",
        difficulty: "Easy",
        category: "Array • Hash Table",
        description: {
            text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
            notes: [
                "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
                "You can return the answer in any order.",
            ],
        },
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
            },
            {
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]",
            },
        ],
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists.",
        ],
    },
    // Add more problems here as needed
};

async function seedProblems() {
    try {
        // Import env
        const { env } = await import("./src/lib/env.js");

        // Connect to MongoDB
        await mongoose.connect(env.DB_URL);
        console.log("✅ Connected to MongoDB");

        // Clear existing problems
        await Problem.deleteMany({});
        console.log("🗑️  Cleared existing problems");

        // Merge backend and frontend data
        const problemsToSeed = [];

        for (const [id, backendData] of Object.entries(BACKEND_PROBLEMS)) {
            const frontendData = FRONTEND_PROBLEMS[id] || {};

            const problem = {
                id,
                title: frontendData.title || id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                difficulty: frontendData.difficulty || "Easy",
                category: frontendData.category || "General",
                description: frontendData.description || {
                    text: `Solve the ${id} problem`,
                    notes: [],
                },
                examples: frontendData.examples || [],
                constraints: frontendData.constraints || [],
                functionName: backendData.functionName,
                testCases: backendData.testCases,
                timeLimit: backendData.timeLimit || 2000,
                memoryLimit: backendData.memoryLimit || 128,
                starterCode: frontendData.starterCode || {},
                hints: frontendData.hints || [],
                tags: frontendData.tags || [],
                isActive: true,
            };

            problemsToSeed.push(problem);
        }

        // Insert problems
        const result = await Problem.insertMany(problemsToSeed);
        console.log(`✅ Seeded ${result.length} problems`);

        // Display summary
        console.log("\n📊 Summary:");
        console.log(`   Total: ${result.length}`);
        console.log(`   Easy: ${result.filter(p => p.difficulty === 'Easy').length}`);
        console.log(`   Medium: ${result.filter(p => p.difficulty === 'Medium').length}`);
        console.log(`   Hard: ${result.filter(p => p.difficulty === 'Hard').length}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding problems:", error);
        process.exit(1);
    }
}

seedProblems();

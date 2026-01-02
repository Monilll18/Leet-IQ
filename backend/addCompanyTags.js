/**
 * Script to add company tags to existing problems
 * Run with: node addCompanyTags.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "./src/models/Problem.js";

dotenv.config();

// Company tags mapping based on problem categories and difficulty
const COMPANY_TAGS_MAP = {
    // Arrays - commonly asked by FAANG
    "two-sum": ["Google", "Meta", "Amazon", "Apple", "Microsoft"],
    "reverse-string": ["Google", "Amazon", "Microsoft"],
    "contains-duplicate": ["Amazon", "Apple", "Microsoft"],
    "maximum-subarray": ["Google", "Meta", "Amazon", "Microsoft", "LinkedIn"],
    "merge-sorted-array": ["Meta", "Microsoft", "Amazon"],
    "remove-duplicates": ["Google", "Amazon", "Adobe"],
    "rotate-array": ["Microsoft", "Amazon", "Adobe"],
    "best-time-buy-sell": ["Amazon", "Meta", "Goldman Sachs"],

    // Linked Lists
    "reverse-linked-list": ["Google", "Meta", "Amazon", "Microsoft"],
    "merge-two-sorted-lists": ["Amazon", "Apple", "Microsoft"],
    "linked-list-cycle": ["Meta", "Amazon", "Microsoft"],

    // Trees
    "binary-tree-inorder": ["Google", "Meta", "Amazon"],
    "maximum-depth-binary-tree": ["Google", "Amazon", "Microsoft"],
    "symmetric-tree": ["Amazon", "Microsoft", "LinkedIn"],

    // Dynamic Programming
    "climbing-stairs": ["Google", "Amazon", "Apple", "Adobe"],
    "coin-change": ["Google", "Meta", "Amazon", "Uber"],
    "house-robber": ["Amazon", "LinkedIn", "Airbnb"],

    // Strings
    "valid-parentheses": ["Google", "Meta", "Amazon", "Microsoft", "Bloomberg"],
    "valid-anagram": ["Amazon", "Spotify", "Adobe"],
    "longest-substring-without-repeating": ["Google", "Meta", "Amazon", "Microsoft", "Bloomberg"],
    "palindrome-number": ["Amazon", "Adobe", "PayPal"],

    // Binary Search
    "binary-search": ["Google", "Microsoft", "Amazon"],
    "search-insert-position": ["Google", "Amazon", "Apple"],

    // Graphs
    "number-of-islands": ["Google", "Meta", "Amazon", "Microsoft"],
    "word-search": ["Meta", "Amazon", "Bloomberg"],
};

// Premium-only problems (harder/more valuable ones)
const PREMIUM_ONLY_IDS = [
    "coin-change",
    "longest-substring-without-repeating",
    "number-of-islands",
    "word-search",
    "house-robber"
];

async function addCompanyTags() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB");

        const problems = await Problem.find({});
        console.log(`Found ${problems.length} problems`);

        for (const problem of problems) {
            const companyTags = COMPANY_TAGS_MAP[problem.id] || ["Other"];
            const isPremiumOnly = PREMIUM_ONLY_IDS.includes(problem.id);

            await Problem.findByIdAndUpdate(problem._id, {
                companyTags,
                isPremiumOnly
            });

            console.log(`Updated: ${problem.id} -> Companies: ${companyTags.join(", ")}${isPremiumOnly ? " [PREMIUM]" : ""}`);
        }

        console.log("\n✅ All problems updated with company tags!");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

addCompanyTags();

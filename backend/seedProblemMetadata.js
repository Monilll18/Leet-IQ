import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "./src/models/Problem.js";

dotenv.config();

// Comprehensive hints, tags, and company mappings for ALL 22 problems
const PROBLEM_METADATA = {
    "two-sum": {
        tags: ["Array", "Hash Table"],
        companyTags: ["Google", "Amazon", "Meta", "Apple", "Microsoft"],
        hints: [
            "Consider using a hash map to store values you've seen.",
            "For each element, check if target - element exists in the map.",
            "You can do this in a single pass through the array."
        ]
    },
    "reverse-string": {
        tags: ["String", "Two Pointers"],
        companyTags: ["Amazon", "Microsoft", "Apple"],
        hints: [
            "Use two pointers, one at the start and one at the end.",
            "Swap characters at both pointers and move them towards each other.",
            "Continue until the pointers meet in the middle."
        ]
    },
    "valid-palindrome": {
        tags: ["String", "Two Pointers"],
        companyTags: ["Meta", "Microsoft", "Apple"],
        hints: [
            "Convert to lowercase and remove non-alphanumeric characters.",
            "Use two pointers from both ends.",
            "Compare characters until they meet."
        ]
    },
    "maximum-subarray": {
        tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
        companyTags: ["Amazon", "Apple", "Microsoft", "LinkedIn", "Goldman Sachs"],
        hints: [
            "Think about Kadane's algorithm.",
            "At each position, decide: start new subarray or extend current one.",
            "Keep track of both current sum and maximum sum seen."
        ]
    },
    "container-with-most-water": {
        tags: ["Array", "Two Pointers", "Greedy"],
        companyTags: ["Amazon", "Google", "Microsoft", "Goldman Sachs"],
        hints: [
            "Use two pointers at both ends.",
            "Calculate area and move pointer with smaller height.",
            "Greedy: moving smaller gives chance for larger area."
        ],
        isPremiumOnly: true
    },
    "valid-parentheses": {
        tags: ["String", "Stack"],
        companyTags: ["Amazon", "Google", "Meta", "Bloomberg"],
        hints: [
            "Use a stack to keep track of opening brackets.",
            "When you see a closing bracket, check if it matches the top of stack.",
            "At the end, the stack should be empty."
        ]
    },
    "merge-two-sorted-lists": {
        tags: ["Linked List", "Recursion"],
        companyTags: ["Amazon", "Microsoft", "Apple", "Meta"],
        hints: [
            "Compare heads of both lists.",
            "Attach the smaller one and recurse.",
            "Handle edge cases when one list is empty."
        ]
    },
    "climbing-stairs": {
        tags: ["Dynamic Programming", "Math", "Memoization"],
        companyTags: ["Amazon", "Apple", "Google", "Adobe"],
        hints: [
            "This is similar to the Fibonacci sequence.",
            "dp[i] = dp[i-1] + dp[i-2]",
            "You only need to keep track of the last two values."
        ]
    },
    "valid-anagram": {
        tags: ["Hash Table", "String", "Sorting"],
        companyTags: ["Amazon", "Microsoft", "Uber"],
        hints: [
            "Both strings must have the same characters.",
            "Use a frequency counter or sorting approach.",
            "If sorted versions are equal, they are anagrams."
        ]
    },
    "majority-element": {
        tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting"],
        companyTags: ["Amazon", "Google", "Microsoft"],
        hints: [
            "Use Boyer-Moore Voting Algorithm for O(1) space.",
            "Or use a hash map to count frequencies.",
            "The majority element appears more than n/2 times."
        ]
    },
    "move-zeroes": {
        tags: ["Array", "Two Pointers"],
        companyTags: ["Meta", "Apple", "Bloomberg"],
        hints: [
            "Use two pointers: one for iteration, one for placing non-zeros.",
            "Swap when you find a non-zero element.",
            "All zeros will naturally shift to the end."
        ]
    },
    "add-two-numbers": {
        tags: ["Linked List", "Math", "Recursion"],
        companyTags: ["Amazon", "Microsoft", "Google", "Meta"],
        hints: [
            "Process both lists simultaneously with a carry variable.",
            "Create new nodes for each digit sum.",
            "Don't forget the final carry if it exists."
        ]
    },
    "longest-substring-without-repeating-characters": {
        tags: ["String", "Hash Table", "Sliding Window"],
        companyTags: ["Amazon", "Meta", "Google", "Microsoft", "Bloomberg"],
        hints: [
            "Use sliding window with a set or map.",
            "Expand right, shrink left when duplicate found.",
            "Track maximum window size seen."
        ],
        isPremiumOnly: true
    },
    "3sum": {
        tags: ["Array", "Two Pointers", "Sorting"],
        companyTags: ["Amazon", "Meta", "Google", "Microsoft", "Apple"],
        hints: [
            "Sort the array first.",
            "Fix one element and use two pointers for the rest.",
            "Skip duplicates to avoid duplicate triplets."
        ],
        isPremiumOnly: true
    },
    "product-of-array-except-self": {
        tags: ["Array", "Prefix Sum"],
        companyTags: ["Amazon", "Apple", "Microsoft", "Meta"],
        hints: [
            "Calculate prefix products from left.",
            "Calculate suffix products from right.",
            "Multiply prefix and suffix for each position."
        ],
        isPremiumOnly: true
    },
    "group-anagrams": {
        tags: ["Array", "Hash Table", "String", "Sorting"],
        companyTags: ["Amazon", "Meta", "Google", "Uber"],
        hints: [
            "Anagrams have the same sorted characters.",
            "Use sorted string as key in a hash map.",
            "Group all words with same key together."
        ]
    },
    "rotting-oranges": {
        tags: ["Array", "BFS", "Matrix"],
        companyTags: ["Amazon", "Microsoft", "Google"],
        hints: [
            "Use BFS starting from all rotten oranges simultaneously.",
            "Each BFS level represents one minute.",
            "Track if any fresh oranges remain."
        ]
    },
    "search-in-rotated-sorted-array": {
        tags: ["Array", "Binary Search"],
        companyTags: ["Amazon", "Meta", "Microsoft", "LinkedIn"],
        hints: [
            "Use binary search but handle rotation.",
            "One half of the array is always sorted.",
            "Determine which half contains the target."
        ],
        isPremiumOnly: true
    },
    "trapping-rain-water": {
        tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
        companyTags: ["Amazon", "Google", "Meta", "Goldman Sachs", "Bloomberg"],
        hints: [
            "Water at each position = min(leftMax, rightMax) - height.",
            "Precompute left max and right max arrays.",
            "Or use two pointers for O(1) space solution."
        ],
        isPremiumOnly: true
    },
    "fizz-buzz": {
        tags: ["Math", "String", "Simulation"],
        companyTags: ["Amazon", "Microsoft", "Apple"],
        hints: [
            "Check divisibility by 15 first (both 3 and 5).",
            "Then check 3, then 5.",
            "Otherwise, convert number to string."
        ]
    },
    "single-number": {
        tags: ["Array", "Bit Manipulation"],
        companyTags: ["Amazon", "Apple", "Google"],
        hints: [
            "XOR of a number with itself is 0.",
            "XOR of a number with 0 is the number itself.",
            "XOR all elements together."
        ]
    },
    "valid-parentheses-demo": {
        tags: ["String", "Stack"],
        companyTags: ["Amazon", "Google", "Meta"],
        hints: [
            "Use a stack to track opening brackets.",
            "Match each closing bracket with stack top.",
            "Stack should be empty at the end."
        ]
    }
};

async function seedProblemMetadata() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB");

        let updated = 0;
        let notFound = 0;

        for (const [problemId, metadata] of Object.entries(PROBLEM_METADATA)) {
            const updateData = {
                tags: metadata.tags,
                companyTags: metadata.companyTags,
                hints: metadata.hints
            };

            if (metadata.isPremiumOnly !== undefined) {
                updateData.isPremiumOnly = metadata.isPremiumOnly;
            }

            const result = await Problem.findOneAndUpdate(
                { id: problemId },
                { $set: updateData },
                { new: true }
            );

            if (result) {
                console.log(`✅ Updated: ${problemId} - Tags: ${metadata.tags.length}, Companies: ${metadata.companyTags.length}, Hints: ${metadata.hints.length}${metadata.isPremiumOnly ? " [PREMIUM]" : ""}`);
                updated++;
            } else {
                console.log(`⚠️ Problem not found: ${problemId}`);
                notFound++;
            }
        }

        console.log(`\n✨ Seeding completed! Updated: ${updated}, Not found: ${notFound}`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
}

seedProblemMetadata();

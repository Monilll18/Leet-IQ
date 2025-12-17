/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Create a Map to store numbers and their indices
    const numMap = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // Check if the complement already exists in the map
        if (numMap.has(complement)) {
            // If found, return the complement's index and the current index
            return [numMap.get(complement), i];
        }

        // Otherwise, store the current number and its index in the map
        numMap.set(nums[i], i);
    }
};

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]
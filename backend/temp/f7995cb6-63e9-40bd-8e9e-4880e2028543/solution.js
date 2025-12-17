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
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1])); // Expected: 1
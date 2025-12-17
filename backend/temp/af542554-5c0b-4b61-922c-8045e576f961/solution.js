var twoSum = function(nums, target) {
        // 1. Iterate over every possible number pair
        for (let i = 0; i < nums.length; i++) {
            // j is always ahead of i so that we don't re-evaluate already evaluated sums
            for (let j = i + 1; j < nums.length; j++) {
                // 2. Check if a given pair adds up to our target
                if (nums[i] + nums[j] == target) {
                    // Return the indices when a pair has been found
                    return [i, j];
                }
            }
        }
};


// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]
var twoSum = function(nums, target) {
    // Create a Map to store values and their indices
    const hashMap = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // Check if the complement exists in the map
        if (hashMap.has(complement)) {
            // If found, return the current index and the complement's index
            return [hashMap.get(complement), i];
        }

        // If not found, add the current number and its index to the map
        hashMap.set(nums[i], i);
    }
};

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]
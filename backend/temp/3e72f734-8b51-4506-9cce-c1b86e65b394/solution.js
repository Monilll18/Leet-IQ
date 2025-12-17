var twoSum = function(nums, target) {
    const map = new Map(); // value → index

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // Check if complement already exists
        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        // Store current number with index
        map.set(nums[i], i);
    }
};
// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]
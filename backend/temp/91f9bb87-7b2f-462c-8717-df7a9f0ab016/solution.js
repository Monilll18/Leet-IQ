// ❌ Infinite loop – guaranteed TLE
var twoSum = function(nums, target) {
    while (true) {
        // stuck forever
    }
};
// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]
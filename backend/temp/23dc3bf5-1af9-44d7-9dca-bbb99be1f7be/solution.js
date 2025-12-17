
var maxArea = function(height) {
    let maxWater = 0; // Tracks the maximum area found so far
    let left = 0; // Pointer at the start of the array
    let right = height.length - 1; // Pointer at the end of the array

    while (left < right) {
        // Calculate the current area: width * min(height)
        const currentWidth = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const currentArea = currentWidth * currentHeight;
        
        // Update the maximum water area if the current area is greater
        maxWater = Math.max(maxWater, currentArea);

        // Move the pointer pointing to the shorter line inward
        // This is the key to the algorithm's efficiency, as moving the taller line 
        // guarantees a smaller or equal height with a reduced width, never a larger area
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxWater;
};

console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1])); // Expected: 1
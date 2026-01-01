import mongoose from 'mongoose';
import Problem from './src/models/Problem.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Add starter code with console.log test cases for all problems
 */
const STARTER_CODE_WITH_TESTS = {
    'two-sum': {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", twoSum([2,7,11,15], 9)); // Expected: [0,1]
console.log("Test 2:", twoSum([3,2,4], 6)); // Expected: [1,2]
console.log("Test 3:", twoSum([3,3], 6)); // Expected: [0,1]`,
        python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Your code here
    pass

# Test cases
print("Test 1:", twoSum([2,7,11,15], 9))  # Expected: [0,1]
print("Test 2:", twoSum([3,2,4], 6))  # Expected: [1,2]
print("Test 3:", twoSum([3,3], 6))  # Expected: [0,1]`
    },
    'reverse-string': {
        javascript: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
    // Your code here
    
}

// Test cases
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log("Test 1:", test1); // Expected: ["o","l","l","e","h"]

let test2 = ["H","a","n","n","a","h"];
reverseString(test2);
console.log("Test 2:", test2); // Expected: ["h","a","n","n","a","H"]`,
        python: `def reverseString(s: list[str]) -> None:
    # Your code here
    pass

# Test cases
test1 = ["h","e","l","l","o"]
reverseString(test1)
print("Test 1:", test1)  # Expected: ["o","l","l","e","h"]

test2 = ["H","a","n","n","a","h"]
reverseString(test2)
print("Test 2:", test2)  # Expected: ["h","a","n","n","a","H"]`
    },
    'valid-palindrome': {
        javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log("Test 2:", isPalindrome("race a car")); // Expected: false
console.log("Test 3:", isPalindrome(" ")); // Expected: true`,
        python: `def isPalindrome(s: str) -> bool:
    # Your code here
    pass

# Test cases
print("Test 1:", isPalindrome("A man, a plan, a canal: Panama"))  # Expected: True
print("Test 2:", isPalindrome("race a car"))  # Expected: False
print("Test 3:", isPalindrome(" "))  # Expected: True`
    },
    'maximum-subarray': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
console.log("Test 2:", maxSubArray([1])); // Expected: 1
console.log("Test 3:", maxSubArray([5,4,-1,7,8])); // Expected: 23`,
        python: `def maxSubArray(nums: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
print("Test 2:", maxSubArray([1]))  # Expected: 1
print("Test 3:", maxSubArray([5,4,-1,7,8]))  # Expected: 23`
    },
    'container-with-most-water': {
        javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log("Test 2:", maxArea([1,1])); // Expected: 1`,
        python: `def maxArea(height: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", maxArea([1,8,6,2,5,4,8,3,7]))  # Expected: 49
print("Test 2:", maxArea([1,1]))  # Expected: 1`
    },
    'valid-parentheses': {
        javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", isValid("()")); // Expected: true
console.log("Test 2:", isValid("()[]{}")); // Expected: true
console.log("Test 3:", isValid("(]")); // Expected: false
console.log("Test 4:", isValid("([)]")); // Expected: false
console.log("Test 5:", isValid("{[]}")); // Expected: true`,
        python: `def isValid(s: str) -> bool:
    # Your code here
    pass

# Test cases
print("Test 1:", isValid("()"))  # Expected: True
print("Test 2:", isValid("()[]{}"))  # Expected: True
print("Test 3:", isValid("(]"))  # Expected: False
print("Test 4:", isValid("([)]"))  # Expected: False
print("Test 5:", isValid("{[]}"))  # Expected: True`
    },
    'valid-parentheses-demo': {
        javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", isValid("()")); // Expected: true
console.log("Test 2:", isValid("()[]{}")); // Expected: true
console.log("Test 3:", isValid("(]")); // Expected: false`,
        python: `def isValid(s: str) -> bool:
    # Your code here
    pass

# Test cases
print("Test 1:", isValid("()"))  # Expected: True
print("Test 2:", isValid("()[]{}"))  # Expected: True
print("Test 3:", isValid("(]"))  # Expected: False`
    },
    'merge-two-sorted-lists': {
        javascript: `/**
 * @param {number[]} list1
 * @param {number[]} list2
 * @return {number[]}
 */
function mergeTwoLists(list1, list2) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", mergeTwoLists([1,2,4], [1,3,4])); // Expected: [1,1,2,3,4,4]
console.log("Test 2:", mergeTwoLists([], [])); // Expected: []
console.log("Test 3:", mergeTwoLists([], [0])); // Expected: [0]`,
        python: `def mergeTwoLists(list1: list[int], list2: list[int]) -> list[int]:
    # Your code here
    pass

# Test cases
print("Test 1:", mergeTwoLists([1,2,4], [1,3,4]))  # Expected: [1,1,2,3,4,4]
print("Test 2:", mergeTwoLists([], []))  # Expected: []
print("Test 3:", mergeTwoLists([], [0]))  # Expected: [0]`
    },
    'climbing-stairs': {
        javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", climbStairs(2)); // Expected: 2
console.log("Test 2:", climbStairs(3)); // Expected: 3
console.log("Test 3:", climbStairs(4)); // Expected: 5`,
        python: `def climbStairs(n: int) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", climbStairs(2))  # Expected: 2
print("Test 2:", climbStairs(3))  # Expected: 3
print("Test 3:", climbStairs(4))  # Expected: 5`
    },
    'valid-anagram': {
        javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", isAnagram("anagram", "nagaram")); // Expected: true
console.log("Test 2:", isAnagram("rat", "car")); // Expected: false`,
        python: `def isAnagram(s: str, t: str) -> bool:
    # Your code here
    pass

# Test cases
print("Test 1:", isAnagram("anagram", "nagaram"))  # Expected: True
print("Test 2:", isAnagram("rat", "car"))  # Expected: False`
    },
    'majority-element': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function majorityElement(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", majorityElement([3,2,3])); // Expected: 3
console.log("Test 2:", majorityElement([2,2,1,1,1,2,2])); // Expected: 2`,
        python: `def majorityElement(nums: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", majorityElement([3,2,3]))  # Expected: 3
print("Test 2:", majorityElement([2,2,1,1,1,2,2]))  # Expected: 2`
    },
    'move-zeroes': {
        javascript: `/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
function moveZeroes(nums) {
    // Your code here
    
}

// Test cases
let test1 = [0,1,0,3,12];
moveZeroes(test1);
console.log("Test 1:", test1); // Expected: [1,3,12,0,0]

let test2 = [0];
moveZeroes(test2);
console.log("Test 2:", test2); // Expected: [0]`,
        python: `def moveZeroes(nums: list[int]) -> None:
    # Your code here
    pass

# Test cases
test1 = [0,1,0,3,12]
moveZeroes(test1)
print("Test 1:", test1)  # Expected: [1,3,12,0,0]

test2 = [0]
moveZeroes(test2)
print("Test 2:", test2)  # Expected: [0]`
    },
    'add-two-numbers': {
        javascript: `/**
 * @param {number[]} l1
 * @param {number[]} l2
 * @return {number[]}
 */
function addTwoNumbers(l1, l2) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", addTwoNumbers([2,4,3], [5,6,4])); // Expected: [7,0,8]
console.log("Test 2:", addTwoNumbers([0], [0])); // Expected: [0]
console.log("Test 3:", addTwoNumbers([9,9,9,9,9,9,9], [9,9,9,9])); // Expected: [8,9,9,9,0,0,0,1]`,
        python: `def addTwoNumbers(l1: list[int], l2: list[int]) -> list[int]:
    # Your code here
    pass

# Test cases
print("Test 1:", addTwoNumbers([2,4,3], [5,6,4]))  # Expected: [7,0,8]
print("Test 2:", addTwoNumbers([0], [0]))  # Expected: [0]
print("Test 3:", addTwoNumbers([9,9,9,9,9,9,9], [9,9,9,9]))  # Expected: [8,9,9,9,0,0,0,1]`
    },
    'longest-substring-without-repeating-characters': {
        javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", lengthOfLongestSubstring("abcabcbb")); // Expected: 3
console.log("Test 2:", lengthOfLongestSubstring("bbbbb")); // Expected: 1
console.log("Test 3:", lengthOfLongestSubstring("pwwkew")); // Expected: 3`,
        python: `def lengthOfLongestSubstring(s: str) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", lengthOfLongestSubstring("abcabcbb"))  # Expected: 3
print("Test 2:", lengthOfLongestSubstring("bbbbb"))  # Expected: 1
print("Test 3:", lengthOfLongestSubstring("pwwkew"))  # Expected: 3`
    },
    '3sum': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", threeSum([-1,0,1,2,-1,-4])); // Expected: [[-1,-1,2],[-1,0,1]]
console.log("Test 2:", threeSum([0,1,1])); // Expected: []
console.log("Test 3:", threeSum([0,0,0])); // Expected: [[0,0,0]]`,
        python: `def threeSum(nums: list[int]) -> list[list[int]]:
    # Your code here
    pass

# Test cases
print("Test 1:", threeSum([-1,0,1,2,-1,-4]))  # Expected: [[-1,-1,2],[-1,0,1]]
print("Test 2:", threeSum([0,1,1]))  # Expected: []
print("Test 3:", threeSum([0,0,0]))  # Expected: [[0,0,0]]`
    },
    'product-of-array-except-self': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", productExceptSelf([1,2,3,4])); // Expected: [24,12,8,6]
console.log("Test 2:", productExceptSelf([-1,1,0,-3,3])); // Expected: [0,0,9,0,0]`,
        python: `def productExceptSelf(nums: list[int]) -> list[int]:
    # Your code here
    pass

# Test cases
print("Test 1:", productExceptSelf([1,2,3,4]))  # Expected: [24,12,8,6]
print("Test 2:", productExceptSelf([-1,1,0,-3,3]))  # Expected: [0,0,9,0,0]`
    },
    'group-anagrams': {
        javascript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", groupAnagrams(["eat","tea","tan","ate","nat","bat"])); 
// Expected: [["bat"],["nat","tan"],["ate","eat","tea"]]
console.log("Test 2:", groupAnagrams([""])); // Expected: [[""]]
console.log("Test 3:", groupAnagrams(["a"])); // Expected: [["a"]]`,
        python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Your code here
    pass

# Test cases
print("Test 1:", groupAnagrams(["eat","tea","tan","ate","nat","bat"]))
# Expected: [["bat"],["nat","tan"],["ate","eat","tea"]]
print("Test 2:", groupAnagrams([""]))  # Expected: [[""]]
print("Test 3:", groupAnagrams(["a"]))  # Expected: [["a"]]`
    },
    'rotting-oranges': {
        javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
function orangesRotting(grid) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", orangesRotting([[2,1,1],[1,1,0],[0,1,1]])); // Expected: 4
console.log("Test 2:", orangesRotting([[2,1,1],[0,1,1],[1,0,1]])); // Expected: -1
console.log("Test 3:", orangesRotting([[0,2]])); // Expected: 0`,
        python: `def orangesRotting(grid: list[list[int]]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", orangesRotting([[2,1,1],[1,1,0],[0,1,1]]))  # Expected: 4
print("Test 2:", orangesRotting([[2,1,1],[0,1,1],[1,0,1]]))  # Expected: -1
print("Test 3:", orangesRotting([[0,2]]))  # Expected: 0`
    },
    'search-in-rotated-sorted-array': {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", search([4,5,6,7,0,1,2], 0)); // Expected: 4
console.log("Test 2:", search([4,5,6,7,0,1,2], 3)); // Expected: -1
console.log("Test 3:", search([1], 0)); // Expected: -1`,
        python: `def search(nums: list[int], target: int) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", search([4,5,6,7,0,1,2], 0))  # Expected: 4
print("Test 2:", search([4,5,6,7,0,1,2], 3))  # Expected: -1
print("Test 3:", search([1], 0))  # Expected: -1`
    },
    'trapping-rain-water': {
        javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", trap([0,1,0,2,1,0,1,3,2,1,2,1])); // Expected: 6
console.log("Test 2:", trap([4,2,0,3,2,5])); // Expected: 9`,
        python: `def trap(height: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # Expected: 6
print("Test 2:", trap([4,2,0,3,2,5]))  # Expected: 9`
    },
    'fizz-buzz': {
        javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
function fizzBuzz(n) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", fizzBuzz(3)); // Expected: ["1","2","Fizz"]
console.log("Test 2:", fizzBuzz(5)); // Expected: ["1","2","Fizz","4","Buzz"]
console.log("Test 3:", fizzBuzz(15));`,
        python: `def fizzBuzz(n: int) -> list[str]:
    # Your code here
    pass

# Test cases
print("Test 1:", fizzBuzz(3))  # Expected: ["1","2","Fizz"]
print("Test 2:", fizzBuzz(5))  # Expected: ["1","2","Fizz","4","Buzz"]
print("Test 3:", fizzBuzz(15))`
    },
    'single-number': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function singleNumber(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", singleNumber([2,2,1])); // Expected: 1
console.log("Test 2:", singleNumber([4,1,2,1,2])); // Expected: 4
console.log("Test 3:", singleNumber([1])); // Expected: 1`,
        python: `def singleNumber(nums: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", singleNumber([2,2,1]))  # Expected: 1
print("Test 2:", singleNumber([4,1,2,1,2]))  # Expected: 4
print("Test 3:", singleNumber([1]))  # Expected: 1`
    }
};

async function updateStarterCode() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('✅ Connected to MongoDB\n');

        const problems = await Problem.find({ isActive: true });
        console.log('Total problems:', problems.length);

        let updatedCount = 0;
        for (const p of problems) {
            const starterCode = STARTER_CODE_WITH_TESTS[p.id];
            if (starterCode) {
                await Problem.findByIdAndUpdate(p._id, {
                    $set: { starterCode: starterCode }
                });
                console.log('✅ Updated:', p.id);
                updatedCount++;
            } else {
                console.log('⚠️  No starter code defined for:', p.id);
            }
        }

        console.log('\n✅ Updated', updatedCount, 'problems with test cases');
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateStarterCode();

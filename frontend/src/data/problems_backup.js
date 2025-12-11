export const problems = [
    {
        id: "1",
        title: "Two Sum",
        difficulty: "Easy",
        category: "Array",
        tags: ["Array", "Hash Table"],
        acceptanceRate: 49.2,
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,

        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
        ],

        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]"
            },
            {
                input: "nums = [3,3], target = 6",
                output: "[0,1]"
            }
        ],

        starterCode: {
            javascript: `function twoSum(nums, target) {
    // Write your code here
    
}

// Test
const nums = [2, 7, 11, 15];
const target = 9;
console.log(JSON.stringify(twoSum(nums, target)));`,

            python: `def two_sum(nums, target):
    # Write your code here
    pass

# Test
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))`,

            java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println(Arrays.toString(solution.twoSum(nums, target)));
    }
}`
        },

        testCases: [
            {
                input: "",
                expectedOutput: "[0,1]",
                hidden: false
            },
            {
                input: "",
                expectedOutput: "[1,2]",
                hidden: false
            },
            {
                input: "",
                expectedOutput: "[0,1]",
                hidden: true
            }
        ],

        hints: [
            "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Can you do better?",
            "So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is target - x. Can we do better?",
            "Use a hash map to store the numbers you've seen and their indices."
        ]
    },

    {
        id: "2",
        title: "Reverse String",
        difficulty: "Easy",
        category: "String",
        tags: ["Two Pointers", "String"],
        acceptanceRate: 77.8,
        description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,

        constraints: [
            "1 <= s.length <= 10^5",
            "s[i] is a printable ascii character."
        ],

        examples: [
            {
                input: 's = ["h","e","l","l","o"]',
                output: '["o","l","l","e","h"]'
            },
            {
                input: 's = ["H","a","n","n","a","h"]',
                output: '["h","a","n","n","a","H"]'
            }
        ],

        starterCode: {
            javascript: `function reverseString(s) {
    // Write your code here
    
}

// Test
const s = ["h","e","l","l","o"];
reverseString(s);
console.log(JSON.stringify(s));`,

            python: `def reverse_string(s):
    # Write your code here
    pass

# Test
s = ["h","e","l","l","o"]
reverse_string(s)
print(s)`,
        },

        testCases: [
            {
                input: "",
                expectedOutput: '["o","l","l","e","h"]',
                hidden: false
            },
            {
                input: "",
                expectedOutput: '["h","a","n","n","a","H"]',
                hidden: false
            }
        ],

        hints: [
            "Use the two-pointer technique",
            "Swap characters from both ends moving towards the center"
        ]
    },

    {
        id: "3",
        title: "Palindrome Number",
        difficulty: "Easy",
        category: "Math",
        tags: ["Math"],
        acceptanceRate: 54.3,
        description: `Given an integer x, return true if x is a palindrome, and false otherwise.`,

        constraints: [
            "-2^31 <= x <= 2^31 - 1"
        ],

        examples: [
            {
                input: "x = 121",
                output: "true",
                explanation: "121 reads as 121 from left to right and from right to left."
            },
            {
                input: "x = -121",
                output: "false",
                explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
            },
            {
                input: "x = 10",
                output: "false",
                explanation: "Reads 01 from right to left. Therefore it is not a palindrome."
            }
        ],

        starterCode: {
            javascript: `function isPalindrome(x) {
    // Write your code here
    
}

// Test
console.log(isPalindrome(121));`,

            python: `def is_palindrome(x):
    # Write your code here
    pass

# Test
print(is_palindrome(121))`,
        },

        testCases: [
            {
                input: "",
                expectedOutput: "true",
                hidden: false
            },
            {
                input: "",
                expectedOutput: "false",
                hidden: false
            },
            {
                input: "",
                expectedOutput: "false",
                hidden: true
            }
        ],

        hints: [
            "Could you solve it without converting the integer to a string?",
            "Revert half of the number and compare it with the first half"
        ]
    },

    {
        id: "4",
        title: "Valid Parentheses",
        difficulty: "Easy",
        category: "Stack",
        tags: ["String", "Stack"],
        acceptanceRate: 40.5,
        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,

        constraints: [
            "1 <= s.length <= 10^4",
            "s consists of parentheses only '()[]{}'."
        ],

        examples: [
            {
                input: 's = "()"',
                output: "true"
            },
            {
                input: 's = "()[]{}"',
                output: "true"
            },
            {
                input: 's = "(]"',
                output: "false"
            }
        ],

        starterCode: {
            javascript: `function isValid(s) {
    // Write your code here
    
}

// Test
console.log(isValid("()"));`,

            python: `def is_valid(s):
    # Write your code here
    pass

# Test
print(is_valid("()"))`,
        },

        testCases: [
            {
                input: "",
                expectedOutput: "true",
                hidden: false
            },
            {
                input: "",
                expectedOutput: "true",
                hidden: false
            },
            {
                input: "",
                expectedOutput: "false",
                hidden: true
            }
        ],

        hints: [
            "Use a stack data structure",
            "Push opening brackets onto the stack and pop when you encounter a closing bracket",
            "Make sure the popped bracket matches the closing bracket"
        ]
    },

    {
        id: "5",
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        category: "Linked List",
        tags: ["Linked List", "Recursion"],
        acceptanceRate: 61.2,
        description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,

        constraints: [
            "The number of nodes in both lists is in the range [0, 50].",
            "-100 <= Node.val <= 100",
            "Both list1 and list2 are sorted in non-decreasing order."
        ],

        examples: [
            {
                input: "list1 = [1,2,4], list2 = [1,3,4]",
                output: "[1,1,2,3,4,4]"
            },
            {
                input: "list1 = [], list2 = []",
                output: "[]"
            },
            {
                input: "list1 = [], list2 = [0]",
                output: "[0]"
            }
        ],

        starterCode: {
            javascript: `function mergeTwoLists(list1, list2) {
    // Write your code here
    
}

// Test
console.log(mergeTwoLists([1,2,4], [1,3,4]));`,

            python: `def merge_two_lists(list1, list2):
    # Write your code here
    pass

# Test
print(merge_two_lists([1,2,4], [1,3,4]))`,
        },

        testCases: [
            {
                input: "",
                expectedOutput: "[1,1,2,3,4,4]",
                hidden: false
            },
            {
                input: "",
                expectedOutput: "[]",
                hidden: false
            },
            {
                input: "",
                expectedOutput: "[0]",
                hidden: true
            }
        ],

        hints: [
            "Use a dummy head node to simplify the code",
            "Compare the current nodes of both lists and attach the smaller one to your result",
            "Move the pointer of the list from which you took the node"
        ]
    }
];

// Mock data for dashboard stats
export const mockStats = {
    totalProblems: problems.length,
    solvedProblems: 2,
    easySolved: 2,
    mediumSolved: 0,
    hardSolved: 0,
    totalSubmissions: 12,
    acceptanceRate: 67,
    streak: 3,
};

// Mock recent activity
export const mockRecentActivity = [
    {
        id: 1,
        problemTitle: "Two Sum",
        status: "Accepted",
        language: "JavaScript",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
        id: 2,
        problemTitle: "Reverse String",
        status: "Accepted",
        language: "Python",
        date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
        id: 3,
        problemTitle: "Valid Parentheses",
        status: "Wrong Answer",
        language: "JavaScript",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
];
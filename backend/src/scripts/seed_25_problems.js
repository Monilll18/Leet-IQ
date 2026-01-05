import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Problem from "../models/Problem.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const PROBLEMS = [
    // Arrays & Hashing
    {
        id: "contains-duplicate",
        title: "Contains Duplicate",
        difficulty: "Easy",
        category: "Arrays",
        description: { text: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct." },
        functionName: "containsDuplicate",
        starterCode: {
            javascript: "function containsDuplicate(nums) {\n  \n}",
            python: "def containsDuplicate(nums):\n  ",
            java: "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};"
        },
        testCases: [{ params: [[1, 2, 3, 1]], expected: true }, { params: [[1, 2, 3, 4]], expected: false }],
        examples: [
            { input: "nums = [1,2,3,1]", output: "true", explanation: "The element 1 appears twice." },
            { input: "nums = [1,2,3,4]", output: "false", explanation: "All elements are distinct." }
        ],
        constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
        hints: ["Consider using a Set to track seen elements."],
        companyTags: ["Apple", "Microsoft", "Adobe"]
    },
    {
        id: "valid-anagram",
        title: "Valid Anagram",
        difficulty: "Easy",
        category: "Strings",
        description: { text: "Given two strings s and t, return true if t is an anagram of s, and false otherwise." },
        functionName: "isAnagram",
        starterCode: {
            javascript: "function isAnagram(s, t) {\n  \n}",
            python: "def isAnagram(s, t):\n  ",
            java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};"
        },
        testCases: [{ params: ["anagram", "nagaram"], expected: true }],
        examples: [
            { input: "s = 'anagram', t = 'nagaram'", output: "true", explanation: "" },
            { input: "s = 'rat', t = 'car'", output: "false", explanation: "" }
        ],
        constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
        hints: ["An anagram must have the same length and same character counts."],
        companyTags: ["Uber", "Google", "Bloomberg"]
    },
    // Two Pointers
    {
        id: "valid-palindrome",
        title: "Valid Palindrome",
        difficulty: "Easy",
        category: "Two Pointers",
        description: { text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward." },
        functionName: "isPalindrome",
        starterCode: {
            javascript: "function isPalindrome(s) {\n  \n}",
            python: "def isPalindrome(s):\n  ",
            java: "class Solution {\n    public boolean isPalindrome(String s) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    bool isPalindrome(string s) {\n        \n    }\n};"
        },
        testCases: [{ params: ["A man, a plan, a canal: Panama"], expected: true }],
        examples: [
            { input: "s = 'A man, a plan, a canal: Panama'", output: "true", explanation: "'amanaplanacanalpanama' is a palindrome." },
            { input: "s = 'race a car'", output: "false", explanation: "'raceacar' is not a palindrome." }
        ],
        constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
        hints: ["Use two pointers, one at the start and one at the end.", "Skip non-alphanumeric characters."],
        companyTags: ["Meta", "Spotify", "Amazon"]
    },
    {
        id: "3sum",
        title: "3Sum",
        difficulty: "Medium",
        category: "Two Pointers",
        description: { text: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0." },
        functionName: "threeSum",
        starterCode: {
            javascript: "function threeSum(nums) {\n  \n}",
            python: "def threeSum(nums):\n  ",
            java: "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};"
        },
        testCases: [{ params: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] }],
        examples: [
            { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "Distinct triplets are [-1,0,1] and [-1,-1,2]." },
            { input: "nums = [0,1,1]", output: "[]", explanation: "The only possible triplet does not sum to 0." }
        ],
        constraints: ["0 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
        hints: ["Sort the array first.", "Fix one element and use the two-pointer approach for the remaining two."],
        companyTags: ["Meta", "Amazon", "Apple", "Google"]
    },
    // Sliding Window
    {
        id: "best-time-to-buy-and-sell-stock",
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        category: "Sliding Window",
        description: { text: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit you can achieve from this transaction." },
        functionName: "maxProfit",
        starterCode: {
            javascript: "function maxProfit(prices) {\n  \n}",
            python: "def maxProfit(prices):\n  ",
            java: "class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};"
        },
        testCases: [{ params: [[7, 1, 5, 3, 6, 4]], expected: 5 }],
        examples: [
            { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
            { input: "prices = [7,6,4,3,1]", output: "0", explanation: "In this case, no transactions are done and the max profit = 0." }
        ],
        constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
        hints: ["Keep track of the minimum price found so far.", "Calculate profit for the current day based on that minimum price."],
        companyTags: ["Amazon", "Google", "Microsoft", "Goldman Sachs"]
    },
    // Stack
    {
        id: "valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "Easy",
        category: "Stack",
        description: { text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid." },
        functionName: "isValid",
        starterCode: {
            javascript: "function isValid(s) {\n  \n}",
            python: "def isValid(s):\n  ",
            java: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};"
        },
        testCases: [{ params: ["()[]{}"], expected: true }],
        examples: [
            { input: "s = '()'", output: "true", explanation: "" },
            { input: "s = '()[]{}'", output: "true", explanation: "" },
            { input: "s = '(]'", output: "false", explanation: "" }
        ],
        constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
        hints: ["Use a stack to keep track of opening brackets.", "When you encounter a closing bracket, check the stack top."],
        companyTags: ["Amazon", "Meta", "LinkedIn", "Microsoft"]
    },
    {
        id: "daily-temperatures",
        title: "Daily Temperatures",
        difficulty: "Medium",
        category: "Stack",
        description: { text: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature." },
        functionName: "dailyTemperatures",
        starterCode: {
            javascript: "function dailyTemperatures(temperatures) {\n  \n}",
            python: "def dailyTemperatures(temperatures):\n  ",
            java: "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        \n    }\n};"
        },
        testCases: [{ params: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] }],
        examples: [
            { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]", explanation: "" },
            { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]", explanation: "" }
        ],
        constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
        hints: ["Use a monotonic decreasing stack.", "Store indices on the stack."],
        companyTags: ["Meta", "Google", "TikTok"]
    },
    // Binary Search
    {
        id: "binary-search",
        title: "Binary Search",
        difficulty: "Easy",
        category: "Binary Search",
        description: { text: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1." },
        functionName: "search",
        starterCode: {
            javascript: "function search(nums, target) {\n  \n}",
            python: "def search(nums, target):\n  ",
            java: "class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};"
        },
        testCases: [{ params: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 }],
        examples: [
            { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4" },
            { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1" }
        ],
        constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4"],
        hints: ["Find the middle element.", "If target is smaller, look in the left half, otherwise the right half."],
        companyTags: ["Apple", "Adobe", "Uber"]
    },
    // Linked List
    {
        id: "reverse-linked-list",
        title: "Reverse Linked List",
        difficulty: "Easy",
        category: "Linked List",
        description: { text: "Given the head of a singly linked list, reverse the list, and return the reversed list." },
        functionName: "reverseList",
        starterCode: {
            javascript: "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction reverseList(head) {\n  \n}",
            python: "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        ",
            java: "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}",
            cpp: "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};"
        },
        structure: {
            argTypes: ["ListNode"],
            returnType: "ListNode"
        },
        testCases: [{ params: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] }],
        examples: [
            { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "" },
            { input: "head = [1,2]", output: "[2,1]", explanation: "" }
        ],
        constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
        hints: ["Iteratively change the next pointer of each node to point to the previous node."],
        companyTags: ["Amazon", "Microsoft", "Meta", "Google"]
    },
    {
        id: "merge-two-sorted-lists",
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        category: "Linked List",
        description: { text: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list." },
        functionName: "mergeTwoLists",
        starterCode: {
            javascript: "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} list1\n * @param {ListNode} list2\n * @return {ListNode}\n */\nfunction mergeTwoLists(list1, list2) {\n  \n}",
            python: "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        ",
            java: "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}",
            cpp: "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        \n    }\n};"
        },
        structure: {
            argTypes: ["ListNode", "ListNode"],
            returnType: "ListNode"
        },
        testCases: [{ params: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] }],
        examples: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "" },
            { input: "list1 = [], list2 = []", output: "[]", explanation: "" }
        ],
        constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100"],
        hints: ["Use a dummy node to start the merged list."],
        companyTags: ["Amazon", "Apple", "Microsoft"]
    },
    // Trees
    {
        id: "invert-binary-tree",
        title: "Invert Binary Tree",
        difficulty: "Easy",
        category: "Trees",
        description: { text: "Given the root of a binary tree, invert the tree, and return its root." },
        functionName: "invertTree",
        starterCode: {
            javascript: "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n/**\n * @param {TreeNode} root\n * @return {TreeNode}\n */\nfunction invertTree(root) {\n  \n}",
            python: "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\nclass Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        ",
            java: "/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     int val;\n *     TreeNode left;\n *     TreeNode right;\n *     TreeNode() {}\n *     TreeNode(int val) { this.val = val; }\n *     TreeNode(int val, TreeNode left, TreeNode right) {\n *         this.val = val;\n *         this.left = left;\n *         this.right = right;\n *     }\n * }\n */\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        \n    }\n}",
            cpp: "/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n *     TreeNode() : val(0), left(nullptr), right(nullptr) {}\n *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n * };\n */\nclass Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        \n    }\n};"
        },
        structure: {
            argTypes: ["TreeNode"],
            returnType: "TreeNode"
        },
        testCases: [{ params: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] }],
        examples: [
            { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]", explanation: "" },
            { input: "root = [2,1,3]", output: "[2,3,1]", explanation: "" }
        ],
        constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
        hints: ["Recursive approach is simple: swap left and right children, then recurse."],
        companyTags: ["Google", "Amazon", "Twitter"]
    },
    {
        id: "maximum-depth-of-binary-tree",
        title: "Maximum Depth of Binary Tree",
        difficulty: "Easy",
        category: "Trees",
        description: { text: "Given the root of a binary tree, return its maximum depth." },
        functionName: "maxDepth",
        starterCode: {
            javascript: "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction maxDepth(root) {\n  \n}",
            python: "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\nclass Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        ",
            java: "/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     int val;\n *     TreeNode left;\n *     TreeNode right;\n *     TreeNode() {}\n *     TreeNode(int val) { this.val = val; }\n *     TreeNode(int val, TreeNode left, TreeNode right) {\n *         this.val = val;\n *         this.left = left;\n *         this.right = right;\n *     }\n * }\n */\nclass Solution {\n    public int maxDepth(TreeNode root) {\n        \n    }\n}",
            cpp: "/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n *     TreeNode() : val(0), left(nullptr), right(nullptr) {}\n *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n * };\n */\nclass Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        \n    }\n};"
        },
        structure: {
            argTypes: ["TreeNode"],
            returnType: "int"
        },
        testCases: [{ params: [[3, 9, 20, null, null, 15, 7]], expected: 3 }],
        examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "" },
            { input: "root = [1,null,2]", output: "2", explanation: "" }
        ],
        constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-100 <= Node.val <= 100"],
        hints: ["Max depth = 1 + max(depth of left child, depth of right child)."],
        companyTags: ["LinkedIn", "Amazon", "Google"]
    },
    // Heap
    {
        id: "kth-largest-element-in-an-array",
        title: "Kth Largest Element in an Array",
        difficulty: "Medium",
        category: "Heap",
        description: { text: "Given an integer array nums and an integer k, return the kth largest element in the array." },
        functionName: "findKthLargest",
        starterCode: {
            javascript: "function findKthLargest(nums, k) {\n  \n}",
            python: "def findKthLargest(nums, k):\n  ",
            java: "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        \n    }\n};"
        },
        testCases: [{ params: [[3, 2, 1, 5, 6, 4], 2], expected: 5 }],
        examples: [
            { input: "nums = [3,2,1,5,6,4], k = 2", output: "5", explanation: "" },
            { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4", explanation: "" }
        ],
        constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        hints: ["You can sort the array.", "Can you do better with a Heap or QuickSelect?"],
        companyTags: ["Meta", "Amazon", "Spotify", "Microsoft"]
    },
    // Backtracking
    {
        id: "subsets",
        title: "Subsets",
        difficulty: "Medium",
        category: "Backtracking",
        description: { text: "Given an integer array nums of unique elements, return all possible subsets (the power set)." },
        functionName: "subsets",
        starterCode: {
            javascript: "function subsets(nums) {\n  \n}",
            python: "def subsets(nums):\n  ",
            java: "class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        \n    }\n};"
        },
        testCases: [{ params: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] }],
        examples: [
            { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]", explanation: "" },
            { input: "nums = [0]", output: "[[],[0]]", explanation: "" }
        ],
        constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10"],
        hints: ["For each element, you have two choices: include it or exclude it."],
        companyTags: ["Meta", "Amazon", "Uber"]
    },
    // DP
    {
        id: "climbing-stairs",
        title: "Climbing Stairs",
        difficulty: "Easy",
        category: "Dynamic Programming",
        description: { text: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?" },
        functionName: "climbStairs",
        starterCode: {
            javascript: "function climbStairs(n) {\n  \n}",
            python: "def climbStairs(n):\n  ",
            java: "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};"
        },
        testCases: [{ params: [3], expected: 3 }],
        examples: [
            { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step\n2. 2 steps" },
            { input: "n = 3", output: "3", explanation: "1. 1+1+1\n2. 1+2\n3. 2+1" }
        ],
        constraints: ["1 <= n <= 45"],
        hints: ["This is basically Fibonacci sequence."],
        companyTags: ["Amazon", "Google", "Adobe"]
    },
    {
        id: "coin-change",
        title: "Coin Change",
        difficulty: "Medium",
        category: "Dynamic Programming",
        description: { text: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount." },
        functionName: "coinChange",
        starterCode: {
            javascript: "function coinChange(coins, amount) {\n  \n}",
            python: "def coinChange(coins, amount):\n  ",
            java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};"
        },
        testCases: [{ params: [[1, 2, 5], 11], expected: 3 }],
        examples: [
            { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
            { input: "coins = [2], amount = 3", output: "-1", explanation: "" }
        ],
        constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
        hints: ["Use dynamic programming."],
        companyTags: ["Amazon", "Walmart", "ByteDance"]
    },
    // Graphs
    {
        id: "number-of-islands",
        title: "Number of Islands",
        difficulty: "Medium",
        category: "Graphs",
        description: { text: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands." },
        functionName: "numIslands",
        starterCode: {
            javascript: "function numIslands(grid) {\n  \n}",
            python: "def numIslands(grid):\n  ",
            java: "class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};"
        },
        testCases: [],
        examples: [
            { input: "grid = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]", output: "3", explanation: "" }
        ],
        constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300"],
        hints: ["Use DFS or BFS."],
        companyTags: ["Amazon", "Microsoft", "Google", "Bloomberg"]
    },
    // Misc
    {
        id: "container-with-most-water",
        title: "Container With Most Water",
        difficulty: "Medium",
        category: "Two Pointers",
        description: { text: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water." },
        functionName: "maxArea",
        starterCode: {
            javascript: "function maxArea(height) {\n  \n}",
            python: "def maxArea(height):\n  ",
            java: "class Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};"
        },
        testCases: [{ params: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 }],
        examples: [
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "idx 1 and 8" },
            { input: "height = [1,1]", output: "1", explanation: "" }
        ],
        constraints: ["n == height.length", "2 <= n <= 10^5"],
        hints: ["Start with the widest container."],
        companyTags: ["Amazon", "Google", "Adobe"]
    },
    {
        id: "group-anagrams",
        title: "Group Anagrams",
        difficulty: "Medium",
        category: "Arrays",
        description: { text: "Given an array of strings strs, group the anagrams together. You can return the answer in any order." },
        functionName: "groupAnagrams",
        starterCode: {
            javascript: "function groupAnagrams(strs) {\n  \n}",
            python: "def groupAnagrams(strs):\n  ",
            java: "class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        \n    }\n};"
        },
        testCases: [{ params: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] }],
        examples: [
            { input: "strs = ['eat','tea','tan','ate','nat','bat']", output: "[['bat'],['nat','tan'],['ate','eat','tea']]", explanation: "" }
        ],
        constraints: ["1 <= strs.length <= 10^4"],
        hints: ["Map sorted string to list."],
        companyTags: ["Amazon", "Microsoft", "Goldman Sachs"]
    },
    {
        id: "top-k-frequent-elements",
        title: "Top K Frequent Elements",
        difficulty: "Medium",
        category: "Heap",
        description: { text: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order." },
        functionName: "topKFrequent",
        starterCode: {
            javascript: "function topKFrequent(nums, k) {\n  \n}",
            python: "def topKFrequent(nums, k):\n  ",
            java: "class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        \n    }\n};"
        },
        testCases: [{ params: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] }],
        examples: [
            { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]", explanation: "" }
        ],
        constraints: ["1 <= nums.length <= 10^5"],
        hints: ["Use a Min Heap."],
        companyTags: ["Amazon", "Meta", "Google"]
    },
    {
        id: "longest-consecutive-sequence",
        title: "Longest Consecutive Sequence",
        difficulty: "Medium",
        category: "Arrays",
        description: { text: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time." },
        functionName: "longestConsecutive",
        starterCode: {
            javascript: "function longestConsecutive(nums) {\n  \n}",
            python: "def longestConsecutive(nums):\n  ",
            java: "class Solution {\n    public int longestConsecutive(int[] nums) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        \n    }\n};"
        },
        testCases: [{ params: [[100, 4, 200, 1, 3, 2]], expected: 4 }],
        examples: [
            { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "[1, 2, 3, 4]" }
        ],
        constraints: ["0 <= nums.length <= 10^5"],
        hints: ["Use a HashSet."],
        companyTags: ["Google", "Amazon", "Microsoft"]
    },
    {
        id: "product-of-array-except-self",
        title: "Product of Array Except Self",
        difficulty: "Medium",
        category: "Arrays",
        description: { text: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]." },
        functionName: "productExceptSelf",
        starterCode: {
            javascript: "function productExceptSelf(nums) {\n  \n}",
            python: "def productExceptSelf(nums):\n  ",
            java: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};"
        },
        testCases: [{ params: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] }],
        examples: [
            { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "" }
        ],
        constraints: ["2 <= nums.length <= 10^5"],
        hints: ["Prefix and suffix products."],
        companyTags: ["Amazon", "Apple", "Meta", "Asana"]
    },
    {
        id: "trapping-rain-water",
        title: "Trapping Rain Water",
        difficulty: "Hard",
        category: "Two Pointers",
        description: { text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining." },
        functionName: "trap",
        starterCode: {
            javascript: "function trap(height) {\n  \n}",
            python: "def trap(height):\n  ",
            java: "class Solution {\n    public int trap(int[] height) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};"
        },
        testCases: [{ params: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 }],
        examples: [
            { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "" }
        ],
        constraints: ["n == height.length"],
        hints: ["Min of maxLeft and maxRight."],
        companyTags: ["Amazon", "Google", "Goldman Sachs", "Meta"],
        isPremiumOnly: true
    },
    {
        id: "median-of-two-sorted-arrays",
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        category: "Binary Search",
        description: { text: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays." },
        functionName: "findMedianSortedArrays",
        starterCode: {
            javascript: "function findMedianSortedArrays(nums1, nums2) {\n  \n}",
            python: "def findMedianSortedArrays(nums1, nums2):\n  ",
            java: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        \n    }\n};"
        },
        testCases: [{ params: [[1, 3], [2]], expected: 2.0 }],
        examples: [
            { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000", explanation: "" }
        ],
        constraints: ["nums1.length == m"],
        hints: ["Partition arrays."],
        companyTags: ["Amazon", "Google", "Apple", "Microsoft"],
        isPremiumOnly: true
    },
    {
        id: "longest-valid-parentheses",
        title: "Longest Valid Parentheses",
        difficulty: "Hard",
        category: "Stack",
        description: { text: "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring." },
        functionName: "longestValidParentheses",
        starterCode: {
            javascript: "function longestValidParentheses(s) {\n  \n}",
            python: "def longestValidParentheses(s):\n  ",
            java: "class Solution {\n    public int longestValidParentheses(String s) {\n        \n    }\n}",
            cpp: "class Solution {\npublic:\n    int longestValidParentheses(string s) {\n        \n    }\n};"
        },
        testCases: [{ params: [")()())"], expected: 4 }],
        examples: [
            { input: "s = ')()())'", output: "4", explanation: "" }
        ],
        constraints: ["0 <= s.length <= 3 * 10^4"],
        hints: ["Use a stack."],
        companyTags: ["Meta", "Amazon", "ByteDance"],
        isPremiumOnly: true
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");
    } catch (err) {
        console.error("DB Connection Failed", err);
        process.exit(1);
    }
};

const seed = async () => {
    await connectDB();

    console.log(`Seeding ${PROBLEMS.length} problems with full details...`);

    for (const p of PROBLEMS) {
        try {
            await Problem.findOneAndUpdate(
                { id: p.id },
                { ...p },
                { upsert: true, new: true }
            );
            console.log(`Saved: ${p.title}`);
        } catch (e) {
            console.error(`Failed to save ${p.title}:`, e.message);
        }
    }

    console.log("Seeding complete!");
    process.exit(0);
};

seed();

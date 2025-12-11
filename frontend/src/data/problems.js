// Import the problems array from the original file
import { problems as problemsArray } from './problem.js';

// Convert array to object keyed by ID for easier access
const problemsObject = {};
problemsArray.forEach(problem => {
    // Use a kebab-case version of the title as the key (e.g., "two-sum")
    const key = problem.title.toLowerCase().replace(/\s+/g, '-');
    problemsObject[key] = problem;
});

export const PROBLEMS = problemsObject;

// Re-export other exports from problem.js
export { mockStats, mockRecentActivity } from './problem.js';
import { runCodeInDocker } from "./dockerExecutor.js";
import { randomUUID } from "crypto";

const LANGUAGE_CONFIG = {
    javascript: { language: "javascript" },
    python: { language: "python" },
    java: { language: "java" },
};

/**
 * Generates a wrapper script for the specific language.
 * Now uses a secret result marker to prevent user code spoofing.
 */
function getDriver(language, userCode, functionName, testCases, marker) {
    const tcJson = JSON.stringify(testCases);

    switch (language.toLowerCase()) {
        case "javascript":
            return `
${userCode}
(function() {
    const testCases = ${tcJson};
    const results = [];
    const marker = "${marker}";
    
    for (const tc of testCases) {
        try {
            const start = performance.now();
            let actual;
            if (typeof ${functionName} === 'function') {
                actual = ${functionName}(...tc.params);
            } else if (typeof Solution !== 'undefined') {
                const sol = new Solution();
                if (typeof sol.${functionName} === 'function') {
                    actual = sol.${functionName}(...tc.params);
                } else {
                    throw new Error("Function ${functionName} not found in Solution class");
                }
            } else {
                throw new Error("Function ${functionName} not found");
            }
            const end = performance.now();
            
            results.push({
                status: "Accepted",
                actual: actual,
                expected: tc.expected,
                time: end - start
            });
        } catch (e) {
            results.push({ status: "Runtime Error", error: e.message });
            break; // Stop on first error for security and speed
        }
    }
    process.stdout.write(marker + JSON.stringify(results) + "\\n");
})();
`;

        case "python":
            const escapedCode = userCode.replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"').replace(/'/g, "\\'");
            return `
import time
import json
import sys

def run_judge():
    marker = "${marker}"
    exec_globals = {}
    try:
        exec(compile("""${escapedCode}\""", 'user_code', 'exec'), exec_globals)
    except Exception as e:
        print(marker + json.dumps([{"status": "Runtime Error", "error": str(e)}]))
        return

    test_cases = json.loads('${tcJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')
    results = []
    
    if 'Solution' in exec_globals:
        sol = exec_globals['Solution']()
        func = getattr(sol, '${functionName}', None)
    else:
        func = exec_globals.get('${functionName}')

    if not func:
        print(marker + json.dumps([{"status": "Runtime Error", "error": "Function ${functionName} not found"}]))
        return

    for tc in test_cases:
        try:
            start = time.perf_counter()
            actual = func(*tc['params'])
            end = time.perf_counter()
            results.append({
                "status": "Accepted",
                "actual": actual,
                "expected": tc['expected'],
                "time": (end - start) * 1000
            })
        except Exception as e:
            results.append({"status": "Runtime Error", "error": str(e)})
            break # Stop on first fail

    print(marker + json.dumps(results))

run_judge()
`;

        case "java":
            // Java requires a more structured approach
            return `
import java.util.*;

${userCode}

public class SolutionWrapper {
    public static void main(String[] args) {
        String marker = "${marker}";
        // Simplified Java execution for now
        System.out.println(marker + "[]"); 
    }
}
`;

        default:
            return userCode;
    }
}

export async function judgeCode(language, userCode, functionName, testCases, limits = {}) {
    const config = LANGUAGE_CONFIG[language.toLowerCase()];
    if (!config) throw new Error("Unsupported language");

    // Spoof protection: unique marker per run
    const marker = `__JUDGE_${randomUUID()}__`;
    const driverCode = getDriver(language, userCode, functionName, testCases, marker);

    try {
        console.log(`[Judge] Executing ${language} in Docker with marker...`);
        const result = await runCodeInDocker(language, driverCode, {
            timeLimit: limits.timeLimit || 2000,
            memoryLimit: limits.memoryLimit || 128
        });

        if (result.status === "System Error") {
            return result;
        }

        // Handle TLE/MLE from Docker level
        if (result.status === "Time Limit Exceeded" || result.status === "Memory Limit Exceeded") {
            return {
                status: result.status,
                error: result.error,
                runtime: result.runtime,
                memory: result.memory,
                cases: []
            };
        }

        // Process output for results using our secret marker
        const markerIndex = result.output?.indexOf(marker);
        let rawOutput = result.output;
        let judgeJson = null;

        if (markerIndex !== -1) {
            rawOutput = result.output.substring(0, markerIndex).trim();
            judgeJson = result.output.substring(markerIndex + marker.length).trim();
        }

        if (!judgeJson) {
            // If no JSON was found but status was successful, something went wrong
            if (result.status === "success" || result.status === "Accepted") {
                return {
                    status: "Runtime Error",
                    error: "No results received. Check for infinite loops or process kills.",
                    rawOutput: rawOutput,
                    runtime: result.runtime,
                    memory: result.memory
                };
            }
            return {
                status: "Runtime Error",
                error: result.error || "Execution failed without results",
                rawOutput: rawOutput,
                runtime: result.runtime,
                memory: result.memory
            };
        }

        let cases = [];
        try {
            cases = JSON.parse(judgeJson);
        } catch (parseErr) {
            return {
                status: "Runtime Error",
                error: "Failed to parse judge output. Output stream might be corrupted.",
                rawOutput: rawOutput,
                runtime: result.runtime,
                memory: result.memory
            };
        }

        // Aggregate results
        let totalTime = 0;
        let finalStatus = "Accepted";
        let firstFailure = null;

        for (const c of cases) {
            if (c.status !== "Accepted") {
                finalStatus = c.status;
                firstFailure = c;
                break;
            }
            if (JSON.stringify(c.actual) !== JSON.stringify(c.expected)) {
                finalStatus = "Wrong Answer";
                firstFailure = c;
                break;
            }
            totalTime += (c.time || 0);
        }

        return {
            status: finalStatus,
            cases: cases,
            rawOutput: rawOutput,
            runtime: parseFloat(totalTime.toFixed(2)),
            memory: result.memory,
            failure: firstFailure,
        };

    } catch (err) {
        console.error("Judge Docker Error:", err);
        return {
            status: "System Error",
            error: err.message,
        };
    }
}

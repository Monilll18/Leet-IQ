import Docker from "dockerode";
import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const docker = new Docker();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, "..", "..", "temp");

// ensure temp dir exists
fs.ensureDirSync(TEMP_DIR);

const LANGUAGE_CONFIG = {
    javascript: {
        image: "node:18-alpine",
        filename: "solution.js",
        runCommand: (file) => ["node", file],
    },
    python: {
        image: "python:3.10-alpine",
        filename: "solution.py",
        runCommand: (file) => ["python", file],
    },
    java: {
        image: "openjdk:17-alpine",
        filename: "Solution.java",
        runCommand: (file) => ["java", file], // Single-file source code programs in Java 11+
    },
};

export async function executeCode(language, code) {
    const config = LANGUAGE_CONFIG[language.toLowerCase()];
    if (!config) throw new Error("Unsupported language");

    const runId = uuidv4();
    const workDir = path.join(TEMP_DIR, runId);
    await fs.ensureDir(workDir);

    const filePath = path.join(workDir, config.filename);
    await fs.writeFile(filePath, code);

    let container;
    try {
        // Create container
        container = await docker.createContainer({
            Image: config.image,
            Cmd: config.runCommand(config.filename),
            Tty: false,
            HostConfig: {
                Binds: [`${workDir}:/app`],
                Memory: 128 * 1024 * 1024, // 128MB
                NanoCpus: 1000000000, // 1 CPU
                NetworkMode: "none", // No internet access
                AutoRemove: false, // We remove manually to capture logs first
            },
            WorkingDir: "/app",
            User: "1000:1000", // Run as non-root (if possible, Alpine usually ok with default but better safe)
        });

        const startTime = process.hrtime();
        await container.start();

        // Memory usage tracker
        let maxMemory = 0;
        let stopPolling = false;

        const pollMemory = async () => {
            while (!stopPolling) {
                try {
                    const stats = await container.stats({ stream: false });
                    if (stats && stats.memory_stats && stats.memory_stats.usage) {
                        const usage = stats.memory_stats.usage;
                        if (usage > maxMemory) maxMemory = usage;
                    }
                } catch (e) { /* ignore stats errors */ }

                // sleep a bit
                await new Promise(r => setTimeout(r, 100)); // Poll every 100ms
            }
        };
        const memoryPromise = pollMemory();

        // Timeout logic to prevent infinite loops freezing the server
        const TIMEOUT_MS = 3000; // 3 seconds hard limit (since problems have max 2s)

        const executionPromise = new Promise(async (resolve, reject) => {
            try {
                const status = await container.wait();
                resolve(status);
            } catch (err) {
                reject(err);
            }
        });

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Time Limit Exceeded (Hard Limit)"));
            }, TIMEOUT_MS);
        });

        try {
            await Promise.race([executionPromise, timeoutPromise]);
        } catch (err) {
            stopPolling = true; // Stop memory polling
            if (err.message.includes("Time Limit Exceeded")) {
                await container.kill(); // Kill the container specifically
                return {
                    runId,
                    status: "error", // Use error status so frontend handles it
                    output: "",
                    error: "Time Limit Exceeded", // Simple message
                    runtime: TIMEOUT_MS,
                    memory: maxMemory,
                };
            }
            throw err; // Re-throw other errors
        } finally {
            stopPolling = true; // Ensure polling stops
            // await memoryPromise; // Do NOT await this. If polling hangs, we hang. Let it die.
        }

        const diff = process.hrtime(startTime);
        const runtime = (diff[0] * 1000 + diff[1] / 1e6); // ms

        const logsBuffer = await container.logs({ stdout: true, stderr: true });
        const output = cleanDockerLogs(logsBuffer);

        return {
            runId,
            status: "success", // Even if it was WRONG answer, the *execution* was a success (no crash)
            output: output.stdout.trim(),
            error: output.stderr.trim(),
            runtime: Math.round(runtime),
            memory: maxMemory,
        };

    } catch (err) {
        return {
            runId,
            status: "system_error",
            output: "",
            error: err.message,
        };
    } finally {
        // Cleanup
        if (container) {
            try {
                await container.remove({ force: true }); // Ensure removal even if running
            } catch (e) { /* ignore */ }
        }
        await fs.remove(workDir);
    }
}

function cleanDockerLogs(buffer) {
    let stdout = "";
    let stderr = "";
    let offset = 0;

    while (offset < buffer.length) {
        const type = buffer[offset]; // 1 = stdout, 2 = stderr
        const length = buffer.readUInt32BE(offset + 4);
        const content = buffer.toString("utf8", offset + 8, offset + 8 + length);

        if (type === 1) stdout += content;
        else if (type === 2) stderr += content;

        offset += 8 + length;
    }

    return { stdout, stderr };
}

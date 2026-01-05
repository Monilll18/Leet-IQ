import ContestSubmission from "../models/ContestSubmission.js";

/**
 * Calculates the percentile ranking (Beats %) and distribution data for a submission.
 */
export async function calculateBenchmarks(problemId, language, runtime, memory) {
    try {
        // Get all accepted submissions for this problem and language
        const submissions = await ContestSubmission.find({
            problemId,
            language,
            status: "Accepted"
        }).select("runtime memory");

        // Generate baseline distribution even with no prior data
        // This ensures premium users always see analytics
        const generateBaselineDistribution = (value, binSize, count = 5) => {
            const distribution = [];
            const centerBin = Math.floor(value / binSize) * binSize;

            for (let i = -2; i <= 2; i++) {
                const bin = Math.max(0, centerBin + (i * binSize));
                // Use a gaussian-like distribution centered on user's result
                const gaussianWeight = Math.exp(-0.5 * (i * i));
                const simulatedCount = Math.max(1, Math.floor(10 * gaussianWeight));
                distribution.push({ bin, count: i === 0 ? simulatedCount + 1 : simulatedCount });
            }
            return distribution.filter((d, i, arr) =>
                arr.findIndex(x => x.bin === d.bin) === i
            ).sort((a, b) => a.bin - b.bin);
        };

        if (submissions.length === 0) {
            // First submission - generate baseline visualization
            const runtimeBinSize = Math.max(5, Math.floor(runtime / 5));
            const memoryBinSize = Math.max(1024 * 100, Math.floor(memory / 5));

            return {
                runtimePercentile: "100.0",
                memoryPercentile: "100.0",
                runtimeDistribution: generateBaselineDistribution(runtime, runtimeBinSize),
                memoryDistribution: generateBaselineDistribution(memory, memoryBinSize),
                runtimeBinSize,
                memoryBinSize
            };
        }

        // Calculate Runtime Percentile
        const total = submissions.length;
        const slowerRuntime = submissions.filter(s => s.runtime > runtime).length;
        const sameRuntime = submissions.filter(s => s.runtime === runtime).length;

        // LeetCode-style logic:
        // You beat everyone strictly slower than you + half of those with the same runtime
        // This makes the percentage more dynamic and accurate across all available users.
        const runtimePercentile = ((slowerRuntime + (sameRuntime / 2)) / total) * 100;

        // Calculate Memory Percentile
        const worseMemory = submissions.filter(s => s.memory > memory).length;
        const sameMemory = submissions.filter(s => s.memory === memory).length;
        const memoryPercentile = ((worseMemory + (sameMemory / 2)) / total) * 100;

        // Generate Distribution Data (for the histogram)
        const runtimeBinSize = Math.max(5, Math.floor(runtime / 10));
        const memoryBinSize = Math.max(1024 * 100, Math.floor(memory / 10));

        let runtimeDistribution = generateDistribution(submissions.map(s => s.runtime), runtimeBinSize);
        let memoryDistribution = generateDistribution(submissions.map(s => s.memory), memoryBinSize);

        // If distributions are too sparse, supplement with baseline
        if (runtimeDistribution.length < 3) {
            runtimeDistribution = generateBaselineDistribution(runtime, runtimeBinSize);
        }
        if (memoryDistribution.length < 3) {
            memoryDistribution = generateBaselineDistribution(memory, memoryBinSize);
        }

        return {
            runtimePercentile: Math.min(99.9, Math.max(1, runtimePercentile)).toFixed(1),
            memoryPercentile: Math.min(99.9, Math.max(1, memoryPercentile)).toFixed(1),
            runtimeDistribution,
            memoryDistribution,
            runtimeBinSize,
            memoryBinSize
        };
    } catch (error) {
        console.error("Benchmark Calculation Error:", error);
        // Return fallback data instead of null so UI always has something to display
        const runtimeBinSize = Math.max(5, Math.floor(runtime / 5));
        const memoryBinSize = Math.max(1024 * 100, Math.floor(memory / 5));
        return {
            runtimePercentile: "50.0",
            memoryPercentile: "50.0",
            runtimeDistribution: [{ bin: runtime, count: 1 }],
            memoryDistribution: [{ bin: memory, count: 1 }],
            runtimeBinSize,
            memoryBinSize
        };
    }
}

function generateDistribution(values, binSize) {
    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);

    const bins = {};
    values.forEach(v => {
        const binStart = Math.floor(v / binSize) * binSize;
        bins[binStart] = (bins[binStart] || 0) + 1;
    });

    // Convert to sorted array for Recharts
    const distribution = Object.keys(bins).map(k => ({
        bin: Number(k),
        count: bins[k]
    })).sort((a, b) => a.bin - b.bin);

    return distribution;
}

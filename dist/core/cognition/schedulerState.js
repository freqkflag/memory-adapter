import { MemoryService } from "../../memory/MemoryService.js";
import { parseELang } from "../../emotion/elangParser.js";
import { createTrajectory } from "../../emotion/trajectory.js";
const DEFAULT_WINDOW_DAYS = 7;
const DEFAULT_MAX_SAMPLES = 64;
const DEFAULT_MIN_SAMPLES = 3;
function clamp01(value) {
    if (!Number.isFinite(value))
        return 0;
    if (value < 0)
        return 0;
    if (value > 1)
        return 1;
    return value;
}
export function getNeutralSchedulerState() {
    return {
        strainScore: 0.5,
        volatilityScore: 0.5,
        stabilityScore: 0.5,
        confidence: 0,
        sampleCount: 0
    };
}
function vectorMagnitude(v) {
    const values = Object.values(v.axes);
    if (values.length === 0)
        return 0;
    const sumSquares = values.reduce((sum, n) => sum + n * n, 0);
    return Math.sqrt(sumSquares / values.length);
}
function pairDistance(a, b) {
    const keys = new Set([...Object.keys(a.axes), ...Object.keys(b.axes)]);
    if (keys.size === 0)
        return 0;
    let sumSquares = 0;
    for (const key of keys) {
        const delta = (b.axes[key] ?? 0) - (a.axes[key] ?? 0);
        sumSquares += delta * delta;
    }
    return Math.sqrt(sumSquares / keys.size);
}
export function deriveSchedulerStateFromVectors(vectors, minSamples = DEFAULT_MIN_SAMPLES) {
    if (vectors.length < minSamples) {
        return getNeutralSchedulerState();
    }
    const ordered = createTrajectory([...vectors]);
    const sampleCount = ordered.length;
    const magnitudes = ordered.map((v) => vectorMagnitude(v));
    const avgMagnitude = magnitudes.reduce((sum, value) => sum + value, 0) / Math.max(magnitudes.length, 1);
    const distances = [];
    for (let i = 1; i < ordered.length; i++) {
        distances.push(pairDistance(ordered[i - 1], ordered[i]));
    }
    const avgDistance = distances.reduce((sum, value) => sum + value, 0) / Math.max(distances.length, 1);
    // Conservative normalization keeps output bounded and explainable.
    const strainScore = clamp01(avgMagnitude / 2);
    const volatilityScore = clamp01(avgDistance / 1.5);
    const stabilityScore = clamp01(1 - volatilityScore);
    const confidence = clamp01((sampleCount - minSamples + 1) / (minSamples + 8));
    return {
        strainScore,
        volatilityScore,
        stabilityScore,
        confidence,
        sampleCount
    };
}
export function deriveSchedulerStateFromMemories(memories, options = {}) {
    const windowDays = options.windowDays ?? DEFAULT_WINDOW_DAYS;
    const maxSamples = options.maxSamples ?? DEFAULT_MAX_SAMPLES;
    const minSamples = options.minSamples ?? DEFAULT_MIN_SAMPLES;
    const nowTs = Date.now();
    const windowStart = nowTs - windowDays * 24 * 60 * 60 * 1000;
    const emotionMemories = memories
        .filter((m) => m.domain === "emotion")
        .sort((a, b) => a.timestamp - b.timestamp);
    const windowed = emotionMemories.filter((m) => m.timestamp >= windowStart);
    const source = (windowed.length > 0 ? windowed : emotionMemories).slice(-maxSamples);
    const parsed = [];
    for (const mem of source) {
        try {
            const vector = parseELang(mem.text);
            vector.timestamp = mem.timestamp;
            parsed.push(vector);
        }
        catch {
            // Ignore non-E-Lang entries; scheduler falls back safely when data is sparse.
        }
    }
    return deriveSchedulerStateFromVectors(parsed, minSamples);
}
export async function loadSchedulerStateFromRecentEmotion(options = {}) {
    const memoryService = new MemoryService();
    await memoryService.loadAll("goal-scheduler");
    return deriveSchedulerStateFromMemories(memoryService.getAll(), options);
}

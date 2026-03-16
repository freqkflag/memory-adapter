import { createTrajectory } from "../../emotion/trajectory.js";
export function computeEmotionalDriftOverLastN(events, lastN) {
    if (events.length === 0 || lastN <= 0) {
        return {
            startTimestamp: null,
            endTimestamp: null,
            count: 0,
            axisDeltas: {},
            axisAverageChanges: {}
        };
    }
    const sorted = createTrajectory(events);
    const window = sorted.slice(-lastN);
    const first = window[0];
    const last = window[window.length - 1];
    const axisDeltas = {};
    const axisAverageChanges = {};
    const axisKeys = new Set([
        ...Object.keys(first.axes),
        ...Object.keys(last.axes),
        ...window.flatMap((v) => Object.keys(v.axes))
    ]);
    for (const axis of axisKeys) {
        const startVal = first.axes[axis] ?? 0;
        const endVal = last.axes[axis] ?? 0;
        axisDeltas[axis] = endVal - startVal;
        if (window.length > 1) {
            let changeSum = 0;
            let steps = 0;
            for (let i = 1; i < window.length; i++) {
                const prev = window[i - 1].axes[axis] ?? 0;
                const curr = window[i].axes[axis] ?? 0;
                changeSum += curr - prev;
                steps += 1;
            }
            axisAverageChanges[axis] = steps ? changeSum / steps : 0;
        }
        else {
            axisAverageChanges[axis] = 0;
        }
    }
    return {
        startTimestamp: first.timestamp,
        endTimestamp: last.timestamp,
        count: window.length,
        axisDeltas,
        axisAverageChanges
    };
}

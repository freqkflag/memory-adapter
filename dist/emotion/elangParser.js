"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseELang = parseELang;
const axisRegistry_1 = require("./axisRegistry");
const time_1 = require("../utils/time");
// ABNF-style grammar (documentation):
// elang       = vector [";" trajectory]
// vector      = 1*(axis)
// axis        = axis-name ":" number
// axis-name   = 1*(ALPHA / DIGIT / "_")
// number      = ["-"] 1*DIGIT ["." 1*DIGIT]
// trajectory  = "->" 1*(vector)
function parseELang(input) {
    const trimmed = input.trim();
    if (!trimmed) {
        throw new Error("Empty E-Lang expression");
    }
    const [head, trajPart] = splitOnce(trimmed, "->");
    const axisRegistry = (0, axisRegistry_1.loadAxisRegistry)();
    const mainVector = parseVector(head.trim(), axisRegistry);
    mainVector.source = "user";
    if (trajPart) {
        const trajectoryVectors = [];
        const segments = trajPart.split("|");
        for (const segment of segments) {
            if (!segment.trim())
                continue;
            const v = parseVector(segment.trim(), axisRegistry);
            v.source = "user";
            trajectoryVectors.push(v);
        }
        if (trajectoryVectors.length > 0) {
            mainVector.trajectory = trajectoryVectors;
        }
    }
    if (!mainVector.timestamp) {
        mainVector.timestamp = (0, time_1.now)();
    }
    return mainVector;
}
function parseVector(expr, axisRegistry) {
    const axes = {};
    const parts = expr.split(",");
    for (const part of parts) {
        const p = part.trim();
        if (!p)
            continue;
        const [name, valueStr] = splitOnce(p, ":");
        if (!name || valueStr === undefined) {
            throw new Error(`Invalid axis expression: "${p}"`);
        }
        const axisName = name.trim();
        if (!axisRegistry[axisName]) {
            throw new Error(`Unknown axis "${axisName}"`);
        }
        const value = Number(valueStr.trim());
        if (!Number.isFinite(value)) {
            throw new Error(`Invalid numeric value for axis "${axisName}": "${valueStr}"`);
        }
        axes[axisName] = value;
    }
    if (Object.keys(axes).length === 0) {
        throw new Error("E-Lang vector must define at least one axis");
    }
    return {
        axes,
        timestamp: (0, time_1.now)(),
        source: "user"
    };
}
function splitOnce(input, delimiter) {
    const idx = input.indexOf(delimiter);
    if (idx === -1)
        return [input, undefined];
    const left = input.slice(0, idx);
    const right = input.slice(idx + delimiter.length);
    return [left, right];
}

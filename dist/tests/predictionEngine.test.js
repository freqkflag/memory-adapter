"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPredictionEngineTests = runPredictionEngineTests;
const assert_1 = __importDefault(require("assert"));
const predictionEngine_1 = require("../prediction/predictionEngine");
function runPredictionEngineTests() {
    const base = {
        text: "",
        domain: "projects",
        durability: "normal",
        sectionPath: [],
        tags: [],
        strength: 0.5,
        importance: 0.5,
        accessCount: 0,
        createdBy: "test",
        updatedBy: "test",
        version: 1,
        timestamp: Date.now()
    };
    const memories = [
        { ...base, id: "p1", text: "Working on projects frequently." },
        { ...base, id: "p2", text: "Another project-focused memory." }
    ];
    const predictions = (0, predictionEngine_1.generatePredictions)(memories);
    if (predictions.length > 0) {
        const p = predictions[0];
        assert_1.default.ok((0, predictionEngine_1.isPredictionActive)(p));
        assert_1.default.ok(p.expiresAt && p.expiresAt > p.createdAt);
    }
}

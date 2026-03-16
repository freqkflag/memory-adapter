"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runElangParserTests = runElangParserTests;
const assert_1 = __importDefault(require("assert"));
const elangParser_1 = require("../emotion/elangParser");
function runElangParserTests() {
    const v = (0, elangParser_1.parseELang)("valence:0.5, arousal:0.2 -> valence:0.6, arousal:0.3");
    assert_1.default.strictEqual(v.source, "user");
    assert_1.default.ok(Math.abs(v.axes.valence - 0.5) < 1e-9);
    assert_1.default.ok(v.trajectory && v.trajectory.length === 1);
}

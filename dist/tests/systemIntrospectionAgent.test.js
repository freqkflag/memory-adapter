"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSystemIntrospectionTests = runSystemIntrospectionTests;
const assert_1 = __importDefault(require("assert"));
const systemIntrospectionAgent_1 = require("../agents/systemIntrospectionAgent");
const cognitionCoordinator_1 = require("../cognition/cognitionCoordinator");
const MemoryService_1 = require("../memory/MemoryService");
const agentRegistry_1 = require("../cognition/agentRegistry");
const operationLog_1 = require("../cognition/operationLog");
const changeBroadcast_1 = require("../cognition/changeBroadcast");
async function runSystemIntrospectionTests() {
    const memoryService = new MemoryService_1.MemoryService();
    const agents = new agentRegistry_1.AgentRegistry();
    const opLog = new operationLog_1.OperationLog();
    const broadcaster = new changeBroadcast_1.ChangeBroadcast();
    const coordinator = new cognitionCoordinator_1.CognitionCoordinator(memoryService, agents, opLog, broadcaster);
    // Seed a few in-memory items directly
    const now = Date.now();
    const sampleMemories = [
        {
            id: "m1",
            text: "Test identity memory.",
            domain: "identity",
            durability: "normal",
            sectionPath: [],
            tags: [],
            strength: 0.5,
            importance: 0.5,
            accessCount: 0,
            createdBy: "test",
            updatedBy: "test",
            version: 1,
            timestamp: now
        }
    ];
    // Patch coordinator's getAllMemories via prototype for this test context
    // to avoid touching internal state.
    coordinator.getAllMemories = () => sampleMemories;
    const agent = new systemIntrospectionAgent_1.SystemIntrospectionAgent(coordinator);
    const report = await agent.analyze();
    assert_1.default.ok(report.metrics.memoryCount >= 1);
    assert_1.default.ok(report.alerts.length >= 1);
}

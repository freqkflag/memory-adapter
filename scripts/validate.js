"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryService_1 = require("../src/memory/MemoryService");
const path_1 = __importDefault(require("path"));
async function main() {
    const baseDir = path_1.default.resolve(process.cwd());
    const service = new MemoryService_1.MemoryService(baseDir);
    console.log("== getUserSummary ==");
    const summary = service.getUserSummary();
    if (!summary.ok || !summary.data) {
        throw new Error(summary.error ?? "getUserSummary failed");
    }
    console.log(summary.data.split("\n").slice(0, 10).join("\n"));
    console.log("\n== getRelevantContext('tattoo') ==");
    const ctx = service.getRelevantContext({ query: "tattoo", limit: 5 });
    if (!ctx.ok || !ctx.data) {
        throw new Error(ctx.error ?? "getRelevantContext failed");
    }
    ctx.data.forEach((item) => {
        console.log(`- [${item.domain}/${item.durability}] ${item.sourceFile} :: ${item.sectionPath.join(" > ")} :: ${item.text}`);
    });
    console.log("\nValidation completed successfully.");
}
main().catch((err) => {
    console.error("Validation script failed:", err);
    process.exit(1);
});

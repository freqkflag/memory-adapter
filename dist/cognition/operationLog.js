"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationLog = void 0;
const fs_1 = require("fs");
const ids_1 = require("../utils/ids");
const time_1 = require("../utils/time");
const LOG_PATH = "memory/operations.log";
class OperationLog {
    async record(op) {
        const full = {
            ...op,
            id: (0, ids_1.generateId)("op"),
            timestamp: (0, time_1.now)()
        };
        const line = JSON.stringify(full);
        await fs_1.promises.appendFile(LOG_PATH, line + "\n", "utf8");
        return full;
    }
}
exports.OperationLog = OperationLog;

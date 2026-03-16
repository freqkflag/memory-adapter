import { promises as fs } from "fs";
import { generateId } from "../utils/ids";
import { now } from "../utils/time";
const LOG_PATH = "memory/operations.log";
export class OperationLog {
    async record(op) {
        const full = {
            ...op,
            id: generateId("op"),
            timestamp: now()
        };
        const line = JSON.stringify(full);
        await fs.appendFile(LOG_PATH, line + "\n", "utf8");
        return full;
    }
}

import { promises as fs } from "fs";
import { generateId } from "../utils/ids.js";
import { now } from "../utils/time.js";
import { getPamDataDir, pamDataFile } from "../config/runtime.js";
const LOG_PATH = pamDataFile("operations.log");
export class OperationLog {
    async record(op) {
        const full = {
            ...op,
            id: generateId("op"),
            timestamp: now()
        };
        const line = JSON.stringify(full);
        await fs.mkdir(getPamDataDir(), { recursive: true });
        await fs.appendFile(LOG_PATH, line + "\n", "utf8");
        return full;
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMemoryMarkdown = parseMemoryMarkdown;
const sectionParser_1 = require("./sectionParser");
const ids_1 = require("../utils/ids");
const time_1 = require("../utils/time");
function parseMemoryMarkdown(markdown, domain, createdBy) {
    const sections = (0, sectionParser_1.parseSections)(markdown);
    const items = [];
    const timestamp = (0, time_1.now)();
    for (const section of sections) {
        const text = section.content.join("\n").trim();
        if (!text)
            continue;
        const item = {
            id: (0, ids_1.generateId)("mem"),
            text,
            domain,
            durability: "normal",
            sectionPath: section.path,
            tags: [],
            strength: 0.5,
            importance: 0.5,
            accessCount: 0,
            createdBy,
            updatedBy: createdBy,
            version: 1,
            timestamp
        };
        items.push(item);
    }
    return { sections, items };
}

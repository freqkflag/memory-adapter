import { parseSections } from "./sectionParser";
import { generateId } from "../utils/ids";
import { now } from "../utils/time";
export function parseMemoryMarkdown(markdown, domain, createdBy) {
    const sections = parseSections(markdown);
    const items = [];
    const timestamp = now();
    for (const section of sections) {
        const text = section.content.join("\n").trim();
        if (!text)
            continue;
        const item = {
            id: generateId("mem"),
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

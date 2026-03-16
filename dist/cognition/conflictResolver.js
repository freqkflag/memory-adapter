"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDuplicateWrites = resolveDuplicateWrites;
exports.mergeTags = mergeTags;
function resolveDuplicateWrites(existing, incoming) {
    const mergedTags = Array.from(new Set([...existing.tags, ...incoming.tags]));
    const updated = {
        ...existing,
        text: existing.text === incoming.text ? existing.text : incoming.text,
        tags: mergedTags,
        version: Math.max(existing.version, incoming.version) + 1
    };
    const conflict = existing.text !== incoming.text;
    return {
        item: updated,
        conflict,
        notes: conflict ? "Text conflict detected; using latest version and incrementing version counter." : undefined
    };
}
function mergeTags(existing, updates) {
    return Array.from(new Set([...existing, ...updates]));
}

import { TOOL_DEFINITIONS } from "./tools.js";
function serializeInputSchema(schema) {
    try {
        if (!schema)
            return "";
        if (typeof schema === "string")
            return schema;
        if (typeof schema.toString === "function")
            return schema.toString();
        return JSON.stringify(schema);
    }
    catch {
        return "unavailable";
    }
}
export function getToolManifest() {
    return TOOL_DEFINITIONS.map((t) => ({
        name: t.name,
        description: t.description,
        capabilities: t.capabilities ?? [],
        domains: t.domains ?? [],
        inputSchema: serializeInputSchema(t.inputSchema)
    }));
}

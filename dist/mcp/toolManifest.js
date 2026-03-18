import { TOOL_DEFINITIONS } from "./tools.js";
export function getToolManifest() {
    return TOOL_DEFINITIONS.map((t) => ({
        name: t.name,
        description: t.description,
        capabilities: t.capabilities ?? [],
        domains: t.domains ?? [],
        inputSchema: t.inputSchema
    }));
}

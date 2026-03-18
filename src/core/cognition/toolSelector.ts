import { TOOL_DEFINITIONS } from "../../mcp/tools.js";

export function selectTools(filters: { capability?: string; domain?: string }) {
  return TOOL_DEFINITIONS.filter((tool) => {
    const capabilityMatch =
      !filters.capability || tool.capabilities?.includes(filters.capability);

    const domainMatch =
      !filters.domain || tool.domains?.includes(filters.domain);

    return capabilityMatch && domainMatch;
  });
}


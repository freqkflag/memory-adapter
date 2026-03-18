import { createAIOS } from "../sdk/index.js";
import { TOOL_DEFINITIONS } from "../mcp/tools.js";

async function main() {
  const [, , toolName, argJson] = process.argv;

  if (!toolName) {
    console.log("Usage: pam <toolName> '<jsonArgs>'");
    process.exit(1);
  }

  let args: any = {};
  if (argJson) {
    try {
      args = JSON.parse(argJson);
    } catch {
      console.log(JSON.stringify({ ok: false, error: "Invalid JSON for <jsonArgs>" }, null, 2));
      process.exit(1);
    }
  }

  const aios = await createAIOS();
  const coordinator = aios.cognition.coordinator;

  const tool = TOOL_DEFINITIONS.find(t => t.name === toolName);

  if (!tool) {
    console.log(JSON.stringify({ ok: false, error: `Tool not found: ${toolName}` }, null, 2));
    process.exit(1);
  }

  try {
    const result = await tool.handler(coordinator, args ?? {});
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(JSON.stringify({ ok: false, error: message }, null, 2));
    process.exit(1);
  }
}

main().catch(err => {
  const message = err instanceof Error ? err.message : String(err);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ ok: false, error: message }, null, 2));
  process.exit(1);
});


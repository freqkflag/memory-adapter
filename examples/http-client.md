## PAM remote-first HTTP tool bridge

Base URL: `https://pam.cultofjoey.com`

Auth (optional): if the server is configured with `PAM_AUTH_TOKEN`, send:
`Authorization: Bearer <token>`

### Health (public)

```bash
curl -sS https://pam.cultofjoey.com/health
```

### List tools (protected when `PAM_AUTH_TOKEN` is set)

```bash
export PAM_AUTH_TOKEN="change-me"
curl -sS \
  -H "Authorization: Bearer ${PAM_AUTH_TOKEN}" \
  https://pam.cultofjoey.com/tools
```

### Call a tool: `list_tools`

```bash
export PAM_AUTH_TOKEN="change-me"
curl -sS \
  -X POST https://pam.cultofjoey.com/tool/list_tools \
  -H "Authorization: Bearer ${PAM_AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{}'
```

### Call a tool with args (example: `auto_plan`)

```bash
export PAM_AUTH_TOKEN="change-me"
curl -sS \
  -X POST https://pam.cultofjoey.com/tool/auto_plan \
  -H "Authorization: Bearer ${PAM_AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"goal":"Write and run a smoke test plan"}'
```

---

## Cursor local stdio MCP (no HTTP)

If you want local MCP/stdio instead of HTTP, use the `ai-os` stdio server and configure Cursor via `examples/cursor.mcp.json`.

That config uses:
`command: npx`
`args: ["ai-os"]`


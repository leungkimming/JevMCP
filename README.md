# Jev MCP

This project converts the Jev workflow gate in `SKILL.MD` into an MCP server for VS Code and other MCP hosts.

## Requirements

- Node.js 20 or newer
- A TypeSafe API key in `TYPESAFE_API_KEY`

## Build

```powershell
npm install
npm run build
```

## Use in VS Code

The workspace `.vscode/mcp.json` registers the built server. Set `TYPESAFE_API_KEY` in the environment that launches VS Code, then run `MCP: List Servers` and start `jev`.

The server exposes two tools:

- `jev_decision` requests an allow/deny decision using `step`, `feature`, `task`, and a flexible `context` JSON object.
- `Jev_Rank` accepts workflow fields matching `jev_decision`, with JSON `context` and JSON `questionText`. Put artifact content and evaluation criteria in `context`; set `questionText.quality.instructions` and a `ranking` scale from 1 to 10. It returns Jev's numeric quality score and response.

For `jev_decision`, put the relevant decision material in `context`, such as requirements, generated code, test cases, test results, pass rates, constraints, or a proposed action. For example:

```json
{
	"requirements": ["Validate email addresses", "Reject empty input"],
	"generatedCode": "function validateEmail(value) { ... }",
	"testResults": { "passed": 8, "failed": 0, "passRate": 1 },
	"proposedAction": "Proceed with the implementation"
}
```

It returns an allowed result only when Jev answers `yes`; missing configuration, request failures, missing answers, and `no` answers are reported as `BLOCKED`.

## Run manually

```powershell
$env:TYPESAFE_API_KEY = "your-key"
npm run build
npm start
```

The server uses stdio, so do not write application logs to stdout. Diagnostics are sent to stderr.

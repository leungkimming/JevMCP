import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";
import { z } from "zod";
const jsonValueSchema = z.lazy(() => z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
]));
const decisionInput = z.object({
    step: z.string().min(1),
    feature: z.string().min(1),
    task: z.string().min(1),
    context: z.record(z.string(), jsonValueSchema).describe("Decision context as JSON. Include the requirements, generated code, tests, test results, pass rates, constraints, and proposed action that Jev should evaluate."),
    questionText: z.string().min(1).default("Should the agent proceed with this action?"),
});
export async function requireJevDecision(input) {
    const client = new TypeSafeClient();
    const response = await client.systemOne({
        state: {
            step: input.step,
            feature: input.feature,
            task: input.task,
            context: input.context,
        },
        questions: {
            checkpoint: choice(input.questionText, {
                yes: null,
                no: null,
            }),
        },
    });
    const decision = response?.answers?.checkpoint?.choice;
    if (decision !== "yes") {
        throw new Error("BLOCKED: Jev did not allow the action to proceed.");
    }
    return response;
}
const server = new McpServer({
    name: "jev",
    version: "0.1.2",
});
server.registerTool("jev_decision", {
    description: `Jev MCP Decision Tool

Request a human-or-policy-style decision from Jev before continuing with a workflow step. Use this for gated approval checks where the agent must show the exact requirement context, generated artifact content, evidence collected, constraints, and proposed next action. This tool is for decision gating, not general code execution.

Required input:
- step: The workflow step being executed, such as Step 1, Step 2, or Step 3.
- feature: The feature name being worked on, such as book or systemparameter.
- task: The specific task or validation being evaluated.
- context: A JSON object containing the actual implementation evidence Jev should assess. Include the actual requirement text, current artifact content, relevant test or code snippets, validation results, constraints, and proposed action.
- questionText: The explicit approval question Jev should answer.

Important usage rules:
- Do not pass summary-only fields at the top level. Put all substantive evaluation data inside context.
- Include real artifact content, not placeholders.
- Include actual requirement text and generated output that Jev is judging.
- Include evidence such as file contents, test results, pass/fail counts, and code snippets.
- Include constraints that limit the action.
- State the exact next action being proposed.
- Call this tool only when Jev must confirm whether the current artifact and evidence satisfy the task and requirements before continuing.

Example:
{
  "step": "Step 2",
  "feature": "book",
  "task": "Validate the Book feature tests",
  "context": {
    "artifactPath": "workspec/book/FeatureTests.md",
    "artifactContent": "...actual file contents here...",
    "requirements": "...actual requirement text here...",
    "evidence": ["...test coverage evidence...", "...requirement traceability..."],
    "constraints": ["...rules and limits..."],
    "proposedAction": "Proceed to Step 3 and create the Book feature design"
  },
  "questionText": "Should the agent proceed to Step 3 and create the Book feature design?"
}`,
    inputSchema: decisionInput,
}, async (rawInput) => {
    const input = decisionInput.parse(rawInput);
    console.error("Jev decision inputs:", JSON.stringify(input, null, 2));
    try {
        const response = await requireJevDecision(input);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ allowed: true, response }, null, 2),
                }],
        };
    }
    catch (error) {
        console.error("Jev decision failed:", error);
        const reason = error instanceof Error ? error.message : "Jev did not allow the action to proceed.";
        return {
            isError: true,
            content: [{
                    type: "text",
                    text: `BLOCKED\nReason: ${reason.replace(/^BLOCKED:\s*/, "")}`,
                }],
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Jev MCP server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in Jev MCP server:", error);
    process.exit(1);
});

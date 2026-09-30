# Skill: jev
# Description: Mandatory workflow decision-gate skill. Before continuing, blocking, unlocking a step, approving a command, or declaring completion, the agent must call the Jev runtime using the installed `@typesafe-ai/sdk` client.

## Purpose
Use Jev as the shared decision oracle for the workflow. When a workflow decision is required, the agent must call the TypeSafe SDK and act on the returned answer instead of making a direct decision.

## Installation
```bash
npm install @typesafe-ai/sdk
```

## Required runtime contract
This skill is callable with the actual SDK API from the TypeSafe package.

```javascript
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const response = await client.systemOne({
  state: {
    step: currentStep,
    feature: currentFeature,
    task: currentTask,
    artifact: currentArtifact,
    evidence: [
      "Current proof",
      "Current constraints satisfied",
      "Current prerequisites verified"
    ],
    constraints: [
      "Follow workflow rules",
      "Do not use unrelated files",
      "Do not skip required artifacts"
    ],
    proposedAction: "Proceed with the current workflow action"
  },
  questions: {
    checkpoint: choice("Should the agent proceed with this action?", {
      yes: null,
      no: null,
    }),
  },
});

const decision = response.answers.checkpoint.choice;

if (decision !== "yes") {
  throw new Error("BLOCKED: Jev did not allow the action to proceed.");
}
```

## Required behavior
When this skill is required, the agent must do the following:

1. Build the current workflow state object.
2. Set `step`, `feature`, `task`, and `artifact` from the live state.
3. Pass the existing evidence and constraints into `state`.
4. Ask a clear gating question using `choice(...)`.
5. Call `client.systemOne(...)`.
6. Read `response.answers.<question>.choice`.
7. If the answer is not the allowed positive decision, stop and report `BLOCKED`.
8. Never bypass Jev for a required workflow decision.

## Generic reusable helper
```javascript
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

export async function requireJevDecision({
  step,
  feature,
  task,
  artifact,
  evidence,
  constraints,
  proposedAction,
  questionText = "Should the agent proceed with this action?"
}) {
  const client = new TypeSafeClient();

  const response = await client.systemOne({
    state: {
      step,
      feature,
      task,
      artifact,
      evidence,
      constraints,
      proposedAction,
    },
    questions: {
      checkpoint: choice(questionText, {
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
```

## Failure handling
Treat these as blockers:
- missing `TYPESAFE_API_KEY` or invalid SDK configuration
- network or HTTP failure from the TypeSafe service
- empty `response.answers` object
- no `checkpoint` answer
- `response.answers.checkpoint.choice !== "yes"`

When any of these occur, output:

```text
BLOCKED
Reason: Jev did not allow the action to proceed.
```

## Workflow rule
This skill is mandatory for any workflow decision across all steps, all features, and all tasks. The agent must adapt the `state` object to the live workflow context at runtime; it must not bypass the SDK call when a required decision is in play.


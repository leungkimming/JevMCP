---
name: BatchBDDSpecCoding
description: Implement features using a Behavior-Driven Development (BDD) workflow
tools: [execute, read, edit, search, 'jev/*', todo]
---

# BatchBDDSpecCoding
# Strict Source Scope (Hard Constraint)

You must implement this task using ONLY the following sources:
1) <path>/.github/solutionArchitecture.md
2) Skills - SKILL.md and references under each skill
- feature-tests
- feature-design
- feature-tasks
- api-layer
- service-layer
- domain-layer
- data-layer
- common-layer
- unit-test
- integration-test
- coverage-summary-report
- code-review
3) <path>/workspec/{feature}/FeatureTests.md
4) <path>/workspec/{feature}/FeatureDesign.md (if exists)
5) <path>/workspec/{feature}/FeatureTasks.md (if exists)
6) <path>/workspec/{feature}/IntegrationTest.md (if exists)
7) All base classes and common utilities referenced by the above files.
8) All files you created for the {feature}.
9) <path>/HKElectric.EAA5.Infrastructure/Configurations/AppConfig.cs

# Strict decision making Scope (Hard Constraint)
**You must use the Jev mcp tool** whenever you need to check and decise on the completion of a task. You should provide the full context, covering the requirements and the generated artifacts' content for Jev to decide on the acceptance.
- This is a mandatory, not a recommendation.
- If Jev is unavailable, denied, or not approved, stop immediately and report `BLOCKED` with the exact reason.

## Cloud Runner Safety (Hard Constraint)
This agent runs in cloud CI-like environments where local DB/runtime assumptions are invalid.
- Do **NOT** run database migration/database update commands in cloud runner
  (e.g. `dotnet ef migrations add`, `dotnet ef database update`).
- Do **NOT** start/host API.
- In cloud runner, focus on code changes, static validation, and tests that do not require local DB hosting.

## Forbidden (Hard Constraint)
- Do NOT read, reference, infer from, or copy any other unrelated feature/module in the solution.
- Do NOT borrow code patterns from existing unrelated feature implementations.
- Do NOT run database migration / database update commands (e.g., `dotnet ef migrations add`, `dotnet ef database update`).
- Do NOT start/host API.
- Do NOT use memory tools or resolve memory URIs. Shared behavior must come only from committed repository files.
- There are sessions of the same agent editing files on the same folder. Do NOT read or modify unrelated, out-of-scope stray artifacts.

## Compliance check (required before coding)
First output:
- “Allowed files:” with the exact list you will use.
- Continue directly to Step 1 and execute all remaining steps without waiting.
- If any out-of-scope file is needed, report and continue with only the allowed files. Do NOT stop or wait for approval.

## Run Ledger (Hard Constraint)
- Every run MUST maintain and print a **Step Ledger** entry whenever a step starts or completes.
- Required ledger format (exact fields):
  - `Step N / Artifact / Proof / Next unlocked step`
- `Artifact` must be the concrete deliverable file/output for that step (e.g., `workspec/{featurex}/FeatureDesign.md`).
- `Proof` must be objective evidence (file created/updated, test output snippet, command result, or compile success).
- `Next unlocked step` must be one of `Step 1` ... `Step 8`; if blocked, state `BLOCKED` with reason.

## No Artifact, No Advance (Hard Constraint)
- You MUST NOT start Step `N+1` unless Step `N` has both:
  1) a concrete artifact, and
  2) explicit proof recorded in the Step Ledger.
- If Step `N` artifact/proof is missing, remain on Step `N`, report the gap, and resolve it first.
- Claims like “done”, “feature works”, or “tests pass” are INVALID without artifact + proof.

## Anti-Premature-Termination Protocol (Hard Constraint)
- You MUST keep `RUN STATUS: IN_PROGRESS` until all Step 1..Step 8 artifacts and proofs exist.
- You MUST NOT output a completion-style closing message (e.g., “completed”, “finished”, “all done”, final handoff summary) while `RUN STATUS` is `IN_PROGRESS`.
- You MAY only output `RUN STATUS: COMPLETED` when all of the following are true:
  1) Step Ledger has objective proof for Step 1..Step 8,
  2) End-of-Run Compliance Summary includes Step 1..Step 8 with non-empty output + proof,
  3) Step 8 includes printed coverage summary report and full unit test output.
- If tool/context limits are reached, do NOT stop silently. Record `BLOCKED` for the impacted step, continue all unblocked steps, and keep `RUN STATUS: IN_PROGRESS`.
- At every step transition, print both:
  - `RUN STATUS: IN_PROGRESS`
  - `Step N / Artifact / Proof / Next unlocked step`

# Overview

Follow a step-by-step BDD workflow to implement features. Use the Given-When-Then format to check acceptance criteria, design solutions, and verify correctness with unit tests.

# Workflow Steps
# Important
# Strict workflow completion rule (Hard Constraint)
- It is a mandatory rule that Step 1 through Step 8 must all be completed in sequence before submitting any final result.
- Completing Step 1 alone is NOT sufficient and MUST NOT be treated as completion.
- The agent must automatically continue from Step 1 to Step 8 without waiting for additional confirmation between steps.
- If blocked at any step, report `BLOCKED` with reason and continue all remaining unblocked steps; do not end the run early.
**Critical**: Do not skip any step, and do not stop until all 8 steps are completed.
**Critical**:  For each step transition, print the Step Ledger line before moving forward.

**Step 1:**  
- Locate the `workspec/{featurex}` folder, where `{featurex}` is the short name of the feature to implement.
- Read and fully understand the `FeatureTests.md` file in `workspec/{featurex}`.
- **Jev_decide**: Check and decide on the completness of the required artifact: A brief summary of the requirements.

**Step 2:**
- Hard constraint: Use the `feature-tests` skill to create a comprehensive list of test scenarios covering all acceptance criteria based on the requirements.
- Append the list to the existing `FeatureTests.md` file if it already contains content, or create it if it does not exist.
- **Jev_decide**: Check and decide on whether all requirements have been met.
- **Jev_decide**: Check and decide on the comprehensive test scenarios in the required artifact: `FeatureTests.md` file.

**Step 3:**  
- Hard constraint: Use the `feature-design` skill to create a `FeatureDesign.md` file in `workspec/{featurex}`.  
- Read `.github/solutionArchitecture.md` to understand the overall solution architecture.
- Base the design on requirements and test scenarios from `FeatureTests.md`.
- Use the format and examples provided by the `feature-design` skill.
- **CRITICAL**: Read the skills of each layer before starting the design.
- Check for yourself whether all requirements have been met.
- **CRITICAL — Black-Box Unit Test RULE**: If a unit test scenario is applicable to the domain layer, it MUST also be applicable to the service layer. In other words, every domain scenario must also be repeated at the service level to assert the service correctly invokes the domain logic the specific number of times with the expected parameters.
- Required artifact: `FeatureDesign.md` file with detailed design specifications and applicable unit-tests per each architecture layer (Domain, Data, Service).
## SKILL Invocation Ledger (Hard Constraint)
- Every mandatory skill call in Step 3 MUST be recorded in a **SKILL Invocation Ledger** entry before any design for that layer is written.
- You MUST NOT write any design for a layer until the corresponding skill has been invioked and recorded in the ledger.
- Required SKILL Invocation Ledger to complete before any Step 3 code:
```
| Skill | Invoked | Output Recorded | Layer Code can be Unlocked |
|---|---|---|---|
| domain-layer | ☐ | ☐ | ☐ |
| data-layer | ☐ | ☐ | ☐ |
| service-layer | ☐ | ☐ | ☐ |
| api-layer | ☐ | ☐ | ☐ |
| common-layer | ☐ | ☐ | ☐ |
| unit-test | ☐ | ☐ | ☐ |
| integration-test | ☐ | ☐ | ☐ |
```
- **Jev_decide**: Check and decide on the completion of the skill invocation Ledger. 
- **Jev_decide**: provide the content of `.github/solutionArchitecture.md` and the generated `FeatureDesign.md` file for Jev to rank the quality of `FeatureDesign.md` from 1 to 10. passing mark is 6. 

**Step 4:**  
- Hard constraint: Use the `feature-tasks` skill to create a `FeatureTasks.md` file in `workspec/{featurex}`.  
- Base tasks on both `FeatureDesign.md` and `FeatureTests.md`.
- Use the format and examples provided by the `feature-tasks` skill.
- Check for yourself whether all requirements have been met.
- Required artifact: `FeatureTasks.md` file with a comprehensive list of implementation tasks, organized by architecture layer and mapped to specific test scenarios.

## Step 4 Exit Gate — Task Unit Test Validation Report (Hard Blocking Constraint)
Required Task Unit Test Validation Report format. Print the results inline:
```
| Layer | FeatureDesign.md | FeatureTasks.md |
|---|---|---|
| Domain (`BookAggregateTests`) | N | N |
| Data (`BookRepositoryTests`) | X | X |
| Service (`BookServiceTests`) | Y | Y |
```
- **Jev_decide**: provide the Task Unit Test Validation Report to Jev to decide if The number of unit tests per layer in `FeatureTasks.md` must match the number of implementation tasks in `FeatureDesign.md` for that layer. If Jev's decision is NO, resolve the gap by adding missing tests, reprint the table and request Jev_decide to check again.

**Step 5**
Only execute tasks from `FeatureTasks.md`.
You must reference the design in `FeatureDesign.md` when using skills to execute the tasks from `FeatureTasks.md`.
## `FeatureDesign.md` Read Ledger (Hard Constraint)
- Required `FeatureDesign.md` Read Ledger to complete before next task:
```
| `FeatureDesign.md` | Read |
|---|---|
| `FeatureDesign.md` | ☐ |
```
- **Jev_decide**: provide the `FeatureDesign.md` Read Ledger to Jev to decide if you can proceed to next task.

## SKILL Invocation Ledger (Hard Constraint)
- Every mandatory skill call in Step 5 MUST be recorded in a **SKILL Invocation Ledger** entry before any code for that layer is written.
- You MUST NOT write any code for a layer until the corresponding skill has been invioked and recorded in the ledger.
- Required SKILL Invocation Ledger to complete before any Step 5 code:
```
| Skill | Invoked | Output Recorded | Layer Code Unlocked |
|---|---|---|---|
| domain-layer | ☐ | ☐ | ☐ |
| data-layer | ☐ | ☐ | ☐ |
| service-layer | ☐ | ☐ | ☐ |
| api-layer | ☐ | ☐ | ☐ |
| common-layer | ☐ | ☐ | ☐ |
| unit-test | ☐ | ☐ | ☐ |
| integration-test | ☐ | ☐ | ☐ |
```
- **Jev_decide**: provide the SKILL Invocation Ledger to Jev to decide if you can proceed to Step 5 code generation.

# Code Generation Guidance

- **Important** Always check generated code against `FeatureDesign.md` for correctness.

## Strict Task Locking (Mandatory)

- Treat each task batch as locked until all prior batches are completed and reported.
- “Feature works” or “targeted tests pass” does NOT allow skipping any unfinished task batch.
- Do NOT proceed with remaining steps until all Step 5 checks are complete.
- **Hard Constraint**: Do NOT proceed to Step 6 until all unit tests for Domain, Data, and Service layers are implemented and passing, and the cross-validation report confirms alignment between design, tasks, and executed tests.

## Pre-Action Compliance Check (Run before every code/tool action)

Before any implementation, test execution, integration-test generation, or API spec generation, explicitly verify:
1. The action maps to the current unlocked step/task in `FeatureTasks.md`.
2. All prerequisite batches in the same step are complete.

## Step 5 Exit Gate — Cross-Validation Report (Hard Blocking Constraint)

Before Step 6 is unlocked, you MUST complete ALL of the following and print the results inline:

1. **Run all unit tests** and capture the full output (pass/fail counts per test class).
2. **Print the Unit Tests Cross-Validation Report** using the exact table format below. Populate every cell with real numbers from the executed test output — do NOT use placeholder values or estimations.
  - Counts for FeatureDesign.md, FeatureTasks.md, and executed tests MUST be derived independently.
  - It is forbidden to modify the counts of FeatureDesign.md or FeatureTasks.md to match implemented tests. 
  - If there is a mismatch, the correct action is to identify the gap (missing tests or incorrect counts), fix it by implementing missing tests, re-run tests, and reprint the corrected table.
3. Required Unit Tests Cross-Validation Report format:
```
| Layer | FeatureDesign.md | FeatureTasks.md | Executed & Passed |
|---|---|---|---|
| Domain (`XxxAggregateTests`) | N | N | N ✅ |
| Data (`XxxRepositoryTests`) | N | N | N ✅ |
| Service (`XxxServiceTests`) | M | M | M ✅ |
```
4. **Verify all three columns match per row**: `FeatureDesign.md` count = `FeatureTasks.md` count = `Executed & Passed` count for every layer. If any cell does not match, fix the gap (add missing tests or correct the design/task counts), re-run, and reprint the table.
5. **Jev_decide**: provid the Unit Tests Cross-Validation Report to Jev to decide if the unit test count in each layer should be the same across FeatureDesign.md, FeatureTasks.md and Executed & Passed. If Jev's decision is NO, Step 6 should not be unlocked.

Claims of "tests pass", "all done", or "feature works" WITHOUT Jev_decide pass is **INVALID** and MUST NOT unlock Step 6.

**Step 6:**
- After successfully completing the backend API solution, use the `integration-test` skill to create an integration test based on the `IntegrationTest.md` specification in the same `workspec/{featurex}` folder.
- Ensure there is NO compiler error in the generated integration test code.
- Hard constraint: Do NOT run database migration / database update commands (e.g., `dotnet ef migrations add`, `dotnet ef database update`).
- Hard constraint: Do NOT start/host API.
- **Jev_decide**: provide the integration test compilation log to Jev to decide on the completion of Step 6.

**Step 7:**
After successfully completing the backend API solution, prepare an `api_spec.yaml` file based on both `FeatureDesign.md` and `FeatureTests.md` for frontend implementation thru AI code generation.
- The `api_spec.yaml` file should include:
  - Feature name
  - User stories
  - API endpoints to be called with detailed description of request and response payloads
  - API Access right requirements
  - Any constants for code mapping
- **CRITICAL**: Before generating the API specification, review the actual implemented code to ensure:
  - Property names match exactly as defined in the actual DTO classes
  - Class names match exactly as implemented in the codebase
  - Enum values and constant values match the actual implementation
  - Request/Response DTO structures reflect the real implementation
  - Use actual property names from search request DTOs, not generic names
  - Reference actual constant class names, not placeholder names
- **🚫 STRICTLY FORBIDDEN - AUDIT FIELDS**: 
  - **NEVER include audit fields in create or update API specifications**: `CurrentLoginId`, `CurrentDateTime`, `CreatedBy`, `CreatedTime`, `UpdatedBy`, `UpdatedTime`, or similar audit trail fields. They are updated internally by the backend and their values should **NEVER** come from API input. However, API specifications should containt these audit fields in response payloads for query APIs, as they are part of the actual data model and may be needed by the frontend.
- Create the `api_spec.yaml` file in the same `workspec/{featurex}` folder.
- **Jev_decide**: provide the content of the generated `api_spec.yaml` file for Jev to rank its quality, in terms of clarity for frontend implementation, from 1 to 10. Passing mark is 7.

**Step 8  (Strict Execution Protocol):**
- Hard constraint: Do NOT run database migration / database update commands (e.g., `dotnet ef migrations add`, `dotnet ef database update`).
- Hard constraint: Do NOT start/host API.
- Run the `coverage-summary-report` skill and print/report its result.
- Print the full unit test output
- Keep the summary.md in the TestResults folder.
- **Jev_decide**: provide the content of the Code coverage summary report and full unit test output for Jev to decide on the completion of Step 8.

## End-of-Run Compliance Summary (Required)
### Before final submission, print a **Compliance Summary** mapping all 8 steps to concrete outputs.

Required summary format:
- `Step 1: <output/file> | <proof>`
- `Step 2: <output/file> | <proof>`
- `Step 3: <output/file> | <proof>`
- `Step 4: <output/file> | <proof>`
- `Step 5: <output/file> | <proof>`
- `Step 6: <output/file> | <proof>`
- `Step 7: <output/file> | <proof>`
- `Step 8: <output/file> | <proof>`

### A Unit Tests cross validation report:
  - A list of Domain layer unit tests in `FeatureDesign.md`, `FeatureTasks.md` and executed with pass result. These 3 lists should be equal.
  - A list of Data layer unit tests in `FeatureDesign.md`, `FeatureTasks.md` and  executed with pass result. These 3 lists should be equal.
  - A list of Service layer unit tests in `FeatureDesign.md`, `FeatureTasks.md` and  executed with pass result. These 3 lists should be equal.

Required Unit Tests cross validation report format:
| Layer | FeatureDesign.md | FeatureTasks.md | Executed & Passed |
|---|---|---|---|
| Domain (`BookAggregateTests`) | 39 | 39 | 39 ✅ |
| Data (`BookRepositoryTests`) | 15 | 15 | 15 ✅ |
| Service (`BookServiceTests`) | 40 | 40 | 40 ✅ |

- Substantiate the cross validation report with unit test result by layer with pass/fail counts:
XXXAggregateTests
Passed!  - Failed:     0, Passed:    39, Skipped:     0, Total:    39
XXXRepositoryTests
Passed!  - Failed:     0, Passed:    15, Skipped:     0, Total:    15
XXXServiceTests
Passed!  - Failed:     0, Passed:    40, Skipped:     0, Total:    40

Validation rule:
- Hard constraint: Do NOT run database migration / database update commands (e.g., `dotnet ef migrations add`, `dotnet ef database update`).
- Hard constraint: Do NOT start/host API.
- If any step is missing output or proof, final submission is NOT compliant and MUST continue until resolved.
- **CRITICAL — CROSS-VALIDATION REPORT REQUIRED**: The Unit Tests Cross-Validation Report MUST be printed as part of this summary. A missing report means `RUN STATUS: IN_PROGRESS`.
- **CRITICAL — NUMBERS MUST MATCH**: If any row in the cross-validation report has mismatched numbers across `FeatureDesign.md`, `FeatureTasks.md`, and `Executed & Passed`, `RUN STATUS` MUST remain `IN_PROGRESS`. Identify the gap, fix it (add missing tests or correct counts in the design/tasks documents), re-run tests, and reprint the corrected table.
- **CRITICAL — SERVICE ≥ DOMAIN**: If the Service layer `Executed & Passed` count is less than the Domain layer `Executed & Passed` count in the cross-validation report, `RUN STATUS` MUST remain `IN_PROGRESS`. Add the missing service-layer unit tests that cover each domain scenario, re-run, and reprint the table.
- Final line must be either:
  - `RUN STATUS: IN_PROGRESS` (if any step lacks artifact/proof, or any cross-validation number mismatches), or
  - `RUN STATUS: COMPLETED` (only after all 8 steps are compliant, and the cross-validation report is printed with all numbers matching).
- **Jev_decide**: provide the CROSS-VALIDATION REPORT for Jev to decide on the satisfaction of the above Validation rules.

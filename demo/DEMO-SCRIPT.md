# Campus Maintenance — Instructor Demo Script

## Before class

- Confirm Node, Git, Claude Code, uv, and Spec Kit.
- Confirm MongoDB Atlas access.
- Keep `demo/erd-example.md` ready.
- Do not put a real `.env` in this kit.

## Phase 2 — Design

Read `specs/campus-maintenance.md`, critique it with AI, accept/reject suggestions, and generate the MaintenanceRequest ERD.

## Phase 5 — Shared layer

Show AGENTS.md, CLAUDE.md, MCP config, hooks, AI log, CI, and PR template. Run `npm install`.

## Phase 6 — Agent toolbox

Pause after `/config`, `/mcp`, `/hooks`, skill discovery, and `/agents`.
Ask Claude to edit `apps/api/.env`; the protected-file hook should block it.

## Phase 7 — First full flow

Create `chore/api-setup`. Use Plan mode for Mongoose, validation, CORS, port, and Swagger.
Verify Swagger at `http://localhost:3001/api`.
Generate shared API types.

### Confident-intern exercise

Students review `demo/planted-bug.controller.ts` first. Then ask the reviewer agent and compare with the answer key.

## PR / CI

Show AI log update, diff reading, PR template, CI, and merge only after green checks.

## Phase 9 — Divide work

Create the four issues from `demo/issues.md`. Student D goes first.

## Phase 10 — Daily loop

Demonstrate Issue 2:
fresh branch → run apps → student attempts DTO → v0 for inspiration → Claude Plan mode → understanding question → refresh OpenAPI types → tests/lint/Playwright → reviewer/security review → read diff → AI log/commit → PR → reviews/CI → merge/cleanup.

Reminder: AI output is a claim to verify, not an answer to trust automatically.

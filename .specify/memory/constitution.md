# Campus Maintenance Request System Constitution

## Core Principles

### I. Code Quality

- Code MUST be TypeScript with no `any` unless unavoidable, and every exception MUST be justified
  in a code comment and in the pull request.
- `npm run lint` MUST pass in `apps/api` and `apps/web`; Prettier formatting is enforced by the
  pre-commit hook and MUST NOT be bypassed.
- New packages MUST NOT be added without team approval recorded in the pull request.
- UI MUST be built from the shared `components/ui` (shadcn/ui) components and the design tokens in
  `apps/web/app/globals.css`.

Rationale: a small team shares one codebase; consistent, typed, linted code keeps reviews fast.

### II. Tests for Every Service (NON-NEGOTIABLE)

- Every NestJS service method MUST have unit tests covering its success path and its documented
  failure paths (for example: unsupported category, missing request).
- Every endpoint MUST have tests proving validation behaviour: 400 on invalid input, 404 on a
  missing resource where applicable.
- User-facing flows (report, list/filter, resolve) MUST be verified end to end with Playwright
  before the feature's pull request is merged.
- `npm test` MUST pass locally and in CI before merge.

Rationale: services hold the business rules; untested services make the spec unenforceable.

### III. MVC Separation

- Controllers MUST handle HTTP concerns only (routing, status codes, DTO binding, Swagger
  decorators) and MUST NOT access Mongoose models.
- Services MUST own business logic and all database operations.
- Mongoose schemas MUST define persistence; DTOs with class-validator MUST define and validate
  API input.
- The Next.js frontend MUST call the API and MUST NOT access MongoDB directly; it MUST use the
  generated types in `apps/web/lib/api-types.ts`.

Rationale: clear boundaries let four students work on separate slices without conflicts.

### IV. No Secrets in Code

- Connection strings, passwords, tokens and API keys MUST live only in untracked environment
  files (`apps/api/.env`, `apps/web/.env.local`) and MUST NOT appear in source, tests, docs, logs,
  pull requests or `docs/ai-log.md`.
- AI agents MUST NOT read or edit `.env` files; the project hooks block such edits.
- A secret committed by mistake MUST be removed and the credential rotated immediately.

Rationale: the repository is public; anything committed is permanently exposed.

## Technology and Scope Constraints

- Backend: NestJS + Mongoose in `apps/api`, listening on port 3001, Swagger UI at `/api`.
- Frontend: Next.js App Router + shadcn/ui in `apps/web`, on port 3000.
- Database: MongoDB, configured only through `MONGODB_URI`.
- The API contract and validation rules in `specs/campus-maintenance.md` are authoritative:
  categories are `equipment`, `electrical`, `plumbing`, `facility`, `other`; statuses are `open`
  and `resolved`; the client MUST NOT set status on create.
- Features listed as out of scope in the specification MUST NOT be built without team approval.

## Development Workflow

- Every change MUST go through a feature branch and a pull request into `main`; `main` is
  protected and requires one approval plus passing `api` and `web` CI checks.
- The API types MUST be regenerated with openapi-typescript whenever the API changes.
- Authors MUST read every changed line, log AI assistance in `docs/ai-log.md`, and complete the
  pull request template before requesting review.

## Governance

- This constitution supersedes other practices; `AGENTS.md` provides day-to-day guidance and MUST
  stay consistent with it.
- Amendments require a pull request approved by at least one teammate, with the version bumped
  using semantic versioning: MAJOR for removed or redefined principles, MINOR for new principles or
  sections, PATCH for wording fixes.
- Reviewers MUST check pull requests against these principles.

**Version**: 1.0.0 | **Ratified**: 2026-09-27 | **Last Amended**: 2026-09-27

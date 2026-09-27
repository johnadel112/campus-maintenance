# Research: Campus Maintenance Requests

No `NEEDS CLARIFICATION` items remained in the Technical Context. The decisions below settle the
implementation choices the spec left open.

## 1. Rejecting whitespace-only text fields

- **Decision**: `@IsString()` + `@IsNotEmpty()` + `@Matches(/\S/)` on title, description and
  location.
- **Rationale**: The global `ValidationPipe` does not enable `transform`, so a trimming
  `@Transform` would not change the stored value; `@Matches(/\S/)` rejects all-space input
  directly and produces a field-specific message.
- **Alternatives considered**: Enabling `transform: true` globally and trimming (changes behaviour
  for every endpoint); Mongoose `trim` + `minlength` (fails with 500 at persistence, not 400).

## 2. Category and status values

- **Decision**: One `request.constants.ts` exports `CATEGORIES` and `STATUSES` as `as const`
  arrays with derived union types, used by the schema enum, `@IsIn` validators and Swagger `enum`.
- **Rationale**: A single source keeps DTO, schema and contract in sync (FR-002).
- **Alternatives considered**: TypeScript `enum` (emits runtime objects and is harder to reuse in
  Swagger); duplicated string lists (drift risk).

## 3. Status protection on create

- **Decision**: `CreateRequestDto` has no `status` property; the global pipe's
  `forbidNonWhitelisted` rejects it with 400; the schema default sets `open`.
- **Rationale**: Satisfies FR-003/FR-004 without special-case code.
- **Alternatives considered**: Stripping `status` silently (`whitelist` only) — accepted requests
  with ignored input hide client bugs.

## 4. Category filter validation

- **Decision**: `ListRequestsQueryDto` with `@IsOptional() @IsIn(CATEGORIES)`; unsupported values
  return 400.
- **Rationale**: Spec edge case: reject rather than silently return an empty list; also prevents
  passing arbitrary values into the Mongo query.
- **Alternatives considered**: Ignoring unknown values (hides typos).

## 5. Resolving: invalid IDs and repeated resolves

- **Decision**: Service checks `isValidObjectId(id)`; malformed or unknown IDs throw
  `NotFoundException` (404). Resolve uses `findByIdAndUpdate(id, { status: 'resolved' },
{ new: true })`, so resolving twice returns the resolved request (idempotent).
- **Rationale**: Matches the spec edge cases ("malformed identifier reported as not found",
  "already resolved does not error") and is safe under concurrent resolves.
- **Alternatives considered**: `ParseObjectIdPipe` (returns 400, contradicting the spec); 409 on
  already resolved (the UI already hides the action, so an error adds no value).

## 6. List ordering and response shape

- **Decision**: `find(filter).sort({ createdAt: -1 })`; schema uses `timestamps: true` and
  `versionKey: false`; a `MaintenanceRequestDto` response class documents `_id`, fields, status and
  timestamps for Swagger.
- **Rationale**: Newest first is the spec assumption; hiding `__v` keeps the public contract clean;
  a response class makes openapi-typescript generate a usable type.
- **Alternatives considered**: Swagger CLI plugin (implicit, and not applied in Vitest runs).

## 7. Testing without a database in CI

- **Decision**: Service specs mock the Mongoose model via `getModelToken`; controller specs build a
  Nest app with the same global `ValidationPipe` and a mocked service, and call it with supertest.
- **Rationale**: CI has no MongoDB; these tests still prove validation (400/404) and service rules.
- **Alternatives considered**: In-memory MongoDB (new package, violates "no new packages").

## 8. Frontend data flow

- **Decision**: `/requests` is a server component that reads `searchParams.category` and fetches
  with `cache: 'no-store'`; the filter is a client `Select` that updates the URL; the resolve button
  and report form are client components that call the API and then `router.refresh()` /
  `router.push('/requests')`. API base URL from `NEXT_PUBLIC_API_URL`, default
  `http://localhost:3001`.
- **Rationale**: URL-driven filters are shareable and keep data fetching on the server; refresh
  meets SC-005 without real-time features (out of scope).
- **Alternatives considered**: Client-side fetching for the list (more state, slower first paint).

## 9. End-to-end verification

- **Decision**: Use the Playwright MCP server (`.cursor/mcp.json`) to drive the running apps for
  each user story, as in the worksheet's Phase 10.8 prompt.
- **Rationale**: Meets Principle II's end-to-end check without adding `@playwright/test`.
- **Alternatives considered**: A committed Playwright test suite (new package; can be proposed later).

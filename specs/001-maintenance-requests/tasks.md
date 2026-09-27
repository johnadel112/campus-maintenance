---
description: "Task list for Campus Maintenance Requests"
---

# Tasks: Campus Maintenance Requests

**Input**: Design documents from `/specs/001-maintenance-requests/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/requests-api.md, quickstart.md

**Tests**: Included. Constitution Principle II requires unit tests for every service and endpoint
tests for validation behaviour.

**Organization**: Grouped by user story. Team slices: Foundation = Student D (goes first),
US1 = Student A, US2 = Student B, US3 = Student C.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3 from spec.md
- Paths: backend `apps/api/src/`, frontend `apps/web/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization (completed in worksheet Phases 4–7)

- [x] T001 Scaffold NestJS app in apps/api and Next.js app in apps/web
- [x] T002 Install @nestjs/mongoose, mongoose, @nestjs/config, class-validator, class-transformer, @nestjs/swagger in apps/api
- [x] T003 [P] Configure Prettier, Husky and lint-staged at the repository root
- [x] T004 [P] Initialize shadcn/ui and add button, card, input, select, badge in apps/web/components/ui/
- [x] T005 Configure Mongoose via ConfigService, global ValidationPipe (whitelist, forbidNonWhitelisted), CORS for http://localhost:3000, PORT default 3001 and Swagger at /api in apps/api/src/main.ts and apps/api/src/app.module.ts

---

## Phase 2: Foundational (Blocking Prerequisites) — Student D, GitHub issue #2

**Purpose**: Shared schema, module shell and layout that every story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is merged

- [ ] T006 Create CATEGORIES (`equipment` | `electrical` | `plumbing` | `facility` | `other`) and STATUSES (`open` | `resolved`) `as const` arrays with derived `Category` and `Status` types in apps/api/src/requests/request.constants.ts
- [ ] T007 Create MaintenanceRequest schema with required `title`, `description`, `location`, `category` (enum CATEGORIES), `status` (enum STATUSES, default `open`), options `timestamps: true`, `versionKey: false` in apps/api/src/requests/schemas/maintenance-request.schema.ts
- [ ] T008 [P] Create MaintenanceRequestDto response class with @ApiProperty for `_id`, `title`, `description`, `location`, `category` (enum), `status` (enum), `createdAt`, `updatedAt` in apps/api/src/requests/dto/maintenance-request.dto.ts
- [ ] T009 Create RequestsService shell injecting the model via @InjectModel in apps/api/src/requests/requests.service.ts
- [ ] T010 Create RequestsController shell with @Controller('requests') and @ApiTags('requests') in apps/api/src/requests/requests.controller.ts
- [ ] T011 Create RequestsModule registering the model with MongooseModule.forFeature and providing service/controller in apps/api/src/requests/requests.module.ts
- [ ] T012 Import RequestsModule in apps/api/src/app.module.ts
- [ ] T013 [P] Create service test harness with a mocked model via getModelToken in apps/api/src/requests/requests.service.spec.ts
- [ ] T014 [P] Create controller test harness (Nest app with the same global ValidationPipe, mocked RequestsService, supertest) in apps/api/src/requests/requests.controller.spec.ts
- [ ] T015 [P] Agree design tokens (colors, radius) in apps/web/app/globals.css
- [ ] T016 [P] Build shared layout with site title and nav links to /requests and /requests/new in apps/web/app/layout.tsx
- [ ] T017 [P] Create typed fetch helpers and API base URL (`NEXT_PUBLIC_API_URL`, default `http://localhost:3001`) in apps/web/lib/api.ts
- [ ] T018 Regenerate apps/web/lib/api-types.ts with `npx openapi-typescript http://localhost:3001/api-json -o apps/web/lib/api-types.ts`

**Checkpoint**: API starts, Swagger shows the `requests` tag and MaintenanceRequestDto schema; `npm test` and lint pass

---

## Phase 3: User Story 1 - Report a maintenance problem (Priority: P1) 🎯 MVP — Student A, GitHub issue #3

**Goal**: Reporters create requests; the system sets status `open`

**Independent Test**: Quickstart scenarios 1–6

### Tests for User Story 1

- [ ] T019 [P] [US1] Service test: `create` saves title/description/location/category and returns status `open` in apps/api/src/requests/requests.service.spec.ts
- [ ] T020 [P] [US1] Endpoint tests: POST /requests returns 201 for a valid body; 400 for missing `title`, whitespace-only `location`, `category: "roof"`, and extra `status` property in apps/api/src/requests/requests.controller.spec.ts

### Implementation for User Story 1

- [ ] T021 [US1] Create CreateRequestDto: `title`, `description`, `location` each `@IsString() @IsNotEmpty() @Matches(/\S/)`; `category` `@IsIn(CATEGORIES)`; @ApiProperty with enum; no `status` property in apps/api/src/requests/dto/create-request.dto.ts
- [ ] T022 [US1] Implement `RequestsService.create(dto)` in apps/api/src/requests/requests.service.ts
- [ ] T023 [US1] Implement `POST /requests` with @ApiCreatedResponse(MaintenanceRequestDto) and @ApiBadRequestResponse in apps/api/src/requests/requests.controller.ts
- [ ] T024 [US1] Regenerate apps/web/lib/api-types.ts
- [ ] T025 [US1] Build client form with Input and Select from components/ui, showing server validation messages per field, in apps/web/components/requests/report-request-form.tsx
- [ ] T026 [US1] Create /requests/new page rendering the form and redirecting to /requests on success in apps/web/app/requests/new/page.tsx
- [ ] T027 [US1] Verify with Playwright MCP: empty submit shows errors; valid submit creates an `open` request

**Checkpoint**: Quickstart 1–6 pass; tests and lint green

---

## Phase 4: User Story 2 - Browse and filter reported requests (Priority: P2) — Student B, GitHub issue #4

**Goal**: Everyone sees all requests newest first and can filter by one category

**Independent Test**: Quickstart scenarios 7–9

### Tests for User Story 2

- [ ] T028 [P] [US2] Service tests: `findAll()` queries `{}` sorted by `createdAt: -1`; `findAll('electrical')` queries `{ category: 'electrical' }` in apps/api/src/requests/requests.service.spec.ts
- [ ] T029 [P] [US2] Endpoint tests: GET /requests 200 with and without `category`; 400 for `category=roof` in apps/api/src/requests/requests.controller.spec.ts

### Implementation for User Story 2

- [ ] T030 [US2] Create ListRequestsQueryDto with `category` `@IsOptional() @IsIn(CATEGORIES)` and @ApiPropertyOptional enum in apps/api/src/requests/dto/list-requests-query.dto.ts
- [ ] T031 [US2] Implement `RequestsService.findAll(category?)` in apps/api/src/requests/requests.service.ts
- [ ] T032 [US2] Implement `GET /requests` with @ApiOkResponse([MaintenanceRequestDto]) in apps/api/src/requests/requests.controller.ts
- [ ] T033 [US2] Regenerate apps/web/lib/api-types.ts
- [ ] T034 [P] [US2] Build client category filter (Select from components/ui, includes "All") that updates `?category=` in apps/web/components/requests/category-filter.tsx
- [ ] T035 [US2] Create /requests server page reading `searchParams.category`, fetching with `cache: 'no-store'`, rendering Card per request with title, location, category and status Badge, plus an empty state, in apps/web/app/requests/page.tsx
- [ ] T036 [US2] Verify with Playwright MCP: list changes after choosing a category

**Checkpoint**: Quickstart 7–9 pass; tests and lint green

---

## Phase 5: User Story 3 - Mark a request as resolved (Priority: P3) — Student C, GitHub issue #5

**Goal**: Users mark open requests resolved; status changes server-side

**Independent Test**: Quickstart scenarios 10–11

### Tests for User Story 3

- [ ] T037 [P] [US3] Service tests: `resolve(id)` sets `status: 'resolved'` via `findByIdAndUpdate(..., { new: true })`; throws NotFoundException for malformed id and for unknown id in apps/api/src/requests/requests.service.spec.ts
- [ ] T038 [P] [US3] Endpoint tests: PATCH /requests/:id/resolve 200 for an existing id; 404 for unknown and malformed ids in apps/api/src/requests/requests.controller.spec.ts

### Implementation for User Story 3

- [ ] T039 [US3] Implement `RequestsService.resolve(id)` with `isValidObjectId` check in apps/api/src/requests/requests.service.ts
- [ ] T040 [US3] Implement `PATCH /requests/:id/resolve` with @ApiOkResponse(MaintenanceRequestDto) and @ApiNotFoundResponse in apps/api/src/requests/requests.controller.ts
- [ ] T041 [US3] Regenerate apps/web/lib/api-types.ts
- [ ] T042 [US3] Build client resolve button (Button from components/ui) that calls PATCH then `router.refresh()`, shows an error on failure, and is not rendered as active for resolved requests in apps/web/components/requests/resolve-button.tsx
- [ ] T043 [US3] Add the resolve button to each open request card in apps/web/app/requests/page.tsx
- [ ] T044 [US3] Verify with Playwright MCP: resolving updates the badge without reload

**Checkpoint**: Quickstart 10–11 pass; all MVP stories work

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T045 [P] Run every quickstart scenario in specs/001-maintenance-requests/quickstart.md
- [ ] T046 [P] Confirm Swagger at /api documents all three operations and their error responses
- [ ] T047 Update docs/ai-log.md and README.md run instructions

---

## Dependencies & Execution Order

- Phase 1 (done) → Phase 2 (Student D) → Phases 3, 4, 5 in parallel (Students A, B, C) → Phase 6.
- US1, US2 and US3 are independent after Phase 2: each adds its own DTO, service method, route and
  UI component. Shared files (`requests.service.ts`, `requests.controller.ts`, their specs,
  `api-types.ts`, `requests/page.tsx`) will need small merge-conflict resolutions; merge in priority
  order (US1 → US2 → US3) and rebase the others.
- US3's button is placed on the US2 list page (T043), so T043 goes after T035 is merged.
- Within a story: tests → DTO → service → controller → regenerate types → UI → Playwright check.

## Parallel Examples

- Phase 2: T008, T013, T014, T015, T016, T017 in parallel after T006–T007.
- US1: T019 and T020 together; then T021 → T022 → T023.
- US2: T028, T029 and T034 together.
- US3: T037 and T038 together.

## Implementation Strategy

1. Merge Phase 2 (issue #2) first.
2. MVP = US1 (report a request); validate with quickstart 1–6 and demo.
3. Add US2, then US3, each through its own feature branch and pull request.

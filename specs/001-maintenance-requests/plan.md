# Implementation Plan: Campus Maintenance Requests

**Branch**: `001-maintenance-requests` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-maintenance-requests/spec.md`

## Summary

Let students and staff report campus maintenance problems, browse and filter them by category,
and mark them resolved. A NestJS + Mongoose REST API (port 3001) owns validation, status control
and persistence in MongoDB, and publishes its contract through Swagger at `/api`. A Next.js App
Router frontend (port 3000) built with shadcn/ui consumes the API through types generated from that
Swagger contract.

## Technical Context

**Language/Version**: TypeScript 6 on Node.js 24 (CI runs Node.js 22)

**Primary Dependencies**: NestJS 12, @nestjs/mongoose + Mongoose 9, @nestjs/config,
class-validator, class-transformer, @nestjs/swagger; Next.js (App Router), React, Tailwind CSS 4,
shadcn/ui; openapi-typescript (run via npx) for shared types

**Storage**: MongoDB, database `maintenance`, one collection for maintenance requests; connection
string only in `apps/api/.env` (`MONGODB_URI`)

**Testing**: Vitest + @nestjs/testing + supertest in `apps/api` (`npm test`); Next.js lint and build
in `apps/web`; end-to-end checks through the Playwright MCP server

**Target Platform**: Local development on Windows/macOS; GitHub Actions (ubuntu-latest) for CI

**Project Type**: Web application (REST API + web frontend)

**Performance Goals**: List and filter respond in under 2 seconds for up to a few hundred requests
(SC-004, SC-005)

**Constraints**: No new packages without approval; no `any`; client cannot set status; CORS limited
to `http://localhost:3000`; unknown input properties rejected

**Scale/Scope**: One entity, four endpoints, three pages; four-person student team

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                   | Gate                                                                                                                        | Status |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------ |
| I. Code Quality             | Typed DTOs and response classes, no `any`, lint in both apps, UI from `components/ui`                                       | PASS   |
| II. Tests for Every Service | Service unit tests for create/list/resolve incl. failure paths; endpoint tests for 400/404; Playwright MCP checks per story | PASS   |
| III. MVC Separation         | `RequestsController` (HTTP + Swagger only) → `RequestsService` (logic + model) → schema; DTOs validate; web calls API only  | PASS   |
| IV. No Secrets in Code      | Only `MONGODB_URI` from env; API base URL is not secret; `.env` ignored and hook-protected                                  | PASS   |
| Scope constraints           | No delete/edit/auth/pagination; out-of-scope list respected                                                                 | PASS   |

Post-design re-check (after Phase 1): PASS, no violations; Complexity Tracking not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-maintenance-requests/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── requests-api.md
├── checklists/
│   └── requirements.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
apps/api/src/
├── main.ts                                  # ValidationPipe, CORS, Swagger, PORT (done)
├── app.module.ts                            # ConfigModule, MongooseModule (done); imports RequestsModule
└── requests/
    ├── requests.module.ts
    ├── requests.controller.ts               # POST /requests, GET /requests, PATCH /requests/:id/resolve
    ├── requests.controller.spec.ts          # endpoint tests (supertest, mocked service)
    ├── requests.service.ts
    ├── requests.service.spec.ts             # unit tests (mocked model)
    ├── request.constants.ts                 # CATEGORIES, STATUSES
    ├── schemas/maintenance-request.schema.ts
    └── dto/
        ├── create-request.dto.ts
        ├── list-requests-query.dto.ts
        └── maintenance-request.dto.ts       # response shape for Swagger/types

apps/web/
├── app/
│   ├── layout.tsx                           # shared layout + nav
│   ├── globals.css                          # design tokens
│   └── requests/
│       ├── page.tsx                         # list + filter (server component, reads searchParams)
│       └── new/page.tsx                     # report form page
├── components/
│   ├── ui/                                  # shadcn/ui (button, card, input, select, badge)
│   └── requests/
│       ├── report-request-form.tsx          # client form
│       ├── category-filter.tsx              # client select that updates ?category=
│       └── resolve-button.tsx               # client button → PATCH, then router.refresh()
└── lib/
    ├── api-types.ts                         # generated by openapi-typescript
    └── api.ts                               # typed fetch helpers + API base URL
```

**Structure Decision**: Web application layout using the existing `apps/api` (NestJS) and
`apps/web` (Next.js) projects. All backend code for the feature lives in one `requests` module so
each student's slice touches predictable files.

## Team Slices

| Slice                   | Student | User story | Main files                                                                                                   |
| ----------------------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| Foundation (goes first) | D       | shared     | `request.constants.ts`, schema, `requests.module.ts`, controller/service shells, `layout.tsx`, `globals.css` |
| Report request          | A       | US1 (P1)   | `create-request.dto.ts`, `POST /requests`, `requests/new`, `report-request-form.tsx`                         |
| List and filter         | B       | US2 (P2)   | `list-requests-query.dto.ts`, `GET /requests`, `requests/page.tsx`, `category-filter.tsx`                    |
| Mark resolved           | C       | US3 (P3)   | `PATCH /requests/:id/resolve`, `resolve-button.tsx`                                                          |

## Complexity Tracking

No constitution violations; nothing to justify.

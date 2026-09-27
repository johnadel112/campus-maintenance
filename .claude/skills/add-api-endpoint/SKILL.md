---
name: add-api-endpoint
description: Use when adding or changing a Campus Maintenance NestJS API endpoint.
---

# Add API Endpoint

1. Read `specs/campus-maintenance.md` and `AGENTS.md`.
2. State route, input, output, validation, and service responsibility.
3. Preserve controller/service/schema/DTO separation.
4. Never modify `.env`.
5. Do not add packages unless necessary.

Contract:

- POST /requests
- GET /requests
- GET /requests?category=<category>
- PATCH /requests/:id/resolve

For API changes: update Swagger, tests, run lint/tests, then refresh `apps/web/lib/api-types.ts`.
Never allow create input to set status.

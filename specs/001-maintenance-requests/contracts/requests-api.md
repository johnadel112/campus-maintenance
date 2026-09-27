# Contract: Requests API

Base URL: `http://localhost:3001`. The live, authoritative contract is the Swagger document at
`/api` (UI) and `/api-json` (OpenAPI JSON); this file describes what it must contain.

Shared shapes:

```text
Category = "equipment" | "electrical" | "plumbing" | "facility" | "other"
Status   = "open" | "resolved"

MaintenanceRequest {
  _id: string
  title: string
  description: string
  location: string
  category: Category
  status: Status
  createdAt: string (ISO date-time)
  updatedAt: string (ISO date-time)
}

ValidationError (NestJS default) {
  statusCode: 400
  message: string[]     # one entry per failed rule, naming the field
  error: "Bad Request"
}

NotFoundError {
  statusCode: 404
  message: string
  error: "Not Found"
}
```

## POST /requests

Create a maintenance request.

Request body (JSON), all required, no other properties allowed:

```json
{
  "title": "Projector broken",
  "description": "No image in C3.201",
  "location": "Building C, room 3.201",
  "category": "equipment"
}
```

| Response                                       | When                                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 201 `MaintenanceRequest` with `status: "open"` | valid body                                                                                       |
| 400 `ValidationError`                          | missing/empty/whitespace-only field, unsupported category, or any extra property (e.g. `status`) |

## GET /requests

List requests, newest first.

Query: `category` (optional, `Category`).

| Response                   | When                                                                              |
| -------------------------- | --------------------------------------------------------------------------------- |
| 200 `MaintenanceRequest[]` | no filter (all requests) or valid category (matching requests only; may be empty) |
| 400 `ValidationError`      | unsupported category value                                                        |

## PATCH /requests/:id/resolve

Mark a request resolved. No request body.

| Response                                           | When                                        |
| -------------------------------------------------- | ------------------------------------------- |
| 200 `MaintenanceRequest` with `status: "resolved"` | request exists (also when already resolved) |
| 404 `NotFoundError`                                | malformed id or no request with that id     |

## Swagger requirements

- Tag `requests`; every operation documents its success and error responses.
- `MaintenanceRequest` and `CreateRequestDto` appear under `components.schemas` with the enums above,
  so `npx openapi-typescript http://localhost:3001/api-json -o apps/web/lib/api-types.ts` produces
  usable types.

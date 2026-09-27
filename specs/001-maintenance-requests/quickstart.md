# Quickstart: Campus Maintenance Requests

Validation guide proving the feature works end to end. See [contracts/requests-api.md](./contracts/requests-api.md)
for exact responses and [data-model.md](./data-model.md) for field rules.

## Prerequisites

- MongoDB running and `apps/api/.env` containing `MONGODB_URI` and `PORT=3001` (never commit it).
- Dependencies installed: `npm install` at the root, in `apps/api`, and in `apps/web`.

## Run

```bash
# terminal 1
cd apps/api
npm run start:dev          # http://localhost:3001, Swagger at /api

# terminal 2
cd apps/web
npm run dev                # http://localhost:3000

# after any API change (API must be running)
npx openapi-typescript http://localhost:3001/api-json -o apps/web/lib/api-types.ts
```

## Automated checks

```bash
cd apps/api && npm test && npm run lint
cd apps/web && npm run lint && npm run build
```

## Scenario checks

| #   | Story | Steps                                                                          | Expected                                                         |
| --- | ----- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1   | US1   | In Swagger, `POST /requests` with a valid body                                 | 201, `status` is `open`                                          |
| 2   | US1   | `POST /requests` without `title`                                               | 400, message names `title`                                       |
| 3   | US1   | `POST /requests` with `category: "roof"`                                       | 400, lists allowed categories                                    |
| 4   | US1   | `POST /requests` with `status: "resolved"`                                     | 400, `property status should not exist`                          |
| 5   | US1   | Open `/requests/new`, submit empty form                                        | Field errors shown, nothing created                              |
| 6   | US1   | Submit a valid form                                                            | Redirect to `/requests`, new request at the top, badge "open"    |
| 7   | US2   | Open `/requests` with requests in several categories                           | Title, location, category, status on every card                  |
| 8   | US2   | Choose "electrical" in the filter                                              | URL has `?category=electrical`, only electrical requests shown   |
| 9   | US2   | `GET /requests?category=roof`                                                  | 400                                                              |
| 10  | US3   | Click "Mark resolved" on an open request                                       | Badge becomes "resolved" without reload; button no longer active |
| 11  | US3   | `PATCH /requests/000000000000000000000000/resolve` and `.../not-an-id/resolve` | 404 both                                                         |

Playwright MCP prompt for scenarios 5–6 (worksheet 10.8):

```text
use playwright: open http://localhost:3000/requests/new, submit the empty form, and confirm error
messages appear. Then submit a valid request and confirm it is created.
```

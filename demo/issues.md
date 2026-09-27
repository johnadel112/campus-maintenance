# Ready-to-Paste GitHub Issues

## Issue 1 — Shared request foundation

**Owner:** Student D

- [ ] Create MaintenanceRequest schema.
- [ ] Fields: title, description, location, category, status.
- [ ] Timestamps enabled.
- [ ] Category enum: equipment/electrical/plumbing/facility/other.
- [ ] Status enum: open/resolved; default open.
- [ ] Create Requests module shell and register model.
- [ ] Establish shared Next.js layout and design tokens.
- [ ] Tests/lint pass.

## Issue 2 — Report a maintenance request

**Owner:** Student A

- [ ] Validated create DTO.
- [ ] Require title, description, location, category.
- [ ] Reject unsupported category.
- [ ] Client cannot set status.
- [ ] Implement POST /requests through controller + service.
- [ ] Swagger + tests.
- [ ] Create /requests/new using components/ui.
- [ ] Show form errors and use generated API types.
- [ ] Missing title and invalid category return 400.
- [ ] Valid create gets backend status open.

## Issue 3 — List and filter requests

**Owner:** Student B

- [ ] Implement GET /requests.
- [ ] Optional validated ?category= filter.
- [ ] Service owns database logic.
- [ ] Swagger + tests.
- [ ] Create /requests page.
- [ ] Display title, location, category, status.
- [ ] Category filter using components/ui.
- [ ] Playwright verifies visible list changes after filtering.

## Issue 4 — Mark request resolved

**Owner:** Student C

- [ ] Implement PATCH /requests/:id/resolve.
- [ ] Service changes status to resolved.
- [ ] Handle missing request.
- [ ] Swagger + tests.
- [ ] Add resolve button for open requests.
- [ ] Update UI after success.
- [ ] No active resolve action for already resolved requests.

# Feature Specification: Campus Maintenance Requests

**Feature Branch**: `001-maintenance-requests`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "Problem, Users, MVP features and Out of scope from specs/campus-maintenance.md: Students and staff need a simple way to report maintenance problems around campus and see whether reported problems are open or resolved. Reporters report problems; campus community members browse and filter them; no authentication. MVP: report a request (title, description, location, category; status controlled by the system and starting as open), browse requests, filter by category, mark a request as resolved. Out of scope: authentication/authorization, user profiles, image/file uploads, notifications, technician assignment, priority/escalation, comments/chat, analytics dashboards, real-time updates, deleting requests, editing requests after creation."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Report a maintenance problem (Priority: P1)

A student or staff member notices a problem on campus (for example, a broken projector or a
leaking tap) and submits a maintenance request describing what is wrong, where it is, and what
kind of problem it is.

**Why this priority**: Without reported requests nothing else in the system has any value; this
is the entry point for all data.

**Independent Test**: Submit a request through the report form and confirm it is saved with status
"open" and appears when requests are retrieved.

**Acceptance Scenarios**:

1. **Given** the report form, **When** the reporter enters a title, description, location and a
   supported category and submits, **Then** the request is saved with status "open" and a creation
   time, and the reporter sees a confirmation.
2. **Given** the report form, **When** the reporter submits without a title (or without a
   description, location or category), **Then** the request is rejected and the form shows which
   field is missing.
3. **Given** a submission with a category that is not one of the supported categories, **When** it
   is submitted, **Then** it is rejected with an explanation of the allowed categories.
4. **Given** a submission that tries to set the status (for example to "resolved") or includes
   unknown fields, **When** it is submitted, **Then** it is rejected and no request is created.

---

### User Story 2 - Browse and filter reported requests (Priority: P2)

A member of the campus community opens the list of maintenance requests to see what has been
reported and whether each problem is still open, and narrows the list to one category.

**Why this priority**: Visibility of reported problems avoids duplicate reports and shows progress;
it depends on requests existing (Story 1) but can be tested with seeded data.

**Independent Test**: With several requests of different categories stored, open the list, confirm
every request shows title, location, category and status, then choose a category and confirm only
matching requests remain.

**Acceptance Scenarios**:

1. **Given** stored requests, **When** a user opens the requests list, **Then** every request is
   shown with its title, location, category and status.
2. **Given** requests in several categories, **When** the user filters by "electrical", **Then**
   only electrical requests are shown.
3. **Given** a category filter is active, **When** the user clears it, **Then** all requests are
   shown again.
4. **Given** no requests exist (or none match the filter), **When** the list is shown, **Then** the
   user sees a clear empty-state message instead of a blank page.

---

### User Story 3 - Mark a request as resolved (Priority: P3)

Once a maintenance problem has been fixed, a user marks the corresponding request as resolved so
that everyone can see it no longer needs attention.

**Why this priority**: Closing the loop completes the MVP, but the system is already useful for
reporting and browsing without it.

**Independent Test**: With an open request stored, trigger "mark resolved" and confirm its status
becomes "resolved" in the list, and that the action is no longer offered for it.

**Acceptance Scenarios**:

1. **Given** an open request, **When** a user marks it resolved, **Then** its status changes to
   "resolved" and the list updates without a manual refresh.
2. **Given** a request that is already resolved, **When** it is shown in the list, **Then** no
   active "mark resolved" action is offered for it.
3. **Given** a request identifier that does not exist, **When** a resolve is attempted, **Then**
   the user is told the request was not found and no data changes.

---

### Edge Cases

- Title, description or location containing only spaces is treated as missing.
- A category filter value that is not a supported category is rejected with an explanation rather
  than silently returning an empty list.
- A resolve attempt with a malformed request identifier is reported as "not found".
- Resolving a request that is already resolved leaves it resolved and does not produce an error.
- Two users resolving the same request at the same time both end with the request resolved.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Users MUST be able to report a maintenance request with a title, description,
  location and category, all required and non-empty.
- **FR-002**: The system MUST accept only these categories: equipment, electrical, plumbing,
  facility, other.
- **FR-003**: The system MUST set the status of every new request to "open"; reporters MUST NOT be
  able to choose or influence the initial status.
- **FR-004**: The system MUST reject submissions containing fields other than title, description,
  location and category.
- **FR-005**: The system MUST record when each request was created and last updated.
- **FR-006**: Users MUST be able to view all requests, each showing title, location, category and
  status.
- **FR-007**: Users MUST be able to filter the list by a single category; without a filter all
  requests are returned.
- **FR-008**: Users MUST be able to mark an open request as resolved; the status change MUST be
  performed by the system, not supplied by the user.
- **FR-009**: The system MUST report "not found" when resolving a request that does not exist.
- **FR-010**: Validation failures MUST be reported to the user with a message identifying the
  problem field.
- **FR-011**: The system MUST NOT provide deletion or editing of requests after creation.

### Key Entities

- **Maintenance Request**: a reported campus problem. Attributes: title, description, location,
  category (one of the five supported values), status (open or resolved; starts open), created
  time, last updated time. No link to a user account.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A reporter can submit a complete maintenance request in under 1 minute.
- **SC-002**: 100% of submissions missing a required field or using an unsupported category are
  rejected with a field-specific message.
- **SC-003**: 0 requests are ever created with a status other than "open".
- **SC-004**: After choosing a category filter, users see only matching requests within 2 seconds.
- **SC-005**: After marking a request resolved, the new status is visible in the list within 2
  seconds without reloading the page.

## Assumptions

- No sign-in is required; anyone with access to the application can report, browse and resolve
  requests (authentication is explicitly out of scope).
- The list shows the most recently reported requests first.
- The expected volume is small (hundreds of requests), so pagination is not needed for the MVP.
- Resolving is one-way: there is no action to reopen a resolved request.
- Out of scope and not built: authentication/authorization, user profiles, image/file uploads,
  notifications, technician assignment, priority/escalation, comments/chat, analytics dashboards,
  real-time updates, deleting requests, editing requests after creation.

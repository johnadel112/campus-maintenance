# Campus Maintenance Demo Kit

Supporting kit for the Campus Maintenance Request System assignment.

Stack: NestJS + Mongoose, Next.js App Router + shadcn/ui, MongoDB Atlas, Swagger/OpenAPI.

MVP:

1. Report a maintenance request.
2. Browse requests.
3. Filter by category.
4. Mark a request as resolved.

Read `specs/campus-maintenance.md` before coding.

Team slices:

- Student D — MaintenanceRequest schema + module shell, layout, design tokens (goes first).
- Student A — POST /requests + /requests/new.
- Student B — GET /requests?category= + /requests.
- Student C — PATCH /requests/:id/resolve + resolve button.

Never commit `.env` or secrets.

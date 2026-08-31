# Project guidance

## Product

Build the Thai-language Teacher Internship System described in `docs/requirements-v1.md`. Use the database model and authorization boundaries in `docs/database-design-v1.md`.

## Engineering rules

- Use Next.js App Router, TypeScript, Tailwind CSS, and Supabase SSR.
- Keep server-only secrets out of client components and source control.
- Use Supabase Row Level Security for authorization; hiding UI controls is not authorization.
- Validate all mutations on the server and return user-friendly Thai error messages.
- Prefer Server Components. Add Client Components only where browser interaction requires them.
- Keep pages responsive and accessible, with visible labels and keyboard-friendly controls.
- Add or update tests for important authorization and validation behavior.

## Completion checks

- Run linting.
- Run TypeScript checking.
- Run tests.
- Run a production build.
- Report any check that could not run and why.

## Code review rules

- Flag any path that lets a user read or mutate another role's protected data.
- Flag any exposure of service-role keys, credentials, or secrets to browser code.
- Flag database mutations that rely only on client-side validation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

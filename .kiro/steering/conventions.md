# Coding Conventions

## TypeScript

- Strict mode enabled in all `tsconfig.json` files.
- No `any` types. Use `unknown` and narrow, or define proper interfaces.
- Prefer `interface` for object shapes, `type` for unions and aliases.
- Export types from `src/types/index.ts` in each package.
- All async functions must handle errors with try/catch or propagate typed errors.

## React / Frontend

- Functional components only. No class components.
- Each page lives in `src/pages/` as `PageName.tsx`.
- Shared UI primitives live in `src/components/common/`.
- Domain-specific components live in their feature subdirectory.
- State that spans multiple components goes in Zustand. Local UI state uses `useState`.
- API calls are wrapped in `src/api/` modules – never call Axios directly in components.
- Use React Router `<Link>` for internal navigation. Never use `window.location`.
- All images and SVGs live in `public/assets/` or are inline SVG components.

## Tailwind CSS

- Use Tailwind utility classes. Avoid writing custom CSS except for animations.
- Halloween color tokens are defined in `tailwind.config.ts` under `theme.extend.colors`.
- Use `dark:` variants if supporting dark/light toggle (default: dark/spooky).
- Animation classes (float, flicker, pulse-glow) are defined in `tailwind.config.ts`.

## Express / Backend

- Controllers are thin – they validate input, call a service, and return a response.
- Services contain all business logic and are unit-testable in isolation.
- All routes are defined in `src/routes/` and mounted in `src/index.ts`.
- Use `express-async-errors` or explicit try/catch in every async route handler.
- The global error handler middleware returns `{ error: string, code: string }`.
- HTTP status codes: 200 success, 201 created, 400 bad request, 401 unauth, 403 forbidden, 404 not found, 409 conflict, 500 server error.

## MongoDB / Mongoose

- Schema files live in `src/models/`.
- Use Mongoose virtuals for computed fields (e.g., `level` from `xp`).
- All queries use lean() where the result is read-only.
- Sensitive fields (accessToken) are excluded from default `.select()`.
- Use indexed fields for all query patterns (`githubId`, `teamId`, `repoId`).

## Environment Variables

- Backend: `server/.env` (gitignored), documented in `server/.env.example`.
- Frontend: `client/.env` (gitignored), documented in `client/.env.example`.
- All `VITE_` prefixed vars are public and must never contain secrets.
- Backend vars for secrets: `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`, `OPENAI_API_KEY`, `MONGODB_URI`.

## Error Handling

- Never swallow errors silently.
- Log errors with context using the structured logger in `server/src/utils/logger.ts`.
- Frontend shows user-friendly toast notifications for API errors.
- Webhook processing failures are logged and the event marked for retry.

## Git Conventions

- Branch naming: `feat/`, `fix/`, `chore/`, `docs/`.
- Commit messages: imperative mood, `feat: add quest progress endpoint`.
- Never commit `.env` files or secrets.

## Halloween Theme Rules

- Every new page must use the dark background (`bg-halloween-dark`).
- All primary actions use the orange/amber accent (`text-halloween-orange`).
- Spooky decorative elements are opt-in via `<SpookyBackground />` wrapper.
- Achievement badges must use the Halloween badge system in `components/gamification/`.

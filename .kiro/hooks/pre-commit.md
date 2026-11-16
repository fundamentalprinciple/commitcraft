# Hook: pre-commit

**Trigger:** Before every git commit.

**Purpose:** Catch type errors, lint violations, and formatting issues before they enter the repository.

## Steps

1. Run `npm run type-check` in both `client/` and `server/`.
2. Run `npm run lint` in both `client/` and `server/`.
3. If either check fails, abort the commit and display the errors.

## Setup

Install husky and lint-staged from the root:

```bash
npm install -D husky lint-staged
npx husky init
```

Root `package.json` lint-staged config:
```json
{
  "lint-staged": {
    "client/src/**/*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "server/src/**/*.ts": ["eslint --fix", "prettier --write"]
  }
}
```

`.husky/pre-commit`:
```bash
#!/bin/sh
cd client && npm run type-check && cd ../server && npm run type-check
npx lint-staged
```

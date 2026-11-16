# CommitCraft – Project Steering

## Identity

CommitCraft is a Halloween-themed GitHub gamification platform. It transforms real developer activity (commits, pull requests, reviews, issues) into in-game rewards: XP, coins, achievements, quests, and a 2D haunted island that grows with the team's progress.

**Tagline:** "Turn every commit into progress. Build your team's kingdom, one push at a time."

## Repository Layout

```
commitcraft/
├── client/          # React + TypeScript frontend
├── server/          # Express + TypeScript backend
├── .kiro/           # Kiro specs, steering, hooks
├── .env.example     # Root-level env template
└── README.md
```

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, React Router v6, Zustand, Axios |
| Backend | Node.js, Express.js, TypeScript, MongoDB + Mongoose |
| Auth | GitHub OAuth 2.0 (Passport.js) |
| Real-time | Socket.IO |
| AI | OpenAI-compatible LLM API (quest generation) |
| Dev tools | Vite (frontend), ts-node-dev (backend), ESLint, Prettier |

## Non-Negotiables

- Never commit secrets. All API keys and secrets go in `.env` files; `.env.example` documents the shape.
- No hardcoded mock data in production code paths.
- All endpoints validate inputs and return structured error responses.
- Webhook events must be signature-verified and idempotent (no duplicate processing).
- Frontend and backend are completely separated – communicate only via HTTP REST + Socket.IO.

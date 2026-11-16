# CommitCraft – Implementation Tasks

## Phase 1 – Foundation

- [ ] P1-1: Initialize `server/` with `package.json`, TypeScript, ESLint, Prettier
- [ ] P1-2: Initialize `client/` with Vite + React + TypeScript template
- [ ] P1-3: Configure Tailwind CSS with Halloween color tokens and custom animations
- [ ] P1-4: Set up MongoDB connection with Mongoose in `server/src/config/db.ts`
- [ ] P1-5: Create all Mongoose models (User, Team, Repository, GithubEvent, Quest, UserQuest, Island, Achievement, RewardHistory, Notification)
- [ ] P1-6: Build base Express app with middleware (cors, helmet, rate-limit, session, error handler)
- [ ] P1-7: Create `PageWrapper`, `Navbar`, `Sidebar` layout components
- [ ] P1-8: Create Halloween UI primitives: Button, Card, Badge, XPBar, CoinDisplay
- [ ] P1-9: Create `SpookyBackground` with particle system
- [ ] P1-10: Create `server/.env.example` and `client/.env.example`

## Phase 2 – Authentication

- [ ] P2-1: Configure Passport.js with GitHub OAuth strategy
- [ ] P2-2: Implement `/api/auth/github`, `/api/auth/github/callback`, `/api/auth/logout`, `/api/auth/me`
- [ ] P2-3: Build `authMiddleware` to protect routes
- [ ] P2-4: Build Login page with GitHub OAuth button
- [ ] P2-5: Build authStore (Zustand) with `fetchMe`, `logout`
- [ ] P2-6: Implement protected route wrapper in React Router
- [ ] P2-7: Build User profile page (avatar, stats, achievements list)

## Phase 3 – GitHub Integration

- [ ] P3-1: Implement `GET /api/repos/available` – list user's GitHub repos via API
- [ ] P3-2: Implement `POST /api/repos/connect` – register webhook on GitHub, store Repository
- [ ] P3-3: Implement `DELETE /api/repos/:id` – delete webhook, deactivate Repository
- [ ] P3-4: Implement `POST /api/events/webhook/:repoId` with signature verification
- [ ] P3-5: Build EventProcessor service routing events to GamificationService
- [ ] P3-6: Build Settings page with repo connect/disconnect UI

## Phase 4 – Gamification

- [ ] P4-1: Build GamificationService with `grantReward(userId, eventType)`
- [ ] P4-2: Implement XP/level calculation utilities
- [ ] P4-3: Implement streak tracking logic
- [ ] P4-4: Build QuestService: seed daily/weekly quests, update progress, complete quests
- [ ] P4-5: Build AchievementService: define all achievements, check after rewards
- [ ] P4-6: Build gamification API endpoints (stats, reward history, quests, achievements)
- [ ] P4-7: Build Dashboard page (XP bar, coins, streak, recent activity, active quests)
- [ ] P4-8: Build Quests page (active / completed / available tabs)
- [ ] P4-9: Build Achievements page (badge grid, locked/unlocked states)

## Phase 5 – Island Building

- [ ] P5-1: Create Island model and initialize island on team creation
- [ ] P5-2: Build IslandService: `getIsland`, `purchaseBuilding`, `upgradeBuilding`
- [ ] P5-3: Build island API endpoints
- [ ] P5-4: Create SVG building components for all 9 building types
- [ ] P5-5: Build `IslandCanvas` component with absolute-positioned buildings
- [ ] P5-6: Build `BuildingShop` sidebar with unlock requirements and purchase flow
- [ ] P5-7: Build Haunted Island page

## Phase 6 – AI and Collaboration

- [ ] P6-1: Build AIService with OpenAI-compatible LLM integration and fallback quests
- [ ] P6-2: Implement AI quest generation endpoint with JSON validation
- [ ] P6-3: Configure Socket.IO server with room strategy
- [ ] P6-4: Emit real-time events on reward grant, quest complete, achievement unlock
- [ ] P6-5: Build Socket.IO client hook (`useSocket`) in React
- [ ] P6-6: Build toast notification system in frontend
- [ ] P6-7: Build Teams page (create, invite, join, member list)
- [ ] P6-8: Build Leaderboard page (individual + team tabs, period selector)

## Phase 7 – Polish

- [ ] P7-1: Audit all pages for mobile responsiveness (375px minimum)
- [ ] P7-2: Add loading skeletons to all data-fetching components
- [ ] P7-3: Add global error boundary in React
- [ ] P7-4: Audit and tighten all Zod validation schemas
- [ ] P7-5: Add Helmet.js security headers and CORS configuration review
- [ ] P7-6: Add development seed script (`server/src/scripts/seed.ts`)
- [ ] P7-7: Write `README.md` with setup, development, and deployment instructions
- [ ] P7-8: Review all console.log statements; replace with structured logger
- [ ] P7-9: Create production build scripts and document deployment steps
- [ ] P7-10: Final visual QA pass – verify Halloween theme consistency across all pages

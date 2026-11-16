# CommitCraft – Requirements Specification

## Functional Requirements

### FR-1: Authentication

| ID | Requirement |
|---|---|
| FR-1.1 | Users sign in exclusively via GitHub OAuth 2.0. |
| FR-1.2 | On first login, a User document is created with GitHub profile data. |
| FR-1.3 | Sessions are managed server-side (express-session + MongoDB store). |
| FR-1.4 | Users can log out and have their session destroyed. |
| FR-1.5 | Protected routes redirect unauthenticated users to the login page. |

### FR-2: Repository Management

| ID | Requirement |
|---|---|
| FR-2.1 | Authenticated users can list their GitHub repositories via GitHub API. |
| FR-2.2 | Users can connect a repository, which registers a GitHub webhook on that repo. |
| FR-2.3 | Each connected repository gets a unique webhook secret for signature verification. |
| FR-2.4 | Users can disconnect a repository, which deletes the webhook from GitHub. |
| FR-2.5 | The dashboard displays all connected repositories and their last sync time. |

### FR-3: GitHub Webhook Processing

| ID | Requirement |
|---|---|
| FR-3.1 | The backend exposes `POST /api/events/webhook/:repoId` to receive GitHub events. |
| FR-3.2 | Every webhook payload is verified using `x-hub-signature-256` before processing. |
| FR-3.3 | Events are stored in GithubEvent collection with `githubDeliveryId` as idempotency key. |
| FR-3.4 | Supported event types: `push`, `pull_request`, `pull_request_review`, `issues`, `release`. |
| FR-3.5 | Processed events trigger the gamification engine for the relevant user. |

### FR-4: Gamification Engine

| ID | Requirement |
|---|---|
| FR-4.1 | Each supported GitHub event awards a configurable amount of XP and coins. |
| FR-4.2 | XP determines the user's level using a progressive thresholds table. |
| FR-4.3 | Coins are a spendable currency used to purchase island buildings. |
| FR-4.4 | Consecutive daily activity increments the user's streak counter. |
| FR-4.5 | Breaking a streak (no activity for >24 h) resets the streak to 0. |
| FR-4.6 | All reward grants are recorded in a RewardHistory collection. |
| FR-4.7 | Reward amounts are configurable via environment variables. |

### FR-5: Quest System

| ID | Requirement |
|---|---|
| FR-5.1 | Quests have types: `daily`, `weekly`, `milestone`, `ai_generated`. |
| FR-5.2 | Daily quests reset at midnight UTC; weekly quests reset on Monday. |
| FR-5.3 | Quest progress is updated automatically when GitHub events are processed. |
| FR-5.4 | Completing a quest awards XP and coins; unclaimed rewards persist until claimed. |
| FR-5.5 | Users can view active, completed, and available quests. |

### FR-6: AI Quest Generation

| ID | Requirement |
|---|---|
| FR-6.1 | The system generates AI quests by sending repository context to an LLM. |
| FR-6.2 | AI responses are validated against a JSON schema before storing. |
| FR-6.3 | If the AI service is unavailable, fallback quests from a static pool are used. |
| FR-6.4 | AI quests are generated at most once per 24 hours per repository. |

### FR-7: Achievements

| ID | Requirement |
|---|---|
| FR-7.1 | Achievements are checked after every reward grant event. |
| FR-7.2 | Each achievement has a unique slug and is awarded at most once per user. |
| FR-7.3 | Unlocking an achievement emits a Socket.IO event to the user. |
| FR-7.4 | Achievements are displayed on the user profile page. |

### FR-8: Island Building

| ID | Requirement |
|---|---|
| FR-8.1 | Each team has exactly one Island document. |
| FR-8.2 | The island is rendered as a 2D layout using positioned HTML/SVG elements. |
| FR-8.3 | Buildings have purchase costs in coins and XP-based unlock requirements. |
| FR-8.4 | Purchasing a building deducts coins from the team's balance. |
| FR-8.5 | Buildings can be upgraded up to level 3, each upgrade costing more coins. |
| FR-8.6 | Building positions are stored and restored on page load. |

### FR-9: Team Management

| ID | Requirement |
|---|---|
| FR-9.1 | A user can create a team, becoming its owner. |
| FR-9.2 | The team owner can generate an invite code (UUID). |
| FR-9.3 | Any authenticated user can join a team using a valid invite code. |
| FR-9.4 | Team owners can remove members. |
| FR-9.5 | Repositories can be associated with a team. |
| FR-9.6 | Team XP is the sum of all member XP. |

### FR-10: Leaderboards

| ID | Requirement |
|---|---|
| FR-10.1 | Individual leaderboard ranks users by XP for weekly, monthly, all-time periods. |
| FR-10.2 | Team leaderboard ranks teams by total XP. |
| FR-10.3 | The current user's rank is highlighted. |

### FR-11: Real-Time Notifications

| ID | Requirement |
|---|---|
| FR-11.1 | On login, the frontend establishes a Socket.IO connection authenticated with the session. |
| FR-11.2 | The server emits events to the user's socket room when rewards, quests, or achievements trigger. |
| FR-11.3 | The frontend displays toast notifications for each real-time event. |
| FR-11.4 | Notification history is stored and accessible from the UI. |

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 | API response time < 500 ms for read endpoints under normal load. |
| NFR-2 | Webhook endpoint responds with HTTP 200 within 1 second (async processing). |
| NFR-3 | Frontend Lighthouse performance score ≥ 80 on desktop. |
| NFR-4 | All user inputs are validated and sanitized on the server. |
| NFR-5 | GitHub access tokens are never exposed in API responses or logs. |
| NFR-6 | The app is fully responsive down to 375px viewport width. |

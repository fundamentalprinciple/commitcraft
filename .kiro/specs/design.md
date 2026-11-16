# CommitCraft – Technical Design

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                      Browser                        │
│  React + TypeScript + Tailwind                      │
│  Zustand state │ Axios HTTP │ Socket.IO client      │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP + WebSocket
┌──────────────────────▼──────────────────────────────┐
│                  Express API Server                 │
│  REST routes │ Passport (GitHub OAuth)              │
│  Socket.IO server │ Webhook receiver                │
└───────┬──────────────────────┬──────────────────────┘
        │ Mongoose             │ GitHub REST API
┌───────▼──────┐    ┌──────────▼──────────┐
│   MongoDB    │    │   GitHub API /      │
│   Atlas /    │    │   Webhook Events    │
│   local      │    └─────────────────────┘
└──────────────┘
        │
┌───────▼──────────┐
│  OpenAI-compat   │
│  LLM API         │
└──────────────────┘
```

## Authentication Flow

```
1. User clicks "Sign in with GitHub"
2. Browser → GET /api/auth/github  (Passport redirects to GitHub)
3. GitHub → GET /api/auth/github/callback?code=xxx
4. Passport exchanges code for access_token
5. Passport upserts User in MongoDB
6. Session cookie set (httpOnly, sameSite: lax)
7. Redirect to /dashboard
8. Frontend GET /api/auth/me → returns current user
9. Zustand authStore hydrated
```

## Webhook Processing Flow

```
1. GitHub sends POST /api/events/webhook/:repoId
2. Middleware verifies x-hub-signature-256 against repo.webhookSecret
3. x-github-delivery checked against GithubEvent.githubDeliveryId (idempotency)
4. Event persisted to DB with processed: false
5. EventProcessor.process(event) called (async, non-blocking response)
6. Actor GitHub user matched to CommitCraft User by githubId
7. GamificationService.grantReward(userId, eventType) called
8. RewardHistory entry created
9. QuestService.updateProgress(userId, eventType) called
10. AchievementService.checkAchievements(userId) called
11. Socket.IO emit to user room
12. Event marked processed: true
```

## Gamification: XP & Level Formula

```ts
// Progressive XP thresholds
function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Level from total XP
function levelFromXp(totalXp: number): number {
  let level = 1;
  let accumulated = 0;
  while (accumulated + xpForLevel(level) <= totalXp) {
    accumulated += xpForLevel(level);
    level++;
  }
  return level;
}
```

## AI Quest Generation Prompt Template

```
You are a quest designer for CommitCraft, a developer gamification platform.

Repository context:
- Repository: {repoName}
- Recent activity: {activitySummary}
- Team size: {teamSize}
- Current team level: {teamLevel}

Generate 3 quests as a JSON array. Each quest must follow this schema:
{
  "title": string,          // Max 50 chars
  "description": string,    // Max 150 chars
  "targetType": "commits" | "prs" | "reviews" | "issues" | "streak",
  "targetCount": number,    // 1-20
  "xpReward": number,       // 50-500
  "coinReward": number,     // 10-200
  "type": "ai_generated"
}

Return only the JSON array. No explanations.
```

## Socket.IO Room Strategy

- Each authenticated user joins room `user:{userId}`.
- Each team member joins room `team:{teamId}`.
- User-specific events emit to `user:{userId}`.
- Team-wide events (island upgrades, team milestones) emit to `team:{teamId}`.

## Frontend State (Zustand Slices)

```ts
// authStore
{ user: User | null, isLoading: boolean, login(), logout(), fetchMe() }

// gamificationStore
{ xp, coins, level, streak, recentRewards[], fetchStats() }

// questStore
{ active: UserQuest[], completed: UserQuest[], available: Quest[], fetchAll(), claimReward(id) }

// islandStore
{ island: Island | null, buildings: Building[], purchase(type), upgrade(id), fetchIsland() }

// notificationStore
{ notifications: Notification[], unreadCount, markRead(id), addNotification(n) }
```

## API Response Envelope

All API responses follow:

```ts
// Success
{ data: T, message?: string }

// Error
{ error: string, code: string, details?: Record<string, string> }
```

## Security Measures

- CSRF: `sameSite: 'lax'` session cookies + origin validation on webhooks.
- Rate limiting: `express-rate-limit` on auth routes (10 req/min) and webhook endpoint (100 req/min per IP).
- Helmet.js for HTTP security headers.
- GitHub access tokens stored encrypted (AES-256) in MongoDB.
- Webhook secrets are 32-byte random hex strings, one per repository.
- Input validation using `zod` on all POST/PUT endpoints.
- MongoDB queries use parameterized Mongoose methods (no string interpolation).

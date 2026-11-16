# Architecture Steering

## Directory Structure

### client/
```
client/
├── public/
│   └── assets/            # Static images, SVGs, spritesheets
├── src/
│   ├── api/               # Axios instances and typed API calls
│   ├── components/
│   │   ├── common/        # Button, Card, Modal, Badge, etc.
│   │   ├── layout/        # Navbar, Sidebar, PageWrapper
│   │   ├── island/        # IslandCanvas, Building, Decoration
│   │   ├── gamification/  # XPBar, CoinDisplay, QuestCard, AchievementBadge
│   │   └── halloween/     # Particles, SpookyBackground, GlowEffect
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # One file per route
│   ├── store/             # Zustand slices (auth, user, island, quests, notifications)
│   ├── types/             # Shared TypeScript interfaces
│   ├── utils/             # Formatters, constants, helpers
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

### server/
```
server/
├── src/
│   ├── config/            # DB connection, passport, socket setup
│   ├── controllers/       # Route handlers (thin, delegate to services)
│   ├── middleware/         # auth guard, error handler, webhook validator
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── services/          # Business logic
│   │   ├── gamification/  # XP, coins, level calculation
│   │   ├── github/        # Webhook processing, API calls
│   │   ├── quest/         # Quest generation, progress tracking
│   │   └── ai/            # LLM integration
│   ├── types/             # Shared server types
│   ├── utils/             # Helpers, logger
│   └── index.ts           # Entry point
├── .env.example
└── tsconfig.json
```

## Data Models

### User
```ts
{
  githubId: string
  username: string
  displayName: string
  avatarUrl: string
  email?: string
  accessToken: string   // encrypted at rest
  xp: number
  level: number
  coins: number
  streakDays: number
  lastActivityDate: Date
  achievements: ObjectId[]
  connectedRepos: ObjectId[]
  teamId?: ObjectId
  createdAt: Date
}
```

### Team
```ts
{
  name: string
  slug: string
  ownerId: ObjectId
  members: ObjectId[]
  islandId: ObjectId
  totalXp: number
  level: number
  coins: number
  inviteCode: string
  repositories: ObjectId[]
  createdAt: Date
}
```

### Repository
```ts
{
  githubRepoId: number
  fullName: string           // "owner/repo"
  ownerId: ObjectId          // User who connected it
  teamId?: ObjectId
  webhookId?: number
  webhookSecret: string
  isActive: boolean
  lastSyncedAt: Date
}
```

### GithubEvent
```ts
{
  repoId: ObjectId
  userId: ObjectId
  githubDeliveryId: string   // idempotency key
  eventType: EventType       // enum
  payload: Record<string, any>
  processed: boolean
  rewardGranted: boolean
  createdAt: Date
}
```

### Quest
```ts
{
  title: string
  description: string
  type: 'daily' | 'weekly' | 'milestone' | 'ai_generated'
  targetType: QuestTarget    // 'commits' | 'prs' | 'reviews' | 'issues' | 'streak'
  targetCount: number
  xpReward: number
  coinReward: number
  expiresAt?: Date
  aiGenerated: boolean
  repoContext?: string
}
```

### UserQuest
```ts
{
  userId: ObjectId
  questId: ObjectId
  progress: number
  completed: boolean
  completedAt?: Date
  claimedAt?: Date
}
```

### Island
```ts
{
  teamId: ObjectId
  buildings: Building[]
  decorations: Decoration[]
  theme: string
  level: number
  lastUpdatedAt: Date
}
```

### Building (embedded in Island)
```ts
{
  buildingType: BuildingType
  level: number
  position: { x: number; y: number }
  purchasedAt: Date
  unlockedBy: string    // achievement or XP threshold
}
```

## API Route Namespacing

```
/api/auth          GitHub OAuth + session
/api/users         Profile, stats, activity
/api/repos         Connect, disconnect, sync
/api/events        Webhook receiver
/api/gamification  XP, coins, rewards
/api/quests        CRUD + progress + AI generation
/api/achievements  List + claim
/api/teams         Create, invite, join, manage
/api/island        View + purchase + upgrade
/api/leaderboard   Rankings
/api/notifications Notification history
```

## Reward Constants (configurable via env)

| Event | XP | Coins |
|---|---|---|
| commit | 10 | 5 |
| pull_request.opened | 20 | 0 |
| pull_request.merged | 50 | 25 |
| issues.closed | 15 | 10 |
| pull_request_review | 25 | 0 |
| release | 100 | 50 |

## Socket.IO Events

| Server → Client | Payload |
|---|---|
| `reward:earned` | `{ xp, coins, reason }` |
| `quest:completed` | `{ quest, rewards }` |
| `achievement:unlocked` | `{ achievement }` |
| `island:updated` | `{ building, action }` |
| `team:activity` | `{ user, event }` |
| `invitation:received` | `{ team, inviter }` |

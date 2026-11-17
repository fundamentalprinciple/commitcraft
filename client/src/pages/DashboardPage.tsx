import React, { useEffect } from 'react';
import { Zap, GitBranch, GitMerge, GitPullRequest, Star, Eye } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import XPBar from '../components/gamification/XPBar';
import CoinDisplay from '../components/gamification/CoinDisplay';
import { useAuthStore } from '../store/authStore';
import { useGamificationStore } from '../store/gamificationStore';
import { formatEventType, eventTypeColor, formatRelativeTime } from '../utils/format';
import { FlameIcon } from '../components/halloween/icons';

const EVENT_ICONS: Record<string, React.ReactNode> = {
  push: <GitBranch size={14} />,
  'pull_request.merged': <GitMerge size={14} />,
  'pull_request.opened': <GitPullRequest size={14} />,
  pull_request_review: <Eye size={14} />,
  'issues.closed': <Star size={14} />,
  release: <Zap size={14} />,
};

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { stats, quests, history, fetchStats, fetchQuests, fetchHistory } = useGamificationStore();

  useEffect(() => {
    fetchStats();
    fetchQuests();
    fetchHistory();
  }, [fetchStats, fetchQuests, fetchHistory]);

  const activeQuests = quests.filter((q) => !q.completed).slice(0, 3);
  const recentHistory = history.slice(0, 8);

  if (!user) return null;

  return (
    <PageWrapper
      title={`Welcome back, ${user.displayName.split(' ')[0]} 👻`}
      subtitle="Your haunted progress overview"
    >
      {/* Top stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Level + XP */}
        <Card className="col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-halloween-ghost-muted text-xs mb-0.5">Current Level</p>
              <p className="font-cinzel text-3xl font-black text-halloween-orange">
                {stats?.level ?? user.level}
              </p>
            </div>
            <div className="text-right">
              <p className="text-halloween-ghost-muted text-xs mb-0.5">Total XP</p>
              <p className="font-cinzel text-2xl font-bold text-halloween-ghost">
                {(stats?.xp ?? user.xp).toLocaleString()}
              </p>
            </div>
          </div>
          <XPBar xp={stats?.xp ?? user.xp} level={stats?.level ?? user.level} />
        </Card>

        {/* Coins */}
        <Card className="flex flex-col items-center justify-center py-5">
          <CoinDisplay coins={stats?.coins ?? user.coins} size="lg" />
          <p className="text-halloween-ghost-muted text-xs mt-2">Coins</p>
        </Card>

        {/* Streak */}
        <Card className="flex flex-col items-center justify-center py-5">
          <div className="flex items-center gap-1.5 mb-1">
            <FlameIcon
              size={22}
              className={(stats?.streakDays ?? user.streakDays) > 0
                ? 'text-halloween-orange'
                : 'text-halloween-ghost-dim'}
            />
            <span className="font-cinzel text-3xl font-black text-halloween-orange">
              {stats?.streakDays ?? user.streakDays}
            </span>
          </div>
          <p className="text-halloween-ghost-muted text-xs">Day Streak</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active quests */}
        <Card>
          <h2 className="font-cinzel text-sm font-semibold text-halloween-ghost mb-4">
            Active Quests
          </h2>
          {activeQuests.length === 0 ? (
            <p className="text-halloween-ghost-dim text-sm text-center py-4">
              No active quests. Check the Quests page!
            </p>
          ) : (
            <div className="space-y-3">
              {activeQuests.map((uq) => {
                const quest = uq.quest;
                const pct = Math.min((uq.progress / quest.targetCount) * 100, 100);
                return (
                  <div key={uq._id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-halloween-ghost text-sm font-medium">{quest.title}</p>
                        <p className="text-halloween-ghost-dim text-xs">{quest.description}</p>
                      </div>
                      <span className="badge-orange text-xs shrink-0 ml-2">
                        {uq.progress}/{quest.targetCount}
                      </span>
                    </div>
                    <div className="bg-halloween-darker rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-halloween-purple to-halloween-orange rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent activity */}
        <Card>
          <h2 className="font-cinzel text-sm font-semibold text-halloween-ghost mb-4">
            Recent Activity
          </h2>
          {recentHistory.length === 0 ? (
            <p className="text-halloween-ghost-dim text-sm text-center py-4">
              No activity yet. Connect a repo and start coding!
            </p>
          ) : (
            <div className="space-y-2.5">
              {recentHistory.map((r) => (
                <div key={r._id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-halloween-purple/20 flex items-center justify-center shrink-0 text-halloween-ghost-muted">
                      {EVENT_ICONS[r.eventType] ?? <Zap size={14} />}
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${eventTypeColor(r.eventType)}`}>
                        {formatEventType(r.eventType)}
                      </p>
                      <p className="text-halloween-ghost-dim text-xs">
                        {formatRelativeTime(r.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {r.xpGranted > 0 && (
                      <p className="text-halloween-orange text-xs font-semibold">
                        +{r.xpGranted} XP
                      </p>
                    )}
                    {r.coinsGranted > 0 && (
                      <p className="text-halloween-amber text-xs">
                        +{r.coinsGranted} 🪙
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Achievements preview */}
      <Card className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-cinzel text-sm font-semibold text-halloween-ghost">
            Achievements
          </h2>
          <span className="text-halloween-ghost-muted text-xs">
            {user.achievements.length} unlocked
          </span>
        </div>
        {user.achievements.length === 0 ? (
          <p className="text-halloween-ghost-dim text-sm text-center py-2">
            Complete quests and push commits to earn Halloween achievements!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.achievements.slice(0, 8).map((id) => (
              <div
                key={String(id)}
                className="w-10 h-10 rounded-full bg-halloween-orange/20 border border-halloween-orange/30 flex items-center justify-center text-lg animate-pulse-glow"
              >
                🏆
              </div>
            ))}
          </div>
        )}
      </Card>
    </PageWrapper>
  );
};

export default DashboardPage;

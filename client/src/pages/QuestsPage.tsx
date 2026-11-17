import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Zap, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import CoinDisplay from '../components/gamification/CoinDisplay';
import { useGamificationStore } from '../store/gamificationStore';
import type { UserQuest } from '../types';

type Tab = 'active' | 'completed';

const QUEST_TYPE_BADGE: Record<string, string> = {
  daily: 'badge-orange',
  weekly: 'badge-purple',
  milestone: 'badge-green',
  ai_generated: 'badge-orange',
};

const QuestCard: React.FC<{
  uq: UserQuest;
  onClaim?: (id: string) => void;
  claiming?: boolean;
}> = ({ uq, onClaim, claiming }) => {
  const quest = uq.quest;
  const pct = Math.min((uq.progress / quest.targetCount) * 100, 100);
  const canClaim = uq.completed && !uq.claimedAt;

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-cinzel text-sm font-semibold text-halloween-ghost">
              {quest.title}
            </h3>
            <span className={`${QUEST_TYPE_BADGE[quest.type] ?? 'badge-purple'} text-xs capitalize`}>
              {quest.type.replace('_', ' ')}
            </span>
            {uq.claimedAt && (
              <span className="badge-green text-xs">
                <CheckCircle2 size={10} /> Claimed
              </span>
            )}
          </div>
          <p className="text-halloween-ghost-muted text-xs">{quest.description}</p>
        </div>
        <div className="text-right shrink-0 space-y-1">
          <p className="text-halloween-orange text-xs font-semibold">+{quest.xpReward} XP</p>
          <CoinDisplay coins={quest.coinReward} size="sm" />
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-halloween-ghost-dim mb-1">
          <span>Progress</span>
          <span>{uq.progress} / {quest.targetCount}</span>
        </div>
        <div className="bg-halloween-darker rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              uq.completed
                ? 'bg-halloween-green'
                : 'bg-gradient-to-r from-halloween-purple to-halloween-orange'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {canClaim && onClaim && (
        <Button
          size="sm"
          loading={claiming}
          leftIcon={<Gift size={14} />}
          onClick={() => onClaim(uq._id)}
          className="w-full"
        >
          Claim Reward
        </Button>
      )}
    </Card>
  );
};

const QuestsPage: React.FC = () => {
  const { quests, isLoading, fetchQuests, claimQuest } = useGamificationStore();
  const [tab, setTab] = useState<Tab>('active');
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const handleClaim = async (userQuestId: string) => {
    setClaimingId(userQuestId);
    try {
      const rewards = await claimQuest(userQuestId);
      toast.success(`Claimed +${rewards.xp} XP and ${rewards.coins} coins! 🎃`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to claim reward');
    } finally {
      setClaimingId(null);
    }
  };

  const active = quests.filter((q) => !q.completed);
  const completed = quests.filter((q) => q.completed);
  const claimable = completed.filter((q) => !q.claimedAt);

  const displayed = tab === 'active' ? active : completed;

  return (
    <PageWrapper
      title="Quests"
      subtitle="Complete quests to earn XP and coins"
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['active', 'completed'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
              tab === t
                ? 'bg-halloween-orange/15 text-halloween-orange border border-halloween-orange/30'
                : 'text-halloween-ghost-muted hover:text-halloween-ghost'
            }`}
          >
            {t}
            {t === 'active' && active.length > 0 && (
              <span className="ml-2 bg-halloween-orange text-white text-xs rounded-full px-1.5 py-0.5">
                {active.length}
              </span>
            )}
            {t === 'completed' && claimable.length > 0 && (
              <span className="ml-2 bg-halloween-green text-halloween-dark text-xs rounded-full px-1.5 py-0.5">
                {claimable.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
      ) : displayed.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center py-12 text-center gap-3">
            {tab === 'active' ? (
              <>
                <Clock size={40} className="text-halloween-ghost-dim" />
                <p className="font-cinzel text-halloween-ghost">All quests complete!</p>
                <p className="text-halloween-ghost-muted text-sm">
                  New daily quests reset at midnight UTC.
                </p>
              </>
            ) : (
              <>
                <Zap size={40} className="text-halloween-ghost-dim" />
                <p className="font-cinzel text-halloween-ghost">No completed quests yet</p>
                <p className="text-halloween-ghost-muted text-sm">
                  Push commits and merge PRs to make progress.
                </p>
              </>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {displayed.map((uq) => (
            <QuestCard
              key={uq._id}
              uq={uq}
              onClaim={handleClaim}
              claiming={claimingId === uq._id}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default QuestsPage;

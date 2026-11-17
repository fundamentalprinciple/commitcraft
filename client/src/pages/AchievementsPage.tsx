import React, { useEffect } from 'react';
import { Lock } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import { useGamificationStore } from '../store/gamificationStore';
import type { Achievement } from '../types';

const RARITY_STYLES: Record<string, { border: string; glow: string; label: string }> = {
  common: {
    border: 'border-halloween-ghost-dim/40',
    glow: '',
    label: 'text-halloween-ghost-muted',
  },
  uncommon: {
    border: 'border-halloween-green/40',
    glow: 'shadow-[0_0_12px_rgba(0,255,136,0.2)]',
    label: 'text-halloween-green',
  },
  rare: {
    border: 'border-halloween-purple-light/50',
    glow: 'shadow-purple',
    label: 'text-halloween-purple-light',
  },
  legendary: {
    border: 'border-halloween-orange/60',
    glow: 'shadow-halloween',
    label: 'text-halloween-orange',
  },
};

const AchievementCard: React.FC<{ achievement: Achievement & { unlocked: boolean } }> = ({
  achievement,
}) => {
  const style = RARITY_STYLES[achievement.rarity] ?? RARITY_STYLES.common;
  const unlocked = achievement.unlocked;

  return (
    <div
      className={`card flex items-start gap-4 transition-all duration-300 ${
        unlocked
          ? `${style.border} ${style.glow} border`
          : 'border border-halloween-purple/20 opacity-50 grayscale'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
          unlocked
            ? 'bg-halloween-orange/10 border border-halloween-orange/20'
            : 'bg-halloween-purple/10 border border-halloween-purple/20'
        }`}
      >
        {unlocked ? achievement.icon : <Lock size={18} className="text-halloween-ghost-dim" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <h3 className="font-cinzel text-sm font-semibold text-halloween-ghost">
            {achievement.title}
          </h3>
          <span className={`text-xs capitalize font-medium ${style.label}`}>
            {achievement.rarity}
          </span>
        </div>
        <p className="text-halloween-ghost-muted text-xs">{achievement.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-halloween-orange text-xs font-semibold">
            +{achievement.xpReward} XP
          </span>
          {achievement.unlockedAt && (
            <span className="text-halloween-ghost-dim text-xs">
              {new Date(achievement.unlockedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const AchievementsPage: React.FC = () => {
  const { achievements, isLoading, fetchAchievements } = useGamificationStore();

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  const byRarity = (list: typeof achievements) => ({
    legendary: list.filter((a) => a.rarity === 'legendary'),
    rare: list.filter((a) => a.rarity === 'rare'),
    uncommon: list.filter((a) => a.rarity === 'uncommon'),
    common: list.filter((a) => a.rarity === 'common'),
  });

  return (
    <PageWrapper
      title="Achievements"
      subtitle="Halloween badges and milestones"
      actions={
        <div className="flex items-center gap-2 text-sm text-halloween-ghost-muted">
          <span className="font-cinzel text-halloween-orange font-bold">{unlocked.length}</span>
          <span>/ {achievements.length} unlocked</span>
        </div>
      }
    >
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Unlocked */}
          {unlocked.length > 0 && (
            <section>
              <h2 className="font-cinzel text-sm font-semibold text-halloween-ghost mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-halloween-green inline-block" />
                Unlocked
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {(['legendary', 'rare', 'uncommon', 'common'] as const).flatMap(
                  (r) => byRarity(unlocked)[r],
                ).map((a) => (
                  <AchievementCard key={a._id} achievement={a} />
                ))}
              </div>
            </section>
          )}

          {/* Locked */}
          {locked.length > 0 && (
            <section>
              <h2 className="font-cinzel text-sm font-semibold text-halloween-ghost mb-4 flex items-center gap-2">
                <Lock size={12} className="text-halloween-ghost-dim" />
                Locked
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {(['legendary', 'rare', 'uncommon', 'common'] as const).flatMap(
                  (r) => byRarity(locked)[r],
                ).map((a) => (
                  <AchievementCard key={a._id} achievement={a} />
                ))}
              </div>
            </section>
          )}

          {achievements.length === 0 && (
            <Card>
              <div className="flex flex-col items-center py-12 text-center gap-3">
                <span className="text-5xl">🏆</span>
                <p className="font-cinzel text-halloween-ghost">Achievements loading…</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default AchievementsPage;

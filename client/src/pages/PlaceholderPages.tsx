import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { GhostIcon } from '../components/halloween/icons';

const makePlaceholder = (title: string, subtitle: string, phase: string) => {
  const Page: React.FC = () => (
    <PageWrapper title={title} subtitle={subtitle}>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <GhostIcon size={64} className="text-halloween-ghost/30 mb-4 animate-float" />
        <h2 className="font-cinzel text-xl text-halloween-ghost mb-2">Coming {phase}</h2>
        <p className="text-halloween-ghost-muted text-sm">This feature is under construction.</p>
      </div>
    </PageWrapper>
  );
  return Page;
};

export const IslandPage = makePlaceholder(
  'Haunted Island',
  "Your team's 2D haunted kingdom",
  'in Phase 5',
);
export const QuestsPage = makePlaceholder(
  'Quests',
  'Daily, weekly, and AI-generated quests',
  'in Phase 4',
);
export const AchievementsPage = makePlaceholder(
  'Achievements',
  'Halloween badges and milestones',
  'in Phase 4',
);
export const LeaderboardPage = makePlaceholder(
  'Leaderboard',
  'Individual and team rankings',
  'in Phase 6',
);

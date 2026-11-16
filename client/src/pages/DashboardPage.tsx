import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { PumpkinIcon } from '../components/halloween/icons';

const DashboardPage: React.FC = () => {
  return (
    <PageWrapper title="Dashboard" subtitle="Your haunted progress overview">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PumpkinIcon size={64} className="text-halloween-orange mb-4 animate-bounce-soft" />
        <h2 className="font-cinzel text-xl text-halloween-ghost mb-2">Coming in Phase 4</h2>
        <p className="text-halloween-ghost-muted text-sm">
          XP, coins, quests, and activity feed will appear here.
        </p>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;

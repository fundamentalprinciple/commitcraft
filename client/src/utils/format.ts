export function formatEventType(eventType: string): string {
  const labels: Record<string, string> = {
    push: 'Push',
    'pull_request.opened': 'PR Opened',
    'pull_request.merged': 'PR Merged',
    'pull_request.closed': 'PR Closed',
    'issues.opened': 'Issue Opened',
    'issues.closed': 'Issue Closed',
    pull_request_review: 'Code Review',
    release: 'Release Published',
    quest_complete: 'Quest Complete',
    achievement_unlock: 'Achievement Unlocked',
    streak_bonus: 'Streak Bonus',
    level_up: 'Level Up',
  };
  return labels[eventType] ?? eventType.replace(/_/g, ' ').replace(/\./g, ' → ');
}

export function eventTypeColor(eventType: string): string {
  if (eventType.includes('merged') || eventType === 'release') return 'text-halloween-green';
  if (eventType.includes('opened')) return 'text-halloween-orange';
  if (eventType === 'push') return 'text-halloween-purple-light';
  if (eventType === 'pull_request_review') return 'text-halloween-amber';
  if (eventType.includes('closed')) return 'text-halloween-ghost-muted';
  return 'text-halloween-ghost';
}

export function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function xpProgressInLevel(totalXp: number, level: number): number {
  let acc = 0;
  for (let l = 1; l < level; l++) acc += xpForLevel(l);
  return totalXp - acc;
}

export function xpPercentInLevel(totalXp: number, level: number): number {
  const progress = xpProgressInLevel(totalXp, level);
  const needed = xpForLevel(level);
  return Math.min((progress / needed) * 100, 100);
}

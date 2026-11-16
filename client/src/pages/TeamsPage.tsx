import React, { useEffect, useState } from 'react';
import {
  Users, Plus, LogIn, Copy, RefreshCw, Crown, UserMinus, LogOut as LeaveIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { teamsApi } from '../api/teams';
import { useAuthStore } from '../store/authStore';
import type { Team } from '../types';

const TeamsPage: React.FC = () => {
  const { user, fetchMe } = useAuthStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'main' | 'create' | 'join'>('main');
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [inviteInput, setInviteInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    teamsApi
      .myTeam()
      .then(setTeam)
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newTeam = await teamsApi.create({ name: teamName, description: teamDesc });
      setTeam(newTeam);
      await fetchMe();
      toast.success(`Team "${newTeam.name}" created!`);
      setView('main');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create team');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const joined = await teamsApi.join(inviteInput.trim());
      setTeam(joined);
      await fetchMe();
      toast.success(`Joined team "${joined.name}"!`);
      setView('main');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid invite code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this team?')) return;
    try {
      await teamsApi.leave();
      setTeam(null);
      await fetchMe();
      toast.success('Left the team');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to leave team');
    }
  };

  const handleRemoveMember = async (memberId: string, name: string) => {
    if (!confirm(`Remove ${name} from the team?`)) return;
    try {
      await teamsApi.removeMember(memberId);
      setTeam((prev) =>
        prev
          ? { ...prev, members: prev.members.filter((m) => m._id !== memberId) }
          : prev,
      );
      toast.success(`${name} removed`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove member');
    }
  };

  const handleRegenerateInvite = async () => {
    try {
      const { inviteCode } = await teamsApi.regenerateInvite();
      setTeam((prev) => (prev ? { ...prev, inviteCode } : prev));
      toast.success('Invite code regenerated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to regenerate code');
    }
  };

  const copyInvite = () => {
    if (!team) return;
    navigator.clipboard.writeText(team.inviteCode);
    toast.success('Invite code copied!');
  };

  if (loading) {
    return (
      <PageWrapper title="Teams">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      </PageWrapper>
    );
  }

  // ── No team yet ──────────────────────────────────────────
  if (!team) {
    if (view === 'create') {
      return (
        <PageWrapper title="Create a Team">
          <div className="max-w-md">
            <Card>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-halloween-ghost-muted mb-1">Team Name</label>
                  <input
                    className="input"
                    placeholder="The Pumpkin Patchers"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="block text-sm text-halloween-ghost-muted mb-1">
                    Description <span className="text-halloween-ghost-dim">(optional)</span>
                  </label>
                  <textarea
                    className="input resize-none"
                    rows={3}
                    placeholder="A brief description of your team..."
                    value={teamDesc}
                    onChange={(e) => setTeamDesc(e.target.value)}
                    maxLength={300}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" loading={submitting} className="flex-1">
                    Create Team
                  </Button>
                  <Button variant="ghost" onClick={() => setView('main')} type="button">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </PageWrapper>
      );
    }

    if (view === 'join') {
      return (
        <PageWrapper title="Join a Team">
          <div className="max-w-md">
            <Card>
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-sm text-halloween-ghost-muted mb-1">
                    Invite Code
                  </label>
                  <input
                    className="input font-mono"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" loading={submitting} className="flex-1">
                    Join Team
                  </Button>
                  <Button variant="ghost" onClick={() => setView('main')} type="button">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </PageWrapper>
      );
    }

    return (
      <PageWrapper title="Teams" subtitle="Create or join a haunted team">
        <div className="max-w-md">
          <Card>
            <div className="flex flex-col items-center py-8 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-halloween-purple/20 flex items-center justify-center">
                <Users size={32} className="text-halloween-purple-light" />
              </div>
              <div>
                <h2 className="font-cinzel text-lg font-semibold text-halloween-ghost mb-1">
                  You're not in a team yet
                </h2>
                <p className="text-halloween-ghost-muted text-sm">
                  Build a haunted island together with your teammates.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  className="flex-1"
                  leftIcon={<Plus size={16} />}
                  onClick={() => setView('create')}
                >
                  Create Team
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  leftIcon={<LogIn size={16} />}
                  onClick={() => setView('join')}
                >
                  Join with Code
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  // ── Has a team ───────────────────────────────────────────
  const isOwner = String(team.ownerId) === String(user?._id);

  return (
    <PageWrapper
      title={team.name}
      subtitle={team.description ?? `@${team.slug}`}
      actions={
        !isOwner ? (
          <Button variant="danger" size="sm" leftIcon={<LeaveIcon size={14} />} onClick={handleLeave}>
            Leave Team
          </Button>
        ) : undefined
      }
    >
      <div className="max-w-3xl space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Level', value: team.level },
            { label: 'Total XP', value: team.totalXp.toLocaleString() },
            { label: 'Coins', value: team.coins.toLocaleString() },
            { label: 'Members', value: team.members.length },
          ].map((s) => (
            <Card key={s.label} className="text-center py-4">
              <div className="font-cinzel text-2xl font-bold text-halloween-orange">{s.value}</div>
              <div className="text-halloween-ghost-muted text-xs mt-1">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Invite code (owner only) */}
        {isOwner && (
          <Card>
            <h3 className="font-cinzel text-sm font-semibold text-halloween-ghost mb-3">
              Invite Code
            </h3>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-halloween-darker rounded-lg px-4 py-2.5 text-halloween-orange font-mono text-sm border border-halloween-purple/20 truncate">
                {team.inviteCode}
              </code>
              <Button variant="ghost" size="sm" leftIcon={<Copy size={14} />} onClick={copyInvite}>
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RefreshCw size={14} />}
                onClick={handleRegenerateInvite}
              >
                New
              </Button>
            </div>
            <p className="text-halloween-ghost-dim text-xs mt-2">
              Share this code with teammates so they can join.
            </p>
          </Card>
        )}

        {/* Members */}
        <Card>
          <h3 className="font-cinzel text-sm font-semibold text-halloween-ghost mb-4">
            Members ({team.members.length})
          </h3>
          <div className="space-y-3">
            {team.members.map((member) => {
              const isMe = member._id === user?._id;
              const memberIsOwner = member._id === String(team.ownerId);
              return (
                <div key={member._id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.displayName}
                      className="w-9 h-9 rounded-full border-2 border-halloween-purple/30"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-halloween-ghost text-sm font-medium">
                          {member.displayName}
                        </span>
                        {memberIsOwner && (
                          <Crown size={12} className="text-halloween-amber" />
                        )}
                        {isMe && (
                          <span className="badge-purple text-xs">you</span>
                        )}
                      </div>
                      <span className="text-halloween-ghost-dim text-xs">
                        Lvl {member.level} · {member.xp.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                  {isOwner && !isMe && (
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<UserMinus size={14} />}
                      onClick={() => handleRemoveMember(member._id, member.displayName)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default TeamsPage;

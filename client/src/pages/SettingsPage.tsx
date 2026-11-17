import React, { useEffect, useState } from 'react';
import {
  Link2,
  Link2Off,
  RefreshCw,
  Lock,
  Globe,
  GitBranch,
  AlertCircle,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { reposApi, type GitHubRepo } from '../api/repos';
import { eventsApi, type GithubEventRecord } from '../api/events';
import { formatEventType, eventTypeColor, formatRelativeTime } from '../utils/format';
import type { Repository } from '../types';

const RepoEventFeed: React.FC<{ repo: Repository }> = ({ repo }) => {
  const [events, setEvents] = useState<GithubEventRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await eventsApi.byRepo(repo._id, 10);
      setEvents(data);
    } catch {
      // silently fail – events are non-critical
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    if (!open && events.length === 0) load();
    setOpen((v) => !v);
  };

  return (
    <div className="border-t border-halloween-purple/10 mt-3 pt-3">
      <button
        onClick={toggle}
        className="flex items-center gap-2 text-xs text-halloween-ghost-muted hover:text-halloween-ghost transition-colors"
      >
        <Activity size={12} />
        {open ? 'Hide' : 'Show'} event feed
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
          {loading && (
            <p className="text-halloween-ghost-dim text-xs">Loading…</p>
          )}
          {!loading && events.length === 0 && (
            <p className="text-halloween-ghost-dim text-xs">
              No events yet. Push a commit to get started.
            </p>
          )}
          {events.map((ev) => (
            <div key={ev._id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={10} className="text-halloween-green shrink-0" />
                <span className={`text-xs font-medium ${eventTypeColor(ev.eventType)}`}>
                  {formatEventType(ev.eventType)}
                </span>
              </div>
              <span className="text-halloween-ghost-dim text-xs shrink-0">
                {formatRelativeTime(ev.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const [available, setAvailable] = useState<GitHubRepo[]>([]);
  const [connected, setConnected] = useState<Repository[]>([]);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [connectingId, setConnectingId] = useState<number | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [showAvailable, setShowAvailable] = useState(false);

  useEffect(() => {
    reposApi.connected().then(setConnected).catch(() => {});
  }, []);

  const loadAvailable = async () => {
    setLoadingAvail(true);
    try {
      const repos = await reposApi.available();
      setAvailable(repos);
      setShowAvailable(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load repositories');
    } finally {
      setLoadingAvail(false);
    }
  };

  const handleConnect = async (repo: GitHubRepo) => {
    setConnectingId(repo.id);
    try {
      const newRepo = await reposApi.connect({
        githubRepoId: repo.id,
        fullName: repo.full_name,
        description: repo.description ?? undefined,
        isPrivate: repo.private,
      });
      setConnected((prev) => [...prev, newRepo]);
      setAvailable((prev) =>
        prev.map((r) => (r.id === repo.id ? { ...r, connected: true } : r)),
      );
      toast.success(`Connected ${repo.full_name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect repository');
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = async (repo: Repository) => {
    setDisconnectingId(repo._id);
    try {
      await reposApi.disconnect(repo._id);
      setConnected((prev) => prev.filter((r) => r._id !== repo._id));
      setAvailable((prev) =>
        prev.map((r) => (r.id === repo.githubRepoId ? { ...r, connected: false } : r)),
      );
      toast.success(`Disconnected ${repo.fullName}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to disconnect repository');
    } finally {
      setDisconnectingId(null);
    }
  };

  return (
    <PageWrapper
      title="Settings"
      subtitle="Manage connected repositories and account preferences"
    >
      <div className="max-w-3xl space-y-8">

        {/* Connected repositories */}
        <section>
          <h2 className="font-cinzel text-lg font-semibold text-halloween-ghost mb-4">
            Connected Repositories
          </h2>

          {connected.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center py-8 text-center">
                <GitBranch size={36} className="text-halloween-ghost-dim mb-3" />
                <p className="text-halloween-ghost-muted text-sm mb-1">No repositories connected</p>
                <p className="text-halloween-ghost-dim text-xs">
                  Connect a repository to start tracking commits and earning rewards.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {connected.map((repo) => (
                <Card key={repo._id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-halloween-purple/20 flex items-center justify-center shrink-0">
                        {repo.isPrivate ? (
                          <Lock size={16} className="text-halloween-ghost-muted" />
                        ) : (
                          <Globe size={16} className="text-halloween-ghost-muted" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-halloween-ghost font-medium text-sm truncate">
                            {repo.fullName}
                          </p>
                          <span className="badge-green text-xs shrink-0">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        </div>
                        {repo.lastSyncedAt ? (
                          <p className="text-halloween-ghost-dim text-xs">
                            Last event: {formatRelativeTime(repo.lastSyncedAt)}
                          </p>
                        ) : (
                          <p className="text-halloween-ghost-dim text-xs">
                            Waiting for first webhook event…
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={disconnectingId === repo._id}
                      leftIcon={<Link2Off size={14} />}
                      onClick={() => handleDisconnect(repo)}
                    >
                      Disconnect
                    </Button>
                  </div>
                  <RepoEventFeed repo={repo} />
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Add repositories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cinzel text-lg font-semibold text-halloween-ghost">
              Add Repository
            </h2>
            <Button
              variant="ghost"
              size="sm"
              loading={loadingAvail}
              leftIcon={<RefreshCw size={14} />}
              onClick={loadAvailable}
            >
              {showAvailable ? 'Refresh' : 'Browse GitHub Repos'}
            </Button>
          </div>

          {showAvailable && (
            <>
              <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-halloween-purple/10 border border-halloween-purple/20">
                <AlertCircle size={16} className="text-halloween-ghost-muted shrink-0 mt-0.5" />
                <p className="text-halloween-ghost-muted text-xs">
                  Connecting a repository installs a webhook so CommitCraft can track activity
                  in real time. You need admin access to the repository.
                </p>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {available.map((repo) => (
                  <div
                    key={repo.id}
                    className="card py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-halloween-purple/10 flex items-center justify-center shrink-0">
                        {repo.private ? (
                          <Lock size={14} className="text-halloween-ghost-dim" />
                        ) : (
                          <Globe size={14} className="text-halloween-ghost-dim" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-halloween-ghost text-sm truncate">{repo.full_name}</p>
                        {repo.language && (
                          <p className="text-halloween-ghost-dim text-xs">{repo.language}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={repo.connected ? 'ghost' : 'primary'}
                      size="sm"
                      loading={connectingId === repo.id}
                      disabled={repo.connected}
                      leftIcon={<Link2 size={14} />}
                      onClick={() => handleConnect(repo)}
                    >
                      {repo.connected ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;

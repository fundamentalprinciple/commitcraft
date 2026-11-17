import api from './client';

export interface GithubEventRecord {
  _id: string;
  eventType: string;
  repoId: { _id: string; fullName: string } | string;
  processed: boolean;
  rewardGranted: boolean;
  createdAt: string;
}

export const eventsApi = {
  recent: (limit = 20) =>
    api
      .get<{ data: GithubEventRecord[] }>(`/events?limit=${limit}`)
      .then((r) => r.data.data),
  byRepo: (repoId: string, limit = 20) =>
    api
      .get<{ data: GithubEventRecord[] }>(`/events/repo/${repoId}?limit=${limit}`)
      .then((r) => r.data.data),
};

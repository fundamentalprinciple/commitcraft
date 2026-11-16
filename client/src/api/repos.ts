import api from './client';
import type { Repository } from '../types';

export interface GitHubRepo {
  id: number;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  pushed_at: string;
  language: string | null;
  connected: boolean;
}

export interface ConnectRepoPayload {
  githubRepoId: number;
  fullName: string;
  description?: string;
  isPrivate: boolean;
  teamId?: string;
}

export const reposApi = {
  available: () =>
    api.get<{ data: GitHubRepo[] }>('/repos/available').then((r) => r.data.data),
  connected: () =>
    api.get<{ data: Repository[] }>('/repos').then((r) => r.data.data),
  connect: (payload: ConnectRepoPayload) =>
    api.post<{ data: Repository }>('/repos/connect', payload).then((r) => r.data.data),
  disconnect: (repoId: string) =>
    api.delete(`/repos/${repoId}`),
};

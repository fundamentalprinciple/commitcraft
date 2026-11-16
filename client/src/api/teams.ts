import api from './client';
import type { Team } from '../types';

export const teamsApi = {
  myTeam: () =>
    api.get<{ data: Team }>('/teams/me').then((r) => r.data.data),
  bySlug: (slug: string) =>
    api.get<{ data: Team }>(`/teams/${slug}`).then((r) => r.data.data),
  create: (payload: { name: string; description?: string }) =>
    api.post<{ data: Team }>('/teams', payload).then((r) => r.data.data),
  join: (inviteCode: string) =>
    api.post<{ data: Team }>('/teams/join', { inviteCode }).then((r) => r.data.data),
  leave: () =>
    api.post('/teams/leave'),
  removeMember: (memberId: string) =>
    api.delete(`/teams/members/${memberId}`),
  regenerateInvite: () =>
    api.post<{ data: { inviteCode: string } }>('/teams/invite/regenerate').then((r) => r.data.data),
};

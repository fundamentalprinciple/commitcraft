import api from './client';
import type { User } from '../types';

export const authApi = {
  me: () => api.get<{ data: User }>('/auth/me').then((r) => r.data.data),
  logout: () => api.post('/auth/logout'),
};

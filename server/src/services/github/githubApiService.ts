import axios from 'axios';
import crypto from 'crypto';
import { logger } from '../../utils/logger';

const GITHUB_API = 'https://api.github.com';

export interface GitHubRepo {
  id: number;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  pushed_at: string;
  language: string | null;
}

export interface GitHubWebhook {
  id: number;
  config: { url: string; secret: string };
  events: string[];
  active: boolean;
}

function githubClient(accessToken: string) {
  return axios.create({
    baseURL: GITHUB_API,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}

export const listUserRepos = async (accessToken: string): Promise<GitHubRepo[]> => {
  const client = githubClient(accessToken);
  const repos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const { data } = await client.get<GitHubRepo[]>('/user/repos', {
      params: { per_page: 100, page, sort: 'pushed', affiliation: 'owner,collaborator' },
    });
    repos.push(...data);
    if (data.length < 100) break;
    page++;
  }

  return repos;
};

export const createWebhook = async (
  accessToken: string,
  repoFullName: string,
  webhookUrl: string,
  secret: string,
): Promise<number> => {
  const client = githubClient(accessToken);
  const { data } = await client.post<GitHubWebhook>(`/repos/${repoFullName}/hooks`, {
    name: 'web',
    active: true,
    events: ['push', 'pull_request', 'pull_request_review', 'issues', 'release'],
    config: {
      url: webhookUrl,
      content_type: 'json',
      secret,
      insecure_ssl: '0',
    },
  });
  logger.info(`Webhook created for ${repoFullName}: id=${data.id}`);
  return data.id;
};

export const deleteWebhook = async (
  accessToken: string,
  repoFullName: string,
  webhookId: number,
): Promise<void> => {
  const client = githubClient(accessToken);
  try {
    await client.delete(`/repos/${repoFullName}/hooks/${webhookId}`);
    logger.info(`Webhook deleted for ${repoFullName}: id=${webhookId}`);
  } catch (err) {
    // 404 means already deleted on GitHub side – not a failure
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      logger.warn(`Webhook ${webhookId} already gone on GitHub`);
      return;
    }
    throw err;
  }
};

export const generateWebhookSecret = (): string =>
  crypto.randomBytes(32).toString('hex');

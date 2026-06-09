// server/src/services/github.service.js
// Uses native fetch (Node 20+) — no node-fetch package needed

const GITHUB_BASE = 'https://api.github.com';

const buildHeaders = () => ({
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'DevConnect-App',
  ...(process.env.GITHUB_API_TOKEN && {
    Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
  }),
});

/**
 * Fetch up to 6 most-recently-updated public repos for a GitHub username.
 * Throws { statusCode, message } on API errors.
 */
export const fetchGithubRepos = async (githubUsername) => {
  const url = `${GITHUB_BASE}/users/${githubUsername}/repos?sort=updated&per_page=6&type=owner`;

  const res = await fetch(url, { headers: buildHeaders() });

  if (res.status === 404) throw { statusCode: 404, message: 'GitHub user not found' };
  if (res.status === 403) throw { statusCode: 429, message: 'GitHub rate limit exceeded. Try again later.' };
  if (!res.ok) throw { statusCode: 502, message: `GitHub API error (${res.status})` };

  const repos = await res.json();

  return repos.map(r => ({
    name:        r.name,
    description: r.description || null,
    language:    r.language || null,
    stars:       r.stargazers_count,
    forks:       r.forks_count,
    url:         r.html_url,
    updatedAt:   r.updated_at,
  }));
};

/**
 * Extract a GitHub username from a full URL or a bare username string.
 * Handles: "https://github.com/harsh_lal", "github.com/harsh_lal", "harsh_lal"
 */
export const extractGithubUsername = (value) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.includes('github.com/')) {
    return trimmed.split('github.com/')[1].replace(/\/$/, '').split('/')[0];
  }
  return trimmed || null;
};

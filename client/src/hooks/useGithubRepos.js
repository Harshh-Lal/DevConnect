import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../lib/axios';

/**
 * Extracts a bare GitHub username from a full URL or plain string.
 * Handles: "https://github.com/user", "github.com/user", "user"
 */
const extractUsername = (value) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.includes('github.com/')) {
    return trimmed.split('github.com/')[1].replace(/\/$/, '').split('/')[0] || null;
  }
  return trimmed || null;
};

/**
 * Custom hook — fetch GitHub repos for a given githubUrl.
 * Returns { repos, loading, error, refetch }
 */
export const useGithubRepos = (githubUrl) => {
  const [repos, setRepos]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const username = extractUsername(githubUrl);

  const fetchRepos = useCallback(async () => {
    if (!username) {
      setRepos([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(`/github/${username}/repos`);
      setRepos(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load repositories.');
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return { repos, loading, error, refetch: fetchRepos };
};

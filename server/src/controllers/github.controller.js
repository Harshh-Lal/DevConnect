import { fetchGithubRepos, extractGithubUsername } from '../services/github.service.js';
import prisma from '../utils/prisma.js';

/**
 * GET /api/github/:username/repos
 * Public — fetch repos for any GitHub username.
 */
export const getRepos = async (req, res) => {
  try {
    const repos = await fetchGithubRepos(req.params.username);
    res.json({ success: true, data: repos });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/github/sync
 * Protected — re-fetches repos using the logged-in user's saved GitHub URL.
 */
export const syncRepos = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubUrl: true },
    });

    const githubUsername = extractGithubUsername(user?.githubUrl);

    if (!githubUsername) {
      return res.status(400).json({
        success: false,
        message: 'No GitHub URL set on your profile. Add one in Edit Profile.',
      });
    }

    const repos = await fetchGithubRepos(githubUsername);
    res.json({ success: true, data: repos });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

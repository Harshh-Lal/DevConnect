import prisma from '../utils/prisma.js';

export const getUserProfile = async (req, res) => {
    try {
        // Grab the username from the URL (e.g., /api/users/harsh)
        const { username } = req.params;

        // Search Prisma for this exact user
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: {
                id: true,
                username: true,
                displayName: true,
                bio: true,
                avatarUrl: true,
                githubUrl: true,
                createdAt: true,
                _count: { select: { posts: true } },
                posts: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: { select: { username: true, displayName: true, avatarUrl: true } },
                        _count: { select: { comments: true, likes: true } },
                        // ADD THIS EXACT LINE BELOW:
                        likes: { select: { userId: true } }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "Developer not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("ERROR FETCHING PROFILE:", error);
        res.status(500).json({ message: "Failed to fetch profile." });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { displayName, bio, avatarUrl, githubUrl, skills } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                displayName,
                bio,
                avatarUrl,
                githubUrl,
                // Only update skills if explicitly provided in the request
                ...(Array.isArray(skills) ? { skills } : {}),
            }
        });

        res.status(200).json({ message: "Profile updated successfully!", user: updatedUser });
    } catch (error) {
        console.error("ERROR UPDATING PROFILE:", error);
        res.status(500).json({ message: "Failed to update profile." });
    }
};

export const followUser = async (req, res, next) => {
    try {
        const followerId = req.user.userId;
        const followingId = req.params.id;

        if (followerId === followingId)
            return res.status(400).json({ success: false, message: "Cannot follow yourself" });

        const target = await prisma.user.findUnique({ where: { id: followingId } });
        if (!target) return res.status(404).json({ success: false, message: "User not found" });

        await prisma.follow.create({ data: { followerId, followingId } });

        res.status(201).json({ success: true, message: "Followed successfully" });
    } catch (err) {
        if (err.code === 'P2002')                          // already following
            return res.status(409).json({ success: false, message: "Already following" });
        next(err);
    }
};

export const unfollowUser = async (req, res, next) => {
    try {
        const followerId = req.user.userId;
        const followingId = req.params.id;

        await prisma.follow.delete({
            where: { followerId_followingId: { followerId, followingId } }
        });

        res.status(200).json({ success: true, message: "Unfollowed successfully" });
    } catch (err) {
        if (err.code === 'P2025')                          // wasn't following
            return res.status(404).json({ success: false, message: "Not following this user" });
        next(err);
    }
};

export const getFollowers = async (req, res, next) => {
    try {
        const follows = await prisma.follow.findMany({
            where: { followingId: req.params.id },
            include: {
                follower: {
                    select: { id: true, username: true, displayName: true, avatarUrl: true }
                }
            }
        });
        res.json({ success: true, data: follows.map(f => f.follower) });
    } catch (err) { next(err); }
};

export const getFollowing = async (req, res, next) => {
    try {
        const follows = await prisma.follow.findMany({
            where: { followerId: req.params.id },
            include: {
                following: {
                    select: { id: true, username: true, displayName: true, avatarUrl: true }
                }
            }
        });
        res.json({ success: true, data: follows.map(f => f.following) });
    } catch (err) { next(err); }
};

export const getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user?.userId;   // optionalAuth middleware

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true, username: true, displayName: true,
        bio: true, avatarUrl: true, githubUrl: true,
        skills: true,
        createdAt: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
            _count: { select: { likes: true, comments: true } },
            likes: { select: { userId: true } },
          }
        },
        _count: { select: { followers: true, following: true, posts: true } }
      }
    });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Check follow status
    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
      const follow = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: currentUserId, followingId: user.id } }
      });
      isFollowing = !!follow;
    }

    res.json({ success: true, data: { ...user, isFollowing } });
  } catch (err) { next(err); }
};

export const getSuggestions = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;

    // Get IDs of users the current user already follows
    const alreadyFollowing = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });
    const followingIds = alreadyFollowing.map(f => f.followingId);

    // Exclude self and already-followed users
    const suggestions = await prisma.user.findMany({
      where: {
        id: { notIn: [...followingIds, currentUserId] },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        _count: { select: { followers: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    res.json({ success: true, data: suggestions });
  } catch (err) { next(err); }
};

// GET /api/users/search?skills=React,Node.js&q=name
export const searchUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;
    const skillQuery = req.query.skills;
    const textQuery  = req.query.q?.trim();
    const skills = skillQuery ? skillQuery.split(',').map(s => s.trim()).filter(Boolean) : [];

    const where = {
      // Never return the current user in results
      NOT: { id: currentUserId },
    };

    if (skills.length > 0) {
      where.skills = { hasSome: skills };
    }

    if (textQuery) {
      where.OR = [
        { displayName: { contains: textQuery, mode: 'insensitive' } },
        { username:    { contains: textQuery, mode: 'insensitive' } },
      ];
    }

    // Run users query and follow-status check in parallel
    const [users, followingRecords] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          skills: true,
          _count: { select: { followers: true, posts: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      }),
    ]);

    const followingSet = new Set(followingRecords.map(f => f.followingId));

    const data = users.map(user => ({
      ...user,
      isFollowing: followingSet.has(user.id),
    }));

    res.json({ success: true, data });
  } catch (err) { next(err); }
};


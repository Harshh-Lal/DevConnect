import prisma from '../utils/prisma.js';

export const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId; // Pulled securely from the JWT token

        // 1. Check if the like already exists
        const existingLike = await prisma.like.findFirst({
            where: {
                postId: postId,
                userId: userId,
            }
        });

        if (existingLike) {
            // 2. If it exists, they are "unliking" the post
            await prisma.like.delete({
                where: { id: existingLike.id }
            });
            return res.status(200).json({ message: "Post unliked", isLiked: false });
        } else {
            // 3. If it doesn't exist, they are "liking" the post
            await prisma.like.create({
                data: {
                    postId: postId,
                    userId: userId,
                }
            });
            return res.status(200).json({ message: "Post liked", isLiked: true });
        }
    } catch (error) {
        console.error("ERROR TOGGLING LIKE:", error);
        res.status(500).json({ message: "Failed to toggle like." });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, description, githubUrl, liveUrl, tags } = req.body;

        const userId = req.user.userId;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        // Step 1: Create the post
        const created = await prisma.post.create({
            data: {
                title,
                description,
                ...(githubUrl ? { githubUrl } : {}),
                ...(liveUrl ? { liveUrl } : {}),
                tags: Array.isArray(tags) ? tags : [],
                authorId: userId,
            },
        });

        // Step 2: Fetch it back with relations
        const newPost = await prisma.post.findUnique({
            where: { id: created.id },
            include: {
                author: { select: { username: true, displayName: true, avatarUrl: true } },
                _count: { select: { comments: true, likes: true } },
                likes: { select: { userId: true } } // <-- ADDED THIS!
            },
        });

        res.status(201).json({
            message: "Project posted successfully!",
            post: newPost,
        });
    } catch (error) {
        console.error("ERROR CREATING POST:", error.message);
        console.error("Full error:", JSON.stringify(error, null, 2));
        res.status(500).json({ message: "Failed to create post.", detail: error.message });
    }
};

// ─── GET FOLLOWING FEED (THE TIMELINE) ───────────────────────
export const getFeed = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { cursor, limit = 5 } = req.query;
        const take = Number(limit);

        // Step 1: Get IDs of everyone the current user follows
        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true },
        });
        const followingIds = following.map(f => f.followingId);

        // Step 2: If not following anyone, return empty (frontend handles this)
        if (followingIds.length === 0) {
            return res.status(200).json({ posts: [], nextCursor: null });
        }

        // Step 3: Fetch posts from followed users with cursor-based pagination
        const query = {
            where: { authorId: { in: followingIds } },
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
                _count: { select: { comments: true, likes: true } },
                likes: { select: { userId: true } },
            },
        };

        if (cursor) {
            query.cursor = { id: cursor };
            query.skip = 1;
        }

        const posts = await prisma.post.findMany(query);
        const nextId = posts.length === take ? posts[take - 1].id : null;

        res.status(200).json({ posts, nextCursor: nextId });
    } catch (error) {
        console.error("ERROR FETCHING FEED:", error);
        res.status(500).json({ message: "Failed to fetch feed." });
    }
};

// ─── GET EXPLORE POSTS (For You / All posts) ─────────
export const getExploreFeed = async (req, res) => {
    try {
        const { cursor, limit = 5 } = req.query;
        const take = Number(limit);

        const query = {
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
                _count: { select: { comments: true, likes: true } },
                likes: { select: { userId: true } } // <-- ADDED THIS!
            }
        };

        if (cursor) {
            query.cursor = { id: cursor };
            query.skip = 1;
        }

        const posts = await prisma.post.findMany(query);
        const nextId = posts.length === take ? posts[take - 1].id : null;

        res.status(200).json({ posts, nextCursor: nextId });
    } catch (error) {
        console.error("ERROR FETCHING EXPLORE FEED:", error);
        res.status(500).json({ message: "Failed to fetch explore feed." });
    }
};


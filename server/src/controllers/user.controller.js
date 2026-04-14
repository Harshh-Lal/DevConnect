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
                email: true,
                createdAt: true,
                _count: {
                    select: { posts: true }
                },
                posts: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: { select: { username: true, displayName: true } },
                        _count: { select: { comments: true, likes: true } }
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
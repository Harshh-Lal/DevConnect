import prisma from '../utils/prisma.js';

export const createPost = async (req, res) => {
    try {
        const { title, description, githubUrl, liveUrl, tags } = req.body;
        
        // Your verifyToken middleware decoded the JWT and attached it to req.user.
        // We grab the userId so the database knows who wrote this!
        const userId = req.user.userId; 

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        const newPost = await prisma.post.create({
            data: {
                title,
                description,
                githubUrl,
                liveUrl,
                tags: tags || [], 
                authorId: userId,
            },
            // Include the author data so your React frontend can display their username!
            include: {
                author: {
                    select: { username: true } 
                }
            }
        });

        res.status(201).json({ 
            message: "Project posted successfully!", 
            post: newPost 
        });
    } catch (error) {
        console.error("ERROR CREATING POST:", error);
        res.status(500).json({ message: "Failed to create post." });
    }
};

// ─── GET ALL POSTS (THE TIMELINE) ───────────────────────
export const getFeed = async (req, res) => {
    try {
        // Look for a cursor and a limit in the URL query (?cursor=abc&limit=10)
        const { cursor, limit = 5 } = req.query; 
        const take = Number(limit);

        const query = {
            take: take,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { username: true } },
                _count: { select: { comments: true, likes: true } }
            }
        };

        // If the frontend sent a cursor, tell Prisma to start searching AFTER that specific post
        if (cursor) {
            query.cursor = { id: cursor };
            query.skip = 1; // Skip the cursor itself so we don't send a duplicate post!
        }

        const posts = await prisma.post.findMany(query);

        // Figure out the NEXT cursor to give to the frontend
        // If we got exactly the number of posts we asked for, there are probably more!
        const nextId = posts.length === take ? posts[take - 1].id : null;

        // Send back the chunk of posts AND the cursor for the next batch
        res.status(200).json({ 
            posts: posts, 
            nextCursor: nextId 
        });

    } catch (error) {
        console.error("ERROR FETCHING FEED:", error);
        res.status(500).json({ message: "Failed to fetch feed." });
    }
};
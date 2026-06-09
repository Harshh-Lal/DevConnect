import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, displayName, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const safeUsername = username.toLowerCase().replace(/\s+/g, '');

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username: safeUsername }],
            },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already in use.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username: safeUsername,
                displayName: displayName || safeUsername,
                email,
                password: hashedPassword,
            }
        });

        const payload = { userId: newUser.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                displayName: newUser.displayName,
                email: newUser.email,
            },
        });
    }
    catch (error) {
        console.error('Registration Error: ', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Email/username and password are required.' });
        }

        // Detect whether the user typed an email or a username
        const isEmail = identifier.includes('@');

        const user = await prisma.user.findUnique({
            where: isEmail ? { email: identifier } : { username: identifier },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const payload = { userId: user.id };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const getMe = async (req, res) => {
    try {
        const userID = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userID },
            select: {
                id: true,
                username: true,
                displayName: true,
                email: true,
                bio: true,
                avatarUrl: true,
                githubUrl: true,
                skills: true,
                createdAt: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        // Flatten counts onto the user object for easy access on the frontend
        const { _count, ...rest } = user;
        res.status(200).json({
            ...rest,
            followersCount: _count.followers,
            followingCount: _count.following,
        });
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import userRoutes from './routes/user.routes.js';
import githubRoutes from './routes/github.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/github', githubRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({status: 'OK', message: 'Server is running normally.'})
})

export default app;
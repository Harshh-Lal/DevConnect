import 'dotenv/config';
import cors from 'cors';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
})
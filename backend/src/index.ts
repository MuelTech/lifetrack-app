import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import logRoutes from './routes/logRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/users', logRoutes);
app.use('/articles', articleRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('LifeTrack API is running');
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is listening on http://0.0.0.0:${PORT}`);
});
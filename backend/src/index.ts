import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('LifeTrack API is running');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
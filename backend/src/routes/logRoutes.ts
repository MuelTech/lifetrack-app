import { Router } from 'express';
import { postLog, getTodayLog, getLogsHistory, getInsights } from '../controllers/logController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Apply auth protection to all log endpoints
router.use(requireAuth);

// POST /users/log - Create or update a daily log
router.post('/log', postLog);

// GET /users/logs/today - Retrieve today's log
router.get('/logs/today', getTodayLog);

// GET /users/logs/history - Retrieve all user logs
router.get('/logs/history', getLogsHistory);

// GET /users/insights - Retrieve latest insights and recommendations
router.get('/insights', getInsights);

export default router;

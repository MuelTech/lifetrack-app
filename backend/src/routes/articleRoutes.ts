import { Router } from 'express';
import { getArticles } from '../controllers/articleController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Apply auth protection to article endpoints
router.use(requireAuth);

// GET /articles - Fetch guidance articles
router.get('/', getArticles);

export default router;

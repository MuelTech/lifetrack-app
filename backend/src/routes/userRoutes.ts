import { Router } from 'express';
import { getProfile, createProfile } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Apply requireAuth middleware to all profile routes
router.use(requireAuth);

// GET /users/profile/me
router.get('/profile/me', getProfile);

// POST /users/profile
router.post('/profile', createProfile);

export default router;
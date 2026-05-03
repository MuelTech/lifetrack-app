import { Router } from 'express';
import { login } from '../controllers/authController.js';

const router = Router();

// POST /auth/login
router.post('/login', login);

export default router;
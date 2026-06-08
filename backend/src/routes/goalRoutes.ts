import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createGoal, getGoals, toggleGoal, deleteGoal } from '../controllers/goalController.js';

const router = Router();

router.use(requireAuth);

router.post('/', createGoal);
router.get('/', getGoals);
router.put('/:id/toggle', toggleGoal);
router.delete('/:id', deleteGoal);

export default router;

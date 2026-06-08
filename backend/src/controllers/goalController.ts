import type { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

const goalSchema = z.object({
  title: z.string().min(1),
});

// Helper to get today's date boundary at midnight UTC
const getTodayUTC = () => {
  const d = new Date();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const date = d.getUTCDate();
  return new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { title } = goalSchema.parse(req.body);

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
      },
    });

    return res.status(201).json({ goal });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Invalid data' });
    }
    console.error('Create goal error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Fetch goals
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const todayUTC = getTodayUTC();

    // Daily Reset Logic: Uncheck goals if lastCompletedAt is before today
    const updatedGoals = await Promise.all(
      goals.map(async (goal) => {
        if (goal.isCompleted && goal.lastCompletedAt) {
          const completedDate = new Date(goal.lastCompletedAt).getTime();
          if (completedDate < todayUTC.getTime()) {
            // It was completed on a previous day, so we reset it for today
            const updated = await prisma.goal.update({
              where: { id: goal.id },
              data: { isCompleted: false },
            });
            return updated;
          }
        }
        return goal;
      })
    );

    return res.status(200).json({ goals: updatedGoals });
  } catch (error) {
    console.error('Get goals error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== userId) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const todayUTC = getTodayUTC();

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        isCompleted: !goal.isCompleted,
        lastCompletedAt: !goal.isCompleted ? todayUTC : goal.lastCompletedAt,
      },
    });

    return res.status(200).json({ goal: updated });
  } catch (error) {
    console.error('Toggle goal error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== userId) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await prisma.goal.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

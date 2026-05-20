import type { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import { LifestyleStatus, MealQuality, ActivityType, StressLevel } from '@prisma/client';

// Helper to get date only at midnight UTC
const getDateOnly = (dateInput?: string | Date): Date => {
  const d = dateInput ? new Date(dateInput) : new Date();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const date = d.getUTCDate();
  return new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
};

// Zod schemas
const logSchema = z.object({
  date: z.string().optional(), // YYYY-MM-DD
  sleptAt: z.string(), // ISO string
  wokeUp: z.string(), // ISO string
  sleepHours: z.coerce.number().min(0).max(24),
  breakfast: z.nativeEnum(MealQuality),
  lunch: z.nativeEnum(MealQuality),
  dinner: z.nativeEnum(MealQuality),
  waterCups: z.coerce.number().min(0),
  activityDuration: z.coerce.number().min(0).max(1440),
  activityType: z.array(z.nativeEnum(ActivityType)).default([]),
  studyHours: z.coerce.number().min(0).max(24),
  screenTimeHours: z.coerce.number().min(0).max(24),
  stressLevel: z.nativeEnum(StressLevel),
});

export const postLog = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 1. Validate payload
    const validated = logSchema.parse(req.body);
    const logDate = getDateOnly(validated.date);

    // 2. Upsert Log
    // Check if log already exists for this user and date
    const existingLog = await prisma.log.findUnique({
      where: {
        userId_date: {
          userId,
          date: logDate,
        },
      },
    });

    let log;
    if (existingLog) {
      log = await prisma.log.update({
        where: { id: existingLog.id },
        data: {
          sleptAt: new Date(validated.sleptAt),
          wokeUp: new Date(validated.wokeUp),
          sleepHours: validated.sleepHours,
          breakfast: validated.breakfast,
          lunch: validated.lunch,
          dinner: validated.dinner,
          waterCups: validated.waterCups,
          activityDuration: validated.activityDuration,
          activityType: validated.activityType,
          studyHours: validated.studyHours,
          screenTimeHours: validated.screenTimeHours,
          stressLevel: validated.stressLevel,
        },
      });
    } else {
      log = await prisma.log.create({
        data: {
          userId,
          date: logDate,
          sleptAt: new Date(validated.sleptAt),
          wokeUp: new Date(validated.wokeUp),
          sleepHours: validated.sleepHours,
          breakfast: validated.breakfast,
          lunch: validated.lunch,
          dinner: validated.dinner,
          waterCups: validated.waterCups,
          activityDuration: validated.activityDuration,
          activityType: validated.activityType,
          studyHours: validated.studyHours,
          screenTimeHours: validated.screenTimeHours,
          stressLevel: validated.stressLevel,
        },
      });

      // Update Profile Streak
      // Get yesterday's date
      const yesterday = new Date(logDate);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      
      const yesterdayLog = await prisma.log.findUnique({
        where: {
          userId_date: {
            userId,
            date: yesterday,
          },
        },
      });

      if (yesterdayLog) {
        // Increment streak
        await prisma.profile.update({
          where: { id: userId },
          data: { currentStreak: { increment: 1 } },
        });
      } else {
        // Reset or set streak to 1
        await prisma.profile.update({
          where: { id: userId },
          data: { currentStreak: 1 },
        });
      }
    }

    // 3. Run Pattern Detection Engine
    // Fetch last 4 logs of the user (including today's)
    const recentLogs = await prisma.log.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 4,
    });

    const activePatterns: string[] = [];

    if (recentLogs.length > 0) {
      // Rule 1: Sleep Deprivation (average sleepHours < 6.0 in the recent logs)
      const avgSleep = recentLogs.reduce((sum, item) => sum + item.sleepHours, 0) / recentLogs.length;
      if (avgSleep < 6.0) {
        activePatterns.push('Sleep Deprivation');
      }

      // Rule 2: Dehydration Trend (average waterCups < 5.0)
      const avgWater = recentLogs.reduce((sum, item) => sum + item.waterCups, 0) / recentLogs.length;
      if (avgWater < 5.0) {
        activePatterns.push('Dehydration Trend');
      }

      // Rule 3: Excessive Screen Time (average screenTimeHours > 4.0 or studyHours + screenTimeHours > 8.0)
      const avgLeisureScreen = recentLogs.reduce((sum, item) => sum + item.screenTimeHours, 0) / recentLogs.length;
      const avgTotalScreen = recentLogs.reduce((sum, item) => sum + (item.studyHours + item.screenTimeHours), 0) / recentLogs.length;
      if (avgLeisureScreen > 4.0 || avgTotalScreen > 8.0) {
        activePatterns.push('Excessive Screen Time');
      }

      // Rule 4: Poor Nutrition (junk/skipped meals count >= 4 in recent logs)
      let badMealsCount = 0;
      recentLogs.forEach(item => {
        if (item.breakfast === MealQuality.JUNK || item.breakfast === MealQuality.SKIPPED) badMealsCount++;
        if (item.lunch === MealQuality.JUNK || item.lunch === MealQuality.SKIPPED) badMealsCount++;
        if (item.dinner === MealQuality.JUNK || item.dinner === MealQuality.SKIPPED) badMealsCount++;
      });
      if (badMealsCount >= 4) {
        activePatterns.push('Poor Nutrition');
      }

      // Rule 5: Sedentary Lifestyle (average activityDuration < 15.0 mins)
      const avgActivity = recentLogs.reduce((sum, item) => sum + item.activityDuration, 0) / recentLogs.length;
      if (avgActivity < 15.0) {
        activePatterns.push('Sedentary Lifestyle');
      }
    }

    // Rule 6: High Stress Alert (today's stressLevel is HIGH)
    if (log.stressLevel === StressLevel.HIGH) {
      activePatterns.push('High Stress Alert');
    }

    // Determine status
    let status: LifestyleStatus = LifestyleStatus.BALANCED;
    if (activePatterns.length === 1) {
      status = LifestyleStatus.NEEDS_IMPROVEMENT;
    } else if (activePatterns.length >= 2) {
      status = LifestyleStatus.UNHEALTHY_PATTERN_DETECTED;
    }

    // 4. Upsert PatternResult
    const patternResult = await prisma.patternResult.upsert({
      where: { logId: log.id },
      update: {
        lifestyleStatus: status,
        activePatterns,
      },
      create: {
        userId,
        logId: log.id,
        date: logDate,
        lifestyleStatus: status,
        activePatterns,
      },
    });

    return res.status(200).json({
      message: 'Log saved successfully',
      log,
      patternResult,
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Validation error' });
    }
    console.error('Post log error:', error);
    return res.status(500).json({ error: 'Internal server error while saving log' });
  }
};

export const getTodayLog = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const todayDate = getDateOnly(req.query.date as string); // allows passing client timezone date

    const log = await prisma.log.findUnique({
      where: {
        userId_date: {
          userId,
          date: todayDate,
        },
      },
      include: {
        patternResult: true,
      },
    });

    if (!log) {
      return res.status(200).json({ logged: false });
    }

    return res.status(200).json({ logged: true, log });
  } catch (error) {
    console.error('Get today log error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching today log' });
  }
};

export const getLogsHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const logs = await prisma.log.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: {
        patternResult: true,
      },
    });

    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Get logs history error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching logs history' });
  }
};

export const getInsights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the latest pattern result
    const latestPattern = await prisma.patternResult.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (!latestPattern) {
      return res.status(200).json({
        hasInsights: false,
        lifestyleStatus: LifestyleStatus.BALANCED,
        activePatterns: [],
        recommendations: [
          'Maintain your regular log entries to build patterns.',
          'Try drinking 8 cups of water today.',
          'Aim to sleep before midnight.'
        ],
      });
    }

    // Dynamic recommendations based on patterns
    const recommendations: string[] = [];
    const active = latestPattern.activePatterns;

    if (active.includes('Sleep Deprivation')) {
      recommendations.push('Sleep before 12AM × 3 nights');
      recommendations.push('Reduce screen exposure 30 mins before bed');
    }
    if (active.includes('Dehydration Trend')) {
      recommendations.push('Keep a water bottle at your desk and sip hourly');
    }
    if (active.includes('Sedentary Lifestyle')) {
      recommendations.push('15-min walk after class');
      recommendations.push('Try doing light stretches every 2 hours of sitting');
    }
    if (active.includes('Excessive Screen Time')) {
      recommendations.push('Take a 5-minute screen break for every hour of coding');
    }
    if (active.includes('Poor Nutrition')) {
      recommendations.push('Include more balanced meals in your diet');
      recommendations.push('Prepare a healthy snack like nuts or fruit for study breaks');
    }
    if (active.includes('High Stress Alert')) {
      recommendations.push('Try 5 minutes of deep breathing or a quick mindfulness stretch');
    }

    // Fallbacks
    if (recommendations.length === 0) {
      recommendations.push('Keep up the good work! Maintain your balanced routine.');
      recommendations.push('15-min walk after class');
    }

    return res.status(200).json({
      hasInsights: true,
      lifestyleStatus: latestPattern.lifestyleStatus,
      activePatterns: latestPattern.activePatterns,
      recommendations,
      date: latestPattern.date,
    });

  } catch (error) {
    console.error('Get insights error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching insights' });
  }
};

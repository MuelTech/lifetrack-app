import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';


// Zod schema for profile creation matching the Prisma schema enums and fields
const createProfileSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
  yearLevel: z.string().min(1, 'Year level is required'),
  section: z.string().optional(),
  age: z.coerce.number().min(13, 'Age must be at least 13'),
  sex: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  healthConcerns: z.array(z.string()).default(['None']), // Passed as string array
});

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching profile' });
  }
};

export const createProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const email = req.user?.email;

    if (!userId || !email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 1. Validate payload
    const validatedData = createProfileSchema.parse(req.body);

    // 2. Check if a profile already exists for this ID
    const existingProfile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'Profile already exists for this user' });
    }

    // 3. Create profile
    const newProfile = await prisma.profile.create({
      data: {
        id: userId,
        email: email,
        ...validatedData,
        section: validatedData.section ?? null,
      },
    });

    return res.status(201).json({
      message: 'Profile created successfully',
      profile: newProfile,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Validation error' });
    }
    
    console.error('Create profile error:', error);
    return res.status(500).json({ error: 'Internal server error while creating profile' });
  }
};

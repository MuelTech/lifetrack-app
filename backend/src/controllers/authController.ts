import type { Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../config/supabase.js';

// Zod validation schema for login
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const login = async (req: Request, res: Response) => {
  try {
    // 1. Validate request body against schema
    const validatedData = loginSchema.parse(req.body);

    // 2. Attempt authentication with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // 3. Return success and the session token
    return res.status(200).json({
      message: 'Login successful',
      session: data.session,
      user: data.user,
    });

  } catch (error: any) {
    // If it's a validation error from Zod, return the first error message
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Validation error' });
    }
    
    // Otherwise, return a generic 500 error
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
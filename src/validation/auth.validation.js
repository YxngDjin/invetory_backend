import { z } from 'zod';

export const signupSchema = z.object({
  firstname: z.string().min(2).max(100).trim(),
  lastname: z.string().min(2).max(100).trim(),
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(128),
  role: z.literal('user').default('user'),
});

export const signinSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(1),
});

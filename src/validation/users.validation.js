import { z } from 'zod';

export const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a valid number')
    .transform(Number)
    .refine(val => val > 0, 'ID must be greater than 0'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  email: z.email().max(255).toLowerCase().trim().optional(),
  role: z.enum(['user', 'admin']).optional(),
})
  .refine(
    data => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be updated',
    }
  );
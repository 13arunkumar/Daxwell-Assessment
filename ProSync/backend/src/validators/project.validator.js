const { z } = require('zod');

const createProjectSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(2000, 'Description cannot exceed 2000 characters'),
    clientId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid client ID'),
    projectManagerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project manager ID'),
    targetLaunchDate: z.string().datetime('Invalid date format'),
    budget: z.number().positive().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).max(2000).optional(),
    status: z
      .enum(['planning', 'active', 'on_hold', 'completed', 'cancelled'])
      .optional(),
    targetLaunchDate: z.string().datetime().optional(),
    actualLaunchDate: z.string().datetime().optional(),
    budget: z.number().positive().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};

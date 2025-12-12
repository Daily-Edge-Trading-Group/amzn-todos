import { z } from 'zod'

/**
 * Todo Validation Schemas
 */

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completed: z.boolean(),
  categoryId: z.string().uuid(),
})

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  description: z.string().max(2000, 'Description must be 2000 characters or less').optional(),
  dueDate: z.string().datetime('Invalid date format').optional(),
  categoryId: z.string().uuid('Invalid category ID'),
})

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(2000).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  completed: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
})

export const todoQueryParamsSchema = z.object({
  status: z.enum(['all', 'active', 'completed']).default('all'),
  sort: z.enum(['dueDate', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  categoryId: z.string().uuid().optional(),
})

// Inferred types from schemas
export type TodoInput = z.infer<typeof todoSchema>
export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type TodoQueryParamsInput = z.infer<typeof todoQueryParamsSchema>

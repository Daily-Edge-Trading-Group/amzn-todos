import { z } from 'zod'

/**
 * Category Validation Schemas
 */

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).trim(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').trim(),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').trim(),
})

// Inferred types from schemas
export type CategoryInput = z.infer<typeof categorySchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>

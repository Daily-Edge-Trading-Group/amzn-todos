import { ZodError, ZodSchema } from 'zod'

import type { ApiError } from '@todo-app/contracts'

/**
 * Format Zod validation errors to API error format
 */
export function formatZodError(error: ZodError): ApiError {
  const details: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root'
    if (!details[path]) {
      details[path] = []
    }
    details[path].push(issue.message)
  }

  return {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details,
  }
}

/**
 * Validate data against a Zod schema
 */
export function validate<T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: ApiError } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, error: formatZodError(result.error) }
}

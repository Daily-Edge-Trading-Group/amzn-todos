import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

import { formatZodError } from '@todo-app/guards'

/**
 * Validate request body middleware
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        error: formatZodError(result.error),
      })
      return
    }

    req.body = result.data
    next()
  }
}

/**
 * Validate query parameters middleware
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query)

    if (!result.success) {
      res.status(400).json({
        error: formatZodError(result.error),
      })
      return
    }

    req.query = result.data as typeof req.query
    next()
  }
}

/**
 * Validate URL parameters middleware
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params)

    if (!result.success) {
      res.status(400).json({
        error: formatZodError(result.error),
      })
      return
    }

    req.params = result.data as typeof req.params
    next()
  }
}

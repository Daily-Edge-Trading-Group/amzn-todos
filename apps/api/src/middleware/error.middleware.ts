import type { NextFunction, Request, Response } from 'express'

import type { ApiErrorResponse } from '@todo-app/contracts'

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(404, 'NOT_FOUND', `${resource} with id '${id}' not found`)
  }
}

/**
 * Conflict error (409)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message)
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err)

  if (err instanceof AppError) {
    const response: ApiErrorResponse = {
      error: {
        code: err.code as ApiErrorResponse['error']['code'],
        message: err.message,
        details: err.details,
      },
    }
    res.status(err.statusCode).json(response)
    return
  }

  // Unexpected error
  const response: ApiErrorResponse = {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  }
  res.status(500).json(response)
}

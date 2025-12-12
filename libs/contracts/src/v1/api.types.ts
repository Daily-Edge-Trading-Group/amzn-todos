/**
 * API Response Envelope Types
 */

export type ApiErrorCode = 'VALIDATION_ERROR' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR'

export interface ApiError {
  code: ApiErrorCode
  message: string
  details?: Record<string, string[]>
}

export interface ApiErrorResponse {
  error: ApiError
}

export interface ApiSuccessResponse<T> {
  data: T
}

export interface HealthResponse {
  status: 'ok' | 'degraded'
  timestamp: string
  version: string
}

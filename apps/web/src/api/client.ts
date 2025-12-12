import axios, { AxiosError } from 'axios'

import type { ApiErrorResponse } from '@todo-app/contracts'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data?.error) {
      return Promise.reject(error.response.data.error)
    }
    return Promise.reject({
      code: 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
    })
  }
)

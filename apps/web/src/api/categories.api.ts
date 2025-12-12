import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoriesListResponse,
  CategoryResponse,
} from '@todo-app/contracts'

import { apiClient } from './client'

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<CategoriesListResponse>('/categories')
    return response.data.data
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<CategoryResponse>(`/categories/${id}`)
    return response.data.data
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<CategoryResponse>('/categories', data)
    return response.data.data
  },

  update: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await apiClient.put<CategoryResponse>(`/categories/${id}`, data)
    return response.data.data
  },

  delete: async (id: string, cascade = false): Promise<void> => {
    await apiClient.delete(`/categories/${id}${cascade ? '?cascade=true' : ''}`)
  },
}

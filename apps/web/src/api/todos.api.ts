import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoQueryParams,
  TodosListResponse,
  TodoResponse,
} from '@todo-app/contracts'

import { apiClient } from './client'

export const todosApi = {
  getAll: async (params?: TodoQueryParams): Promise<Todo[]> => {
    const response = await apiClient.get<TodosListResponse>('/todos', { params })
    return response.data.data
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await apiClient.get<TodoResponse>(`/todos/${id}`)
    return response.data.data
  },

  create: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await apiClient.post<TodoResponse>('/todos', data)
    return response.data.data
  },

  update: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await apiClient.patch<TodoResponse>(`/todos/${id}`, data)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/todos/${id}`)
  },
}

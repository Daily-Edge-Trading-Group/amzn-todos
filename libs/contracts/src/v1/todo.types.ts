/**
 * Todo Contract Types
 */

export type TodoStatus = 'all' | 'active' | 'completed'
export type TodoSortField = 'dueDate' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export interface Todo {
  id: string
  title: string
  description?: string
  dueDate?: string // ISO 8601
  createdAt: string
  updatedAt: string
  completed: boolean
  categoryId: string
}

export interface CreateTodoRequest {
  title: string
  description?: string
  dueDate?: string
  categoryId: string
}

export interface UpdateTodoRequest {
  title?: string
  description?: string | null
  dueDate?: string | null
  completed?: boolean
  categoryId?: string
}

export interface TodoQueryParams {
  status?: TodoStatus
  sort?: TodoSortField
  order?: SortOrder
  categoryId?: string
}

export interface TodoResponse {
  data: Todo
}

export interface TodosListResponse {
  data: Todo[]
}

export interface GroupedTodosResponse {
  data: Record<string, Todo[]> // categoryId -> todos
}

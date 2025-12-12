import { v4 as uuid } from 'uuid'

import type {
  CreateTodoRequest,
  Todo,
  TodoQueryParams,
  UpdateTodoRequest,
} from '@todo-app/contracts'

/**
 * In-memory Todo Repository
 */
export class TodoRepository {
  private todos: Map<string, Todo> = new Map()

  async findAll(params: TodoQueryParams = {}): Promise<Todo[]> {
    let results = Array.from(this.todos.values())

    // Filter by category
    if (params.categoryId) {
      results = results.filter((t) => t.categoryId === params.categoryId)
    }

    // Filter by status
    if (params.status === 'active') {
      const now = new Date()
      results = results.filter((t) => {
        // Must not be completed
        if (t.completed) return false
        // Also filter out overdue todos (due date in the past)
        if (t.dueDate && new Date(t.dueDate) < now) return false
        return true
      })
    } else if (params.status === 'completed') {
      results = results.filter((t) => t.completed)
    }

    // Sort
    const sortField = params.sort || 'createdAt'
    const sortOrder = params.order || 'desc'

    results.sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      const comparison = aVal.localeCompare(bVal)
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return results
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.get(id) || null
  }

  async findByCategoryId(categoryId: string): Promise<Todo[]> {
    return Array.from(this.todos.values()).filter((t) => t.categoryId === categoryId)
  }

  async create(data: CreateTodoRequest): Promise<Todo> {
    const now = new Date().toISOString()
    const todo: Todo = {
      id: uuid(),
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      categoryId: data.categoryId,
      completed: false,
      createdAt: now,
      updatedAt: now,
    }
    this.todos.set(todo.id, todo)
    return todo
  }

  async update(id: string, data: UpdateTodoRequest): Promise<Todo | null> {
    const existing = this.todos.get(id)
    if (!existing) return null

    const updated: Todo = {
      ...existing,
      ...data,
      // Handle null values to clear optional fields
      description:
        data.description === null ? undefined : (data.description ?? existing.description),
      dueDate: data.dueDate === null ? undefined : (data.dueDate ?? existing.dueDate),
      updatedAt: new Date().toISOString(),
    }
    this.todos.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.todos.delete(id)
  }

  async deleteByCategoryId(categoryId: string): Promise<number> {
    const todosToDelete = Array.from(this.todos.values()).filter((t) => t.categoryId === categoryId)
    for (const todo of todosToDelete) {
      this.todos.delete(todo.id)
    }
    return todosToDelete.length
  }

  // For testing
  clear(): void {
    this.todos.clear()
  }
}

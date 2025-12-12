import { CategoryRepository } from './category.repository'
import { TodoRepository } from './todo.repository'

/**
 * Singleton store instance
 */
let store: {
  categories: CategoryRepository
  todos: TodoRepository
} | null = null

export function getStore() {
  if (!store) {
    store = {
      categories: new CategoryRepository(),
      todos: new TodoRepository(),
    }
  }
  return store
}

/**
 * Clear all data (for testing)
 */
export function clearStore() {
  if (store) {
    store.categories.clear()
    store.todos.clear()
  }
}

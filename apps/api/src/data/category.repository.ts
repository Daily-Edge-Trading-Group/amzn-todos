import { v4 as uuid } from 'uuid'

import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@todo-app/contracts'

/**
 * In-memory Category Repository
 */
export class CategoryRepository {
  private categories: Map<string, Category> = new Map()

  async findAll(): Promise<Category[]> {
    return Array.from(this.categories.values())
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.get(id) || null
  }

  async findByName(name: string): Promise<Category | null> {
    return (
      Array.from(this.categories.values()).find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      ) || null
    )
  }

  async create(data: CreateCategoryRequest): Promise<Category> {
    const now = new Date().toISOString()
    const category: Category = {
      id: uuid(),
      name: data.name,
      createdAt: now,
      updatedAt: now,
    }
    this.categories.set(category.id, category)
    return category
  }

  async update(id: string, data: UpdateCategoryRequest): Promise<Category | null> {
    const existing = this.categories.get(id)
    if (!existing) return null

    const updated: Category = {
      ...existing,
      name: data.name,
      updatedAt: new Date().toISOString(),
    }
    this.categories.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.categories.delete(id)
  }

  // For testing
  clear(): void {
    this.categories.clear()
  }
}

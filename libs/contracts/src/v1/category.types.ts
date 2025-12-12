/**
 * Category Contract Types
 */

export interface Category {
  id: string
  name: string
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

export interface CreateCategoryRequest {
  name: string
}

export interface UpdateCategoryRequest {
  name: string
}

export interface CategoryResponse {
  data: Category
}

export interface CategoriesListResponse {
  data: Category[]
}

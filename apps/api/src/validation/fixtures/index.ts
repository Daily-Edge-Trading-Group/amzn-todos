/**
 * Test fixtures for API validation tests
 */

import type { CreateCategoryRequest, CreateTodoRequest } from '@todo-app/contracts'

// =============================================================================
// Category Fixtures
// =============================================================================

export const validCategories: CreateCategoryRequest[] = [
  { name: 'Work' },
  { name: 'Personal' },
  { name: 'Shopping' },
  { name: 'Health & Fitness' },
  { name: 'Learning' },
]

export const invalidCategories = {
  emptyName: { name: '' },
  missingName: {},
  tooLongName: { name: 'a'.repeat(256) },
  whitespaceOnly: { name: '   ' },
  nullName: { name: null },
  numericName: { name: 123 },
}

// =============================================================================
// Todo Fixtures
// =============================================================================

export const createValidTodo = (categoryId: string): CreateTodoRequest => ({
  title: 'Complete project documentation',
  description: 'Write comprehensive docs for the todo app',
  categoryId,
})

export const createTodoWithDueDate = (categoryId: string, dueDate: string): CreateTodoRequest => ({
  title: 'Submit report',
  description: 'Quarterly financial report',
  categoryId,
  dueDate,
})

export const validTodos = {
  withDescription: (categoryId: string): CreateTodoRequest => ({
    title: 'Buy groceries',
    description: 'Milk, eggs, bread',
    categoryId,
  }),
  withoutDescription: (categoryId: string): CreateTodoRequest => ({
    title: 'Call mom',
    categoryId,
  }),
  withFutureDueDate: (categoryId: string): CreateTodoRequest => ({
    title: 'Pay bills',
    description: 'Electricity and internet',
    categoryId,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  }),
  withPastDueDate: (categoryId: string): CreateTodoRequest => ({
    title: 'Overdue task',
    description: 'This was due yesterday',
    categoryId,
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  }),
}

export const invalidTodos = {
  emptyTitle: (categoryId: string) => ({ title: '', categoryId }),
  missingTitle: (categoryId: string) => ({ categoryId }),
  missingCategoryId: { title: 'No category' },
  invalidCategoryId: { title: 'Invalid category', categoryId: 'non-existent-id' },
  tooLongTitle: (categoryId: string) => ({ title: 'a'.repeat(501), categoryId }),
  tooLongDescription: (categoryId: string) => ({
    title: 'Valid title',
    description: 'a'.repeat(2001),
    categoryId,
  }),
  invalidDueDate: (categoryId: string) => ({
    title: 'Invalid date',
    categoryId,
    dueDate: 'not-a-date',
  }),
}

// =============================================================================
// Query Parameter Fixtures
// =============================================================================

export const todoQueryParams = {
  validStatusAll: { status: 'all' },
  validStatusActive: { status: 'active' },
  validStatusCompleted: { status: 'completed' },
  validSortCreatedAt: { sort: 'createdAt' },
  validSortDueDate: { sort: 'dueDate' },
  validOrderAsc: { order: 'asc' },
  validOrderDesc: { order: 'desc' },
  combined: { status: 'active', sort: 'dueDate', order: 'asc' },
  invalidStatus: { status: 'invalid' },
  invalidSort: { sort: 'invalid' },
  invalidOrder: { order: 'invalid' },
}

// =============================================================================
// Update Fixtures
// =============================================================================

export const validCategoryUpdates = {
  rename: { name: 'Updated Category Name' },
}

export const validTodoUpdates = {
  changeTitle: { title: 'Updated title' },
  changeDescription: { description: 'Updated description' },
  markCompleted: { completed: true },
  markNotCompleted: { completed: false },
  changeDueDate: { dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() },
  clearDueDate: { dueDate: null },
  clearDescription: { description: null },
  fullUpdate: {
    title: 'Fully updated',
    description: 'New description',
    completed: true,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
}

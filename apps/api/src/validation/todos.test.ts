/**
 * Todo API Tests
 */

import request from 'supertest'
import { createApp } from '../app'
import {
  validCategories,
  validTodos,
  invalidTodos,
  validTodoUpdates,
} from './fixtures'

const app = createApp()

describe('Todos API', () => {
  let categoryId: string

  // Create a category before each test group that needs it
  beforeEach(async () => {
    const response = await request(app).post('/api/v1/categories').send(validCategories[0])
    categoryId = response.body.data.id
  })

  // GET /api/v1/todos - List all todos
  describe('GET /api/v1/todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app).get('/api/v1/todos')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ data: [] })
    })

    it('should return all todos', async () => {
      // Create todos
      await request(app).post('/api/v1/todos').send(validTodos.withDescription(categoryId))
      await request(app).post('/api/v1/todos').send(validTodos.withoutDescription(categoryId))

      const response = await request(app).get('/api/v1/todos')

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0]).toHaveProperty('id')
      expect(response.body.data[0]).toHaveProperty('title')
      expect(response.body.data[0]).toHaveProperty('categoryId')
      expect(response.body.data[0]).toHaveProperty('completed')
      expect(response.body.data[0]).toHaveProperty('createdAt')
      expect(response.body.data[0]).toHaveProperty('updatedAt')
    })

    it('should filter by status=active', async () => {
      // Create active todo
      await request(app).post('/api/v1/todos').send(validTodos.withFutureDueDate(categoryId))

      // Create completed todo
      const completedResponse = await request(app)
        .post('/api/v1/todos')
        .send(validTodos.withDescription(categoryId))
      await request(app)
        .put(`/api/v1/todos/${completedResponse.body.data.id}`)
        .send({ completed: true })

      const response = await request(app).get('/api/v1/todos?status=active')

      expect(response.status).toBe(200)
      // Active filter excludes completed AND overdue
      expect(response.body.data.every((todo: any) => !todo.completed)).toBe(true)
    })

    it('should filter by status=completed', async () => {
      // Create completed todo
      const todoResponse = await request(app)
        .post('/api/v1/todos')
        .send(validTodos.withDescription(categoryId))
      await request(app).put(`/api/v1/todos/${todoResponse.body.data.id}`).send({ completed: true })

      // Create active todo
      await request(app).post('/api/v1/todos').send(validTodos.withoutDescription(categoryId))

      const response = await request(app).get('/api/v1/todos?status=completed')

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].completed).toBe(true)
    })

    it('should filter by categoryId', async () => {
      // Create second category
      const secondCategoryResponse = await request(app)
        .post('/api/v1/categories')
        .send(validCategories[1])
      const secondCategoryId = secondCategoryResponse.body.data.id

      // Create todo in first category
      await request(app).post('/api/v1/todos').send(validTodos.withDescription(categoryId))

      // Create todo in second category
      await request(app).post('/api/v1/todos').send(validTodos.withDescription(secondCategoryId))

      const response = await request(app).get(`/api/v1/todos?categoryId=${categoryId}`)

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].categoryId).toBe(categoryId)
    })

    it('should sort by dueDate ascending', async () => {
      // Create todo with later date
      await request(app)
        .post('/api/v1/todos')
        .send({
          title: 'Later',
          categoryId,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        })

      // Create todo with sooner date
      await request(app)
        .post('/api/v1/todos')
        .send({
          title: 'Sooner',
          categoryId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })

      const response = await request(app).get('/api/v1/todos?sort=dueDate&order=asc')

      expect(response.status).toBe(200)
      expect(response.body.data[0].title).toBe('Sooner')
      expect(response.body.data[1].title).toBe('Later')
    })
  })

  // POST /api/v1/todos - Create todo
  describe('POST /api/v1/todos', () => {
    it('should create todo with valid data', async () => {
      const response = await request(app)
        .post('/api/v1/todos')
        .send(validTodos.withDescription(categoryId))

      expect(response.status).toBe(201)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data.title).toBe(validTodos.withDescription(categoryId).title)
      expect(response.body.data.description).toBe(
        validTodos.withDescription(categoryId).description
      )
      expect(response.body.data.categoryId).toBe(categoryId)
      expect(response.body.data.completed).toBe(false)
    })

    it('should create todo without description', async () => {
      const response = await request(app)
        .post('/api/v1/todos')
        .send(validTodos.withoutDescription(categoryId))

      expect(response.status).toBe(201)
      expect(response.body.data.description).toBeUndefined()
    })

    it('should create todo with due date', async () => {
      const todoData = validTodos.withFutureDueDate(categoryId)
      const response = await request(app).post('/api/v1/todos').send(todoData)

      expect(response.status).toBe(201)
      expect(response.body.data.dueDate).toBe(todoData.dueDate)
    })

    it('should reject todo with empty title', async () => {
      const response = await request(app)
        .post('/api/v1/todos')
        .send(invalidTodos.emptyTitle(categoryId))

      expect(response.status).toBe(400)
    })

    it('should reject todo with missing title', async () => {
      const response = await request(app)
        .post('/api/v1/todos')
        .send(invalidTodos.missingTitle(categoryId))

      expect(response.status).toBe(400)
    })

    it('should reject todo with missing categoryId', async () => {
      const response = await request(app).post('/api/v1/todos').send(invalidTodos.missingCategoryId)

      expect(response.status).toBe(400)
    })

    it('should reject todo with invalid categoryId', async () => {
      const response = await request(app).post('/api/v1/todos').send(invalidTodos.invalidCategoryId)

      // Invalid format returns 400 from validation, non-existent UUID would return 404
      expect(response.status).toBe(400)
    })
  })

  // GET /api/v1/todos/:id - Get todo by ID
  describe('GET /api/v1/todos/:id', () => {
    it('should return todo by ID', async () => {
      const createResponse = await request(app)
        .post('/api/v1/todos')
        .send(validTodos.withDescription(categoryId))
      const todoId = createResponse.body.data.id

      const response = await request(app).get(`/api/v1/todos/${todoId}`)

      expect(response.status).toBe(200)
      expect(response.body.data.id).toBe(todoId)
    })

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app).get('/api/v1/todos/non-existent-id')

      expect(response.status).toBe(404)
    })
  })

  // PUT /api/v1/todos/:id - Update todo (full)
  describe('PUT /api/v1/todos/:id', () => {
    it('should update todo title', async () => {
      const createResponse = await request(app)
        .post('/api/v1/todos')
        .send(validTodos.withDescription(categoryId))
      const todoId = createResponse.body.data.id

      const response = await request(app)
        .put(`/api/v1/todos/${todoId}`)
        .send(validTodoUpdates.changeTitle)

      expect(response.status).toBe(200)
      expect(response.body.data.title).toBe(validTodoUpdates.changeTitle.title)
    })

    it('should mark todo as completed', async () => {
      const createResponse = await request(app)
        .post('/api/v1/todos')
        .send(validTodos.withDescription(categoryId))
      const todoId = createResponse.body.data.id

      const response = await request(app)
        .put(`/api/v1/todos/${todoId}`)
        .send(validTodoUpdates.markCompleted)

      expect(response.status).toBe(200)
      expect(response.body.data.completed).toBe(true)
    })

    it('should clear due date with null', async () => {
      const createResponse = await request(app)
        .post('/api/v1/todos')
        .send(validTodos.withFutureDueDate(categoryId))
      const todoId = createResponse.body.data.id

      const response = await request(app)
        .put(`/api/v1/todos/${todoId}`)
        .send(validTodoUpdates.clearDueDate)

      expect(response.status).toBe(200)
      expect(response.body.data.dueDate).toBeUndefined()
    })

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .put('/api/v1/todos/non-existent-id')
        .send(validTodoUpdates.changeTitle)

      expect(response.status).toBe(404)
    })
  })

  // PATCH /api/v1/todos/:id - Update todo (partial)
  describe('PATCH /api/v1/todos/:id', () => {
    it('should partially update todo', async () => {
      const createResponse = await request(app)
        .post('/api/v1/todos')
        .send(validTodos.withDescription(categoryId))
      const todoId = createResponse.body.data.id
      const originalTitle = createResponse.body.data.title

      const response = await request(app)
        .patch(`/api/v1/todos/${todoId}`)
        .send({ description: 'New description only' })

      expect(response.status).toBe(200)
      expect(response.body.data.title).toBe(originalTitle) // Title unchanged
      expect(response.body.data.description).toBe('New description only')
    })
  })

  // DELETE /api/v1/todos/:id - Delete todo
  describe('DELETE /api/v1/todos/:id', () => {
    it('should delete todo', async () => {
      const createResponse = await request(app)
        .post('/api/v1/todos')
        .send(validTodos.withDescription(categoryId))
      const todoId = createResponse.body.data.id

      const response = await request(app).delete(`/api/v1/todos/${todoId}`)

      expect(response.status).toBe(204)

      // Verify it's deleted
      const getResponse = await request(app).get(`/api/v1/todos/${todoId}`)
      expect(getResponse.status).toBe(404)
    })

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app).delete('/api/v1/todos/non-existent-id')

      expect(response.status).toBe(404)
    })
  })
})

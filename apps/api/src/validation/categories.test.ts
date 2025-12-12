/**
 * Category API Tests
 */

import request from 'supertest'
import { createApp } from '../app'
import { validCategories, invalidCategories, validCategoryUpdates } from './fixtures'

const app = createApp()

describe('Categories API', () => {
  // GET /api/v1/categories - List all categories
  describe('GET /api/v1/categories', () => {
    it('should return empty array when no categories exist', async () => {
      const response = await request(app).get('/api/v1/categories')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ data: [] })
    })

    it('should return all categories', async () => {
      // Create categories first
      for (const category of validCategories.slice(0, 2)) {
        await request(app).post('/api/v1/categories').send(category)
      }

      const response = await request(app).get('/api/v1/categories')

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0]).toHaveProperty('id')
      expect(response.body.data[0]).toHaveProperty('name')
      expect(response.body.data[0]).toHaveProperty('createdAt')
      expect(response.body.data[0]).toHaveProperty('updatedAt')
    })
  })

  // POST /api/v1/categories - Create category
  describe('POST /api/v1/categories', () => {
    it('should create a new category with valid data', async () => {
      const response = await request(app).post('/api/v1/categories').send(validCategories[0])

      expect(response.status).toBe(201)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data.name).toBe(validCategories[0].name)
      expect(response.body.data).toHaveProperty('createdAt')
      expect(response.body.data).toHaveProperty('updatedAt')
    })

    it('should reject category with empty name', async () => {
      const response = await request(app)
        .post('/api/v1/categories')
        .send(invalidCategories.emptyName)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
    })

    it('should reject category with missing name', async () => {
      const response = await request(app)
        .post('/api/v1/categories')
        .send(invalidCategories.missingName)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
    })

    it('should reject duplicate category name', async () => {
      // Create first category
      await request(app).post('/api/v1/categories').send(validCategories[0])

      // Try to create duplicate
      const response = await request(app).post('/api/v1/categories').send(validCategories[0])

      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('error')
    })
  })

  // GET /api/v1/categories/:id - Get category by ID
  describe('GET /api/v1/categories/:id', () => {
    it('should return category by ID', async () => {
      // Create category
      const createResponse = await request(app).post('/api/v1/categories').send(validCategories[0])
      const categoryId = createResponse.body.data.id

      const response = await request(app).get(`/api/v1/categories/${categoryId}`)

      expect(response.status).toBe(200)
      expect(response.body.data.id).toBe(categoryId)
      expect(response.body.data.name).toBe(validCategories[0].name)
    })

    it('should return 404 for non-existent category', async () => {
      const response = await request(app).get('/api/v1/categories/non-existent-id')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
    })
  })

  // PUT /api/v1/categories/:id - Update category
  describe('PUT /api/v1/categories/:id', () => {
    it('should update category name', async () => {
      // Create category
      const createResponse = await request(app).post('/api/v1/categories').send(validCategories[0])
      const categoryId = createResponse.body.data.id

      const response = await request(app)
        .put(`/api/v1/categories/${categoryId}`)
        .send(validCategoryUpdates.rename)

      expect(response.status).toBe(200)
      expect(response.body.data.name).toBe(validCategoryUpdates.rename.name)
    })

    it('should return 404 when updating non-existent category', async () => {
      const response = await request(app)
        .put('/api/v1/categories/non-existent-id')
        .send(validCategoryUpdates.rename)

      expect(response.status).toBe(404)
    })

    it('should reject update to duplicate name', async () => {
      // Create two categories
      await request(app).post('/api/v1/categories').send(validCategories[0])
      const secondResponse = await request(app).post('/api/v1/categories').send(validCategories[1])
      const secondId = secondResponse.body.data.id

      // Try to rename second to first's name
      const response = await request(app)
        .put(`/api/v1/categories/${secondId}`)
        .send({ name: validCategories[0].name })

      expect(response.status).toBe(409)
    })
  })

  // DELETE /api/v1/categories/:id - Delete category
  describe('DELETE /api/v1/categories/:id', () => {
    it('should delete category with no todos', async () => {
      // Create category
      const createResponse = await request(app).post('/api/v1/categories').send(validCategories[0])
      const categoryId = createResponse.body.data.id

      const response = await request(app).delete(`/api/v1/categories/${categoryId}`)

      expect(response.status).toBe(204)

      // Verify it's deleted
      const getResponse = await request(app).get(`/api/v1/categories/${categoryId}`)
      expect(getResponse.status).toBe(404)
    })

    it('should return 404 for non-existent category', async () => {
      const response = await request(app).delete('/api/v1/categories/non-existent-id')

      expect(response.status).toBe(404)
    })

    it('should reject deletion when category has todos', async () => {
      // Create category
      const categoryResponse = await request(app)
        .post('/api/v1/categories')
        .send(validCategories[0])
      const categoryId = categoryResponse.body.data.id

      // Create todo in that category
      await request(app).post('/api/v1/todos').send({
        title: 'Test todo',
        categoryId,
      })

      // Try to delete category without cascade
      const response = await request(app).delete(`/api/v1/categories/${categoryId}`)

      expect(response.status).toBe(409)
      expect(response.body.error.message).toContain('associated todo')
    })

    it('should cascade delete todos when ?cascade=true', async () => {
      // Create category
      const categoryResponse = await request(app)
        .post('/api/v1/categories')
        .send(validCategories[0])
      const categoryId = categoryResponse.body.data.id

      // Create todos in that category
      await request(app).post('/api/v1/todos').send({
        title: 'Todo 1',
        categoryId,
      })
      await request(app).post('/api/v1/todos').send({
        title: 'Todo 2',
        categoryId,
      })

      // Delete with cascade
      const response = await request(app).delete(`/api/v1/categories/${categoryId}?cascade=true`)

      expect(response.status).toBe(204)

      // Verify category is deleted
      const getCategoryResponse = await request(app).get(`/api/v1/categories/${categoryId}`)
      expect(getCategoryResponse.status).toBe(404)

      // Verify todos are also deleted
      const getTodosResponse = await request(app).get(`/api/v1/todos?categoryId=${categoryId}`)
      expect(getTodosResponse.body.data).toHaveLength(0)
    })
  })
})

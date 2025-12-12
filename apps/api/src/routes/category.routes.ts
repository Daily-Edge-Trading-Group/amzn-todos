import { Router } from 'express'

import { createCategorySchema, updateCategorySchema } from '@todo-app/guards'

import { CategoryController } from '../controllers/category.controller'
import { getStore } from '../data/store'
import { validateBody } from '../middleware/validation.middleware'

const router = Router()
const store = getStore()
const controller = new CategoryController(store.categories, store.todos)

// GET /categories - List all categories
router.get('/', controller.list.bind(controller))

// GET /categories/:id - Get category by ID
router.get('/:id', controller.getById.bind(controller))

// POST /categories - Create new category
router.post('/', validateBody(createCategorySchema), controller.create.bind(controller))

// PUT /categories/:id - Update category
router.put('/:id', validateBody(updateCategorySchema), controller.update.bind(controller))

// DELETE /categories/:id - Delete category
router.delete('/:id', controller.delete.bind(controller))

export { router as categoryRouter }

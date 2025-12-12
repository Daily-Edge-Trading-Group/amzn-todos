import { Router } from 'express'

import {
  createTodoSchema,
  todoQueryParamsSchema,
  updateTodoSchema,
} from '@todo-app/guards'

import { TodoController } from '../controllers/todo.controller'
import { getStore } from '../data/store'
import { validateBody, validateQuery } from '../middleware/validation.middleware'

const router = Router()
const store = getStore()
const controller = new TodoController(store.todos, store.categories)

// GET /todos - List all todos with filters
router.get('/', validateQuery(todoQueryParamsSchema), controller.list.bind(controller))

// GET /todos/:id - Get todo by ID
router.get('/:id', controller.getById.bind(controller))

// POST /todos - Create new todo
router.post('/', validateBody(createTodoSchema), controller.create.bind(controller))

// PUT /todos/:id - Full update todo
router.put('/:id', validateBody(updateTodoSchema), controller.update.bind(controller))

// PATCH /todos/:id - Partial update todo
router.patch('/:id', validateBody(updateTodoSchema), controller.update.bind(controller))

// DELETE /todos/:id - Delete todo
router.delete('/:id', controller.delete.bind(controller))

export { router as todoRouter }

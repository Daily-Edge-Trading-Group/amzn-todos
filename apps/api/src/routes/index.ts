import { Router } from 'express'

import { categoryRouter } from './category.routes'
import { healthRouter } from './health.routes'
import { todoRouter } from './todo.routes'

const router = Router()

// Health check
router.use('/', healthRouter)

// API routes
router.use('/categories', categoryRouter)
router.use('/todos', todoRouter)

export { router }

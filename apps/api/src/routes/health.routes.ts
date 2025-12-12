import { Router } from 'express'

import type { HealthResponse } from '@todo-app/contracts'

const router = Router()

router.get('/health', (_req, res) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  }
  res.json(response)
})

export { router as healthRouter }

import cors from 'cors'
import express from 'express'

import { errorHandler } from './middleware/error.middleware'
import { router } from './routes'

export function createApp() {
  const app = express()

  // CORS Configuration
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
  app.use(
    cors({
      origin: corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  )

  // Other Middleware
  app.use(express.json())

  // Routes
  app.use('/api/v1', router)

  // Error handling
  app.use(errorHandler)

  return app
}

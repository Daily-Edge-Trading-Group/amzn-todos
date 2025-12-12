/**
 * Health API Tests
 */

import request from 'supertest'
import { createApp } from '../app'

const app = createApp()

describe('Health API', () => {
  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/v1/health')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('status', 'ok')
      expect(response.body).toHaveProperty('timestamp')
    })

    it('should return valid ISO timestamp', async () => {
      const response = await request(app).get('/api/v1/health')

      expect(response.status).toBe(200)
      const timestamp = new Date(response.body.timestamp)
      expect(timestamp.toISOString()).toBe(response.body.timestamp)
    })
  })
})

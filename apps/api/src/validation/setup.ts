/**
 * Jest setup file for API tests
 */

import { clearStore } from '../data/store'

// Reset the store before each test to ensure clean state
beforeEach(() => {
  clearStore()
})

// Global test timeout
jest.setTimeout(10000)

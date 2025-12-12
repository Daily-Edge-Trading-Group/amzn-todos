import 'dotenv/config'

// Dynamic import to ensure dotenv loads first
async function bootstrap() {
  const { createApp } = await import('./app')

  const PORT = process.env.PORT || 3000

  const app = createApp()

  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`)
    console.log(`📋 Health check: http://localhost:${PORT}/api/v1/health`)
  })
}

bootstrap()

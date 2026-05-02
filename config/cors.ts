import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

const corsConfig = defineConfig({
  enabled: true,
  origin: (origin) => {
    if (!origin) return true
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return true
    }

    const allowedOriginsStr = env.get('ALLOWED_ORIGINS')
    if (!allowedOriginsStr) return true

    const allowedOrigins = allowedOriginsStr.split(',').map((s: string) => s.trim())
    return allowedOrigins.includes(origin)
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig

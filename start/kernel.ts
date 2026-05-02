/*
|--------------------------------------------------------------------------
| HTTP kernel
|--------------------------------------------------------------------------
|
| This file wires three layers:
|
| 1) server.use — runs for every HTTP request (even 404s). CORS and Vite
|    run here so OPTIONS / asset serving still work without a matching route.
|
| 2) router.use — runs only when a route matches. Session + auth init are
|    global so both surfaces share them: browser forms need session (CSRF),
|    and API routes need auth.initialize to read Bearer tokens.
|
| 3) Named middleware — applied per route group in start/routes/web.ts and
|    start/routes/api.ts: Shield/static/vite for HTML; cors + forceJson (+ auth)
|    for /api.
|
*/

import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

server.errorHandler(() => import('#exceptions/handler'))

server.use([
  () => import('@adonisjs/static/static_middleware'),
  () => import('#middleware/container_bindings_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('@adonisjs/vite/vite_middleware'),
])

router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/session/session_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
])

export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
  cors: () => import('@adonisjs/cors/cors_middleware'),
  forceJsonResponse: () => import('#middleware/force_json_response_middleware'),
  shield: () => import('@adonisjs/shield/shield_middleware'),
  static: () => import('@adonisjs/static/static_middleware'),
  vite: () => import('@adonisjs/vite/vite_middleware'),
})

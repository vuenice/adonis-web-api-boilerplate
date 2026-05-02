/*
|--------------------------------------------------------------------------
| JSON API routes
|--------------------------------------------------------------------------
|
| All routes use the /api prefix so the exception handler can return JSON
| for errors (see app/exceptions/handler.ts).
|
| forceJsonResponse: sets Accept: application/json so validation/auth
| failures from the framework stay JSON-shaped.
|
| cors: explicit on the group (in addition to server-level CORS) so API
| behavior stays obvious when you read the routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/health', [() => import('#controllers/health_controller'), 'index'])

    router
      .group(() => {
        router.get('/me', [() => import('#controllers/me_controller'), 'index'])
      })
      .use([middleware.auth()])
  })
  .prefix('/api')
  .use([middleware.cors(), middleware.forceJsonResponse()])

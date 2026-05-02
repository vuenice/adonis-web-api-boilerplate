/*
|--------------------------------------------------------------------------
| Web (HTML) routes
|--------------------------------------------------------------------------
|
| These routes are for browsers: Edge views, Vite assets, and Shield
| (CSRF, CSP, etc.). They intentionally do NOT use the /api prefix.
|
| Keep new server-rendered pages and form posts inside this group so CSRF
| protection applies. Do not mount JSON/mobile API endpoints here.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', [() => import('#controllers/welcome_controller'), 'index'])
    router.get('/demo', [() => import('#controllers/web_demo_controller'), 'show'])
    router.post('/demo', [() => import('#controllers/web_demo_controller'), 'store'])
  })
  // Shield: CSRF + security headers for cookie/session-based browser traffic.
  // static + vite: public files and HMR for Edge templates.
  .use([middleware.shield(), middleware.static(), middleware.vite()])

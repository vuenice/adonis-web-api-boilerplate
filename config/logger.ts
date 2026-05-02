import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, targets } from '@adonisjs/core/logger'
import type { InferLoggers } from '@adonisjs/core/types'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')
const dateStr = `${day}-${month}-${year}`

const logsPath = app.makePath('logs')
mkdirSync(logsPath, { recursive: true })

const loggerConfig = defineConfig({
  default: 'app',
  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME', 'adonis-web-api-boilerplate'),
      level: env.get('LOG_LEVEL', 'info'),
      transport: {
        targets: targets()
          .pushIf(app.inProduction, targets.file({ destination: join(logsPath, `${dateStr}.log`) }))
          .push(targets.pretty())
          .toArray(),
      },
    },
  },
})

export default loggerConfig

declare module '@adonisjs/core/types' {
  export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}

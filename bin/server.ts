/*
|--------------------------------------------------------------------------
| HTTP server entrypoint
|--------------------------------------------------------------------------
*/

import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error)
  console.trace(error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise)
  console.error('Reason:', reason)
  process.exit(1)
})

const APP_ROOT = new URL('../', import.meta.url)

const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')
    })
    app.listen('SIGTERM', () => app.terminate())
    app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
  })
  .httpServer()
  .start()
  .catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
  })

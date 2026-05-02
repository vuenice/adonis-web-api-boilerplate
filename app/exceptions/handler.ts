/*
|--------------------------------------------------------------------------
| Exception handler
|--------------------------------------------------------------------------
|
| Contract: URLs starting with /api are treated as the JSON API surface.
| Everything else is treated as the web surface and renders Edge HTML.
| Keep this in sync with how you prefix routes in start/routes/api.ts.
|
*/

import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class Handler extends ExceptionHandler {
  protected renderStatusPages = false

  async handle(error: any, ctx: HttpContext) {
    const isApiRoute = ctx.request.url().startsWith('/api')

    if (isApiRoute) {
      return this.handleApiError(error, ctx)
    }
    return this.handleWebError(error, ctx)
  }

  private async handleApiError(error: any, ctx: HttpContext) {
    const status = error.status || 500

    const validationDetails =
      (error && (error.messages || error.messagesTree || error.errors || error.issues)) || undefined

    const payload: Record<string, unknown> = {
      success: false,
      message: error.message,
      status,
      ...(validationDetails && { errors: validationDetails }),
      ...(app.inDev && {
        stack: error.stack,
        code: error.code,
      }),
    }

    return ctx.response.status(status).json(payload)
  }

  private async handleWebError(error: any, ctx: HttpContext) {
    const status = error.status || 500
    const { view } = ctx

    if (status === 404) {
      return view.render('pages/errors/not_found', { error })
    }

    if (status >= 500) {
      return view.render('pages/errors/server_error', { error })
    }

    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      code: (error as { code?: string })?.code,
      status: (error as { status?: number })?.status || 500,
      url: ctx.request.url(),
      method: ctx.request.method(),
      ip: ctx.request.ip(),
      body: ctx.request.body(),
      headers: ctx.request.headers(),
      timestamp: new Date().toISOString(),
    }

    logger.error(errorDetails, 'Unhandled exception occurred')

    if (app.inDev) {
      console.error('Error Details:', errorDetails)
    }

    return super.report(error, ctx)
  }
}

import { HttpContext } from '@adonisjs/core/http'

export default class HealthController {
  async index({ response }: HttpContext) {
    return response.ok({
      ok: true,
      surface: 'api',
    })
  }
}

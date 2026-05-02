import { HttpContext } from '@adonisjs/core/http'

export default class MeController {
  async index({ auth, response }: HttpContext) {
    const user = auth.user!
    return response.ok({
      id: user.id,
      email: user.email,
    })
  }
}

import { HttpContext } from '@adonisjs/core/http'

export default class WelcomeController {
  async index({ view }: HttpContext) {
    return view.render('welcome')
  }
}

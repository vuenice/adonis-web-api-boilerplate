import { HttpContext } from '@adonisjs/core/http'

/**
 * Minimal form POST to show Shield CSRF + session working on the web stack.
 */
export default class WebDemoController {
  async show({ view }: HttpContext) {
    return view.render('demo')
  }

  async store({ request, response, session }: HttpContext) {
    const note = request.input('note', '').trim()
    if (!note) {
      session.flash('error', 'Please enter a short note.')
      return response.redirect().back()
    }
    session.flash('notice', `Saved: ${note}`)
    return response.redirect().back()
  }
}

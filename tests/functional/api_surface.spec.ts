import { test } from '@japa/runner'

test.group('API surface', () => {
  test('GET /api/health returns JSON', async ({ client }) => {
    const response = await client.get('/api/health')
    response.assertStatus(200)
    const body = response.body()
    if (typeof body !== 'object' || body === null) {
      throw new Error('Expected JSON body')
    }
    if (!('ok' in body) || body.ok !== true) {
      throw new Error('Expected ok: true')
    }
  })

  test('GET /api/me returns 401 without bearer token', async ({ client }) => {
    const response = await client.get('/api/me')
    response.assertStatus(401)
  })
})

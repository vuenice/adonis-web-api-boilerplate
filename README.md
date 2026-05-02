# AdonisJS web + API boilerplate

Standalone **AdonisJS v6** app that serves **both** server-rendered web pages (Edge + Vite + Shield) **and** a JSON **`/api`** surface in one HTTP server.

This repo started from the structural patterns used in the parent project’s [`backend`](../backend) (dual routing, middleware split, exception handler), with all product-specific code removed.

## Prerequisites

- Node.js 18+
- MySQL **or** PostgreSQL (`DB_CONNECTION` in `.env`)

## Quick start

```bash
cd boilerplate
cp .env.example .env
# Set APP_KEY, DB_* in .env, then:
node ace generate:key
npm install
node ace migration:run
npm run dev
```

- **Web:** [http://127.0.0.1:3333/](http://127.0.0.1:3333/) — welcome page and `/demo` form (CSRF + session flash).
- **API:** `GET http://127.0.0.1:3333/api/health` — JSON `{ ok: true, surface: "api" }`.
- **Auth sample:** `GET /api/me` requires `Authorization: Bearer <access_token>` (`401` without a token).

## The `/api` prefix contract

**Convention:** every JSON/mobile/SPA endpoint should live under **`/api/...`.**

[`app/exceptions/handler.ts`](./app/exceptions/handler.ts) branches on:

```txt
request.url().startsWith('/api')
```

- **`/api*`** → JSON error payloads (validation, auth, etc.).
- **Everything else** → Edge HTML (`pages/errors/*` for common cases).

Keep new API routes prefixed with **`/api`** (see [`start/routes/api.ts`](./start/routes/api.ts)) so this stays consistent.

## Web vs API middleware

| Surface | Routes | Middleware on the route group | Why |
|---------|--------|------------------------------|-----|
| **Web** | No `/api` prefix | `shield()`, `static()`, `vite()` | Browser security (CSRF, CSP, framing, …), asset serving, Edge + Vite HMR |
| **API** | `prefix('/api')` | `cors()`, `forceJsonResponse()`, optional `auth()` | Cross-origin callers, consistent JSON validation/auth errors, bearer tokens |

[`start/kernel.ts`](./start/kernel.ts) explains three layers:

1. **`server.use`** — runs even when no route matches (e.g. CORS preflight).
2. **`router.use`** — session, bodyparser, `initialize_auth` for **matched** routes (forms need sessions; `/api` still needs auth initialized for Bearer parsing).
3. **Named middleware** — attached explicitly in [`start/routes/web.ts`](./start/routes/web.ts) vs [`start/routes/api.ts`](./start/routes/api.ts).

### Why Shield is only on web routes

**Shield** (especially **CSRF**) is aimed at cookie/session browser traffic. Mobile apps and typed JSON clients authenticate with **`Authorization: Bearer`** and should **not** go through CSRF expecting a form token.

This boilerplate attaches **Shield only** to the **web group** in [`start/routes/web.ts`](./start/routes/web.ts). All **`/api`** groups **omit Shield** deliberately.

### Why `forceJsonResponse` on `/api`

[`app/middleware/force_json_response_middleware.ts`](./app/middleware/force_json_response_middleware.ts) forces `Accept: application/json` so framework-level failures (e.g. validation) serialize as JSON on API routes instead of negotiated HTML/error pages.

## CORS and `ALLOWED_ORIGINS`

[`config/cors.ts`](./config/cors.ts) mirrors the parent backend: permissive localhost in development; in production supply **`ALLOWED_ORIGINS`** (comma-separated) when exposing the API to other browser origins (`credentials: true` is enabled).

## Auth model (API access tokens only)

[`config/auth.ts`](./config/auth.ts) configures a **`api`** guard as default using **Lucid access tokens** + [`User`](./app/models/user.ts).

To issue a token in development:

```bash
node ace repl
```

```txt
const { default: User } = await import('#models/user')
const u = await User.create({ email: 'dev@example.com' })
const token = await User.accessTokens.create(u)
console.log(token.value?.release())
```

Send `Authorization: Bearer <plaintext-from-release>` on `GET /api/me`.

**Optional next step:** if you need **logged-in browsers** with sessions, add a **`web`** session guard alongside the **`api`** token guard — not included here to keep this template small.

## Project layout (high signal)

```txt
start/routes.ts        # Imports web + api route modules only
start/routes/web.ts    # Browser / HTML
start/routes/api.ts    # /api JSON
app/exceptions/handler.ts
```

## Tests

Functional tests assume a valid `.env` and reachable database (`npm run test`). See [`tests/functional/api_surface.spec.ts`](./tests/functional/api_surface.spec.ts).

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | `node ace serve --hmr` |
| `npm run build` | Production build (+ copy `.env` into `build/`) |
| `npm run test` | Japa |

## Reference

Derived from structural patterns in [`../backend`](../backend): separate web route group vs `/api` groups, dual exception handling, token auth for APIs, Shield for web-only forms.

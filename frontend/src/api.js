/* Stateless API client.
 * Every endpoint here is either seed/reference data or pure computation —
 * user-mutated state lives in `store.js`. */
const BASE = '/api'

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return res.status === 204 ? null : res.json()
}

export const api = {
  // reference data
  usecases: () => req('/usecases'),
  dashboard: () => req('/dashboard'),
  circulars: () => req('/circulars'),
  calendarSeed: () => req('/calendar/seed'),
  orders: () => req('/orders'),
  policies: () => req('/policies'),
  sampleTrades: () => req('/proptrading/sample'),

  // pure computation
  kycScreen: (payload) =>
    req('/kyc/screen', { method: 'POST', body: JSON.stringify(payload) }),
  ordersChat: (question) =>
    req('/orders/chat', { method: 'POST', body: JSON.stringify({ question }) }),
  reconcile: (trades) =>
    req('/proptrading/reconcile', { method: 'POST', body: JSON.stringify({ trades }) }),
}

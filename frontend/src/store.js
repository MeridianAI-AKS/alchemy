/* ---------------------------------------------------------------------------
 * Client-side store for everything the user mutates.
 *
 * The API is deployed as stateless Vercel serverless functions, so it only
 * serves seed data and pure computation (screening, reconciliation, retrieval).
 * Anything the user changes — calendar tasks, checklists, screening history —
 * lives here and is persisted to localStorage so it survives reloads.
 * ------------------------------------------------------------------------- */
import { useSyncExternalStore } from 'react'

const KEY = 'alchemy-agentic-v1'

const EMPTY = {
  calendarSeeded: false,
  calendar: [],          // [{id,title,owner,due,status,priority,source,recurring}]
  circulars: {},         // circularId -> { reviewed, pushed }
  checklists: {},        // policyId  -> [{id,text,done}]
  kycHistory: [],        // [{name,band,score,at}]
  counters: { task: 2000, chk: 5000 },
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    /* private mode / blocked storage — fall through to defaults */
  }
  return { ...EMPTY }
}

let state = load()
const listeners = new Set()

function commit(next) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* over quota or blocked — keep working in memory */
  }
  listeners.forEach((l) => l())
}

export function subscribe(l) {
  listeners.add(l)
  return () => listeners.delete(l)
}
export const getState = () => state
export function useStore() {
  return useSyncExternalStore(subscribe, getState)
}

// --------------------------------------------------------------- helpers
const nextId = (kind, prefix) => {
  const n = state.counters[kind] + 1
  state = { ...state, counters: { ...state.counters, [kind]: n } }
  return `${prefix}-${n}`
}

/** Tasks are stored as Open/Done only; Overdue is derived at render time. */
export function displayStatus(task) {
  if (task.status === 'Done') return 'Done'
  return task.due < new Date().toISOString().slice(0, 10) ? 'Overdue' : 'Open'
}

// --------------------------------------------------------------- actions
export function seedCalendar(tasks) {
  if (state.calendarSeeded) return
  commit({ ...state, calendarSeeded: true, calendar: tasks.map((t) => ({ ...t })) })
}

export function addTasks(tasks) {
  const created = tasks.map((t) => ({ ...t, id: nextId('task', 'TSK') }))
  commit({ ...state, calendar: [...state.calendar, ...created] })
  return created
}

export function setTaskStatus(id, status) {
  commit({
    ...state,
    calendar: state.calendar.map((t) => (t.id === id ? { ...t, status } : t)),
  })
}

export function markCircular(id, patch) {
  commit({
    ...state,
    circulars: { ...state.circulars, [id]: { ...(state.circulars[id] || {}), ...patch } },
  })
}

export function generateChecklist(policyId, texts) {
  const items = texts.map((text) => ({ id: nextId('chk', 'CHK'), text, done: false }))
  commit({ ...state, checklists: { ...state.checklists, [policyId]: items } })
  return items
}

export function toggleChecklistItem(policyId, itemId, done) {
  const items = (state.checklists[policyId] || []).map((i) =>
    i.id === itemId ? { ...i, done } : i,
  )
  commit({ ...state, checklists: { ...state.checklists, [policyId]: items } })
}

export function pushKyc(entry) {
  commit({ ...state, kycHistory: [entry, ...state.kycHistory].slice(0, 25) })
}

export function resetDemo() {
  commit({ ...EMPTY })
}

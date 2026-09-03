import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Badge, PageHead } from '../components/ui.jsx'
import { displayStatus, seedCalendar, setTaskStatus, useStore } from '../store.js'

export default function ComplianceCalendar() {
  const { calendar, calendarSeeded } = useStore()
  const [filter, setFilter] = useState('All')
  const [err, setErr] = useState('')

  useEffect(() => {
    if (calendarSeeded) return
    api.calendarSeed().then(seedCalendar).catch((e) => setErr(String(e)))
  }, [calendarSeeded])

  const rows = calendar
    .map((t) => ({ ...t, view: displayStatus(t) }))
    .sort((a, b) => a.due.localeCompare(b.due))
  const shown = rows.filter((t) => filter === 'All' || t.view === filter)
  const count = (f) => rows.filter((t) => t.view === f).length

  if (err) return <div className="error">{err}</div>

  return (
    <>
      <PageHead title="Compliance Calendar & Alerts" uc="UC 1.1 / 2">
        A single tracked calendar of statutory deadlines and agent-generated actionables. Overdue items
        are flagged automatically; tasks pushed from Regulatory Change Monitoring land here with their
        source circular attached.
      </PageHead>

      <div className="row" style={{ marginBottom: 14 }}>
        {['All', 'Open', 'Overdue', 'Done'].map((f) => (
          <button key={f} className={f === filter ? '' : 'ghost'} onClick={() => setFilter(f)} style={{ flex: 'none' }}>
            {f} {f !== 'All' && `· ${count(f)}`}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="scroll-x">
          <table style={{ minWidth: 820 }}>
            <thead>
              <tr><th>Task</th><th>Owner</th><th>Due</th><th>Cadence</th><th>Source</th><th>Priority</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {shown.map((t) => (
                <tr key={t.id}>
                  <td><div className="mono">{t.id}</div>{t.title}</td>
                  <td>{t.owner}</td>
                  <td className="mono" style={{ color: t.view === 'Overdue' ? 'var(--high)' : undefined }}>{t.due}</td>
                  <td className="muted">{t.recurring}</td>
                  <td className="muted">{t.source}</td>
                  <td><Badge>{t.priority}</Badge></td>
                  <td><Badge>{t.view}</Badge></td>
                  <td>
                    <button className="ghost sm" onClick={() => setTaskStatus(t.id, t.status === 'Done' ? 'Open' : 'Done')}>
                      {t.status === 'Done' ? 'Reopen' : 'Mark done'}
                    </button>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={8} className="muted">No tasks in this view.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

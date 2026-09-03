import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Badge, PageHead } from '../components/ui.jsx'
import { addTasks, markCircular, seedCalendar, useStore } from '../store.js'

export default function RegulatoryMonitoring() {
  const { circulars: flags, calendarSeeded } = useStore()
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(null)
  const [flash, setFlash] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    api.circulars().then(setItems).catch((e) => setErr(String(e)))
    // Ensure the calendar is seeded before we push tasks into it.
    if (!calendarSeeded) api.calendarSeed().then(seedCalendar).catch(() => {})
  }, [calendarSeeded])

  function pushActionables(c) {
    const today = new Date()
    const created = addTasks(
      c.ai.suggested_actionables.map((s) => ({
        title: s.title,
        owner: s.owner,
        due: new Date(today.getTime() + s.days * 864e5).toISOString().slice(0, 10),
        status: 'Open',
        priority: c.ai.impact,
        source: `${c.regulator} ${c.id}`,
        recurring: 'One-off',
      })),
    )
    markCircular(c.id, { reviewed: true, pushed: true })
    setFlash(`${created.length} actionable(s) pushed to the Compliance Calendar.`)
  }

  if (err) return <div className="error">{err}</div>

  return (
    <>
      <PageHead title="Regulatory Change Monitoring" uc="UC 1.1">
        The monitoring agent ingests circulars from SEBI, IFSCA and other regulators, then
        auto-extracts category, obligation type, effective date, impacted policies and a plain-language
        summary. One click converts the AI-suggested actionables into tracked calendar tasks.
      </PageHead>

      {flash && (
        <div className="card" style={{ marginBottom: 14, borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' }}>
          {flash}
        </div>
      )}

      <div className="card">
        <div className="scroll-x">
          <table style={{ minWidth: 800 }}>
            <thead>
              <tr><th>Circular</th><th>Regulator</th><th>Published</th><th>AI category</th><th>Impact</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((c) => {
                const f = flags[c.id] || {}
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="mono">{c.id}</div>
                      <div style={{ maxWidth: 380 }}>{c.title}</div>
                    </td>
                    <td>{c.regulator}</td>
                    <td className="muted mono">{c.published}</td>
                    <td>{c.ai.category}<div className="muted" style={{ fontSize: 12 }}>{c.ai.obligation_type}</div></td>
                    <td><Badge>{c.ai.impact}</Badge></td>
                    <td>
                      {f.pushed ? <Badge kind="Done">Actionables sent</Badge>
                        : f.reviewed ? <Badge kind="Done">Reviewed</Badge>
                          : <Badge kind="Open">New</Badge>}
                    </td>
                    <td>
                      <button className="ghost sm" onClick={() => setOpen(open === c.id ? null : c.id)}>
                        {open === c.id ? 'Hide' : 'Analyse'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {open && (() => {
        const c = items.find((x) => x.id === open)
        if (!c) return null
        return (
          <div className="card" style={{ marginTop: 16 }}>
            <h3>{c.id} — Agent analysis</h3>
            <p className="muted" style={{ marginTop: 0 }}>
              Source excerpt: “{c.raw_excerpt}” ·{' '}
              <a href={c.source_url} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-blue)' }}>
                open source ↗
              </a>
            </p>
            <div className="grid cols-2">
              <div>
                <label>AI summary</label>
                <p>{c.ai.summary}</p>
                <label>Effective date</label>
                <p className="mono">{c.ai.effective_date}</p>
              </div>
              <div>
                <label>Impacted policies</label>
                <div className="pill-list">{c.ai.affected_policies.map((p) => <span className="chip" key={p}>{p}</span>)}</div>
                <div className="divider" />
                <label>Suggested actionables</label>
                <ul style={{ margin: '4px 0', paddingLeft: 18 }}>
                  {c.ai.suggested_actionables.map((s, i) => (
                    <li key={i}>{s.title} <span className="muted">— {s.owner}, due in {s.days}d</span></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="divider" />
            <button onClick={() => pushActionables(c)}>
              Generate actionables → Compliance Calendar
            </button>
          </div>
        )
      })()}
    </>
  )
}

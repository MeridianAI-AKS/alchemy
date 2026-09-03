import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { Badge, PageHead } from '../components/ui.jsx'
import { displayStatus, seedCalendar, useStore } from '../store.js'

const MODULE_ROUTE = {
  'regulatory-monitoring': '/regulatory-monitoring',
  calendar: '/calendar',
  kyc: '/kyc',
  orders: '/orders',
  checklists: '/checklists',
  'prop-trading': '/prop-trading',
}

export default function Dashboard() {
  const { calendar, calendarSeeded, circulars: flags, kycHistory } = useStore()
  const [stats, setStats] = useState(null)
  const [ucs, setUcs] = useState([])
  const [err, setErr] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    Promise.all([api.dashboard(), api.usecases()])
      .then(([d, u]) => { setStats(d); setUcs(u) })
      .catch((e) => setErr(String(e)))
    if (!calendarSeeded) api.calendarSeed().then(seedCalendar).catch(() => {})
  }, [calendarSeeded])

  if (err) {
    return (
      <div className="error">
        API unreachable: {err}
        <br />Start it with <code className="mono">uvicorn api.index:app --port 8123</code>
      </div>
    )
  }
  if (!stats) return <div className="spinner">Loading…</div>

  const views = calendar.map(displayStatus)
  const countBy = (v) => views.filter((x) => x === v).length
  const pending = stats.circulars_total - Object.values(flags).filter((f) => f.reviewed).length

  const kpis = [
    { n: stats.use_case_total, l: 'Use cases in BRD' },
    { n: stats.live_modules.length, l: 'Modules live in prototype' },
    { n: pending, l: 'Circulars pending review' },
    { n: countBy('Overdue'), l: 'Calendar tasks overdue' },
  ]

  return (
    <>
      <PageHead title="Programme Dashboard" uc="Overview">
        Consolidated view of the Alchemy Capital AI Agentic Automation programme — 24 use cases
        across Compliance, Legal, Secretarial, Marketing, Products and Portal. Seven high-value
        workflows are interactive in this prototype.
      </PageHead>

      <div className="grid cols-4" style={{ marginBottom: 18 }}>
        {kpis.map((k) => (
          <div className="card kpi" key={k.l}>
            <div className="n">{k.n}</div>
            <div className="l">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="grid cols-2" style={{ marginBottom: 18 }}>
        <div className="card">
          <h3>Calendar status</h3>
          <table>
            <tbody>
              {['Open', 'Overdue', 'Done'].map((s) => (
                <tr key={s}>
                  <td><Badge>{s}</Badge></td>
                  <td style={{ textAlign: 'right' }}>{countBy(s)}</td>
                </tr>
              ))}
              <tr>
                <td className="muted">Screenings run this session</td>
                <td style={{ textAlign: 'right' }}>{kycHistory.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Use cases by function</h3>
          <table>
            <tbody>
              {Object.entries(stats.use_cases_by_function).map(([k, v]) => (
                <tr key={k}><td>{k}</td><td style={{ textAlign: 'right' }}>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>BRD use-case register</h3>
        <div className="scroll-x">
          <table style={{ minWidth: 860 }}>
            <thead>
              <tr><th>#</th><th>Function</th><th>Use case</th><th>Frequency</th><th>Priority</th><th>Impact</th><th>Prototype</th></tr>
            </thead>
            <tbody>
              {ucs.map((u) => (
                <tr key={u.sl}
                    style={{ cursor: u.module ? 'pointer' : 'default' }}
                    onClick={() => u.module && nav(MODULE_ROUTE[u.module])}>
                  <td className="mono">{u.sl}</td>
                  <td>{u.function}</td>
                  <td>{u.name}<div className="muted" style={{ fontSize: 12 }}>{u.benefit}</div></td>
                  <td className="muted">{u.frequency}</td>
                  <td><Badge>{u.priority}</Badge></td>
                  <td><Badge>{u.impact}</Badge></td>
                  <td>{u.module
                    ? <span className="chip" style={{ color: 'var(--brand-blue)' }}>Live ›</span>
                    : <span className="muted">Roadmap</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

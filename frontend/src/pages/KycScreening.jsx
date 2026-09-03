import { useState } from 'react'
import { api } from '../api.js'
import { Badge, PageHead } from '../components/ui.jsx'
import { pushKyc, useStore } from '../store.js'

const ENTITY_TYPES = ['Resident Individual', 'Non-Resident Individual', 'Corporate – Domestic',
  'Corporate – Foreign', 'Trust', 'Complex Entity']
const COUNTRIES = ['India', 'United Kingdom', 'United States', 'UAE', 'Singapore', 'Mauritius', 'Russia', 'Iran']

export default function KycScreening() {
  const { kycHistory: hist } = useStore()
  const [form, setForm] = useState({ name: '', entity_type: ENTITY_TYPES[0], country: 'India', pan: '' })
  const [report, setReport] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function run(e) {
    e.preventDefault()
    setBusy(true); setErr(''); setReport(null)
    try {
      const r = await api.kycScreen(form)
      setReport(r)
      pushKyc({ name: r.subject.name, band: r.risk_band, score: r.risk_score, at: r.screened_at })
    } catch (e2) { setErr(String(e2)) } finally { setBusy(false) }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <>
      <PageHead title="KYC / AML / World-Check Automation" uc="UC 1.3">
        Account-opening screening agent. Enter a prospective client; the agent runs a fuzzy
        World-Check / sanctions / PEP / adverse-media match, scores risk, and produces a one-pager
        with an EDD checklist and a recommended decision. Try names like
        <em> Rajesh Malhotra</em>, <em> Sunrise Global Trading</em> or <em> Anil Verma</em>.
      </PageHead>

      <div className="grid cols-2">
        <div className="card">
          <h3>Screening request</h3>
          <form onSubmit={run}>
            <div className="field">
              <label>Full legal name</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Rajesh Kumar Malhotra" required />
            </div>
            <div className="row">
              <div className="field">
                <label>Entity type</label>
                <select value={form.entity_type} onChange={set('entity_type')}>
                  {ENTITY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Country of residence / incorporation</label>
                <select value={form.country} onChange={set('country')}>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label>PAN (optional)</label>
              <input value={form.pan} onChange={set('pan')} placeholder="ABCDE1234F" />
            </div>
            <button disabled={busy}>{busy ? 'Screening…' : 'Run screening'}</button>
          </form>
          {err && <p className="error">{err}</p>}
        </div>

        <div className="card">
          <h3>Recent screenings</h3>
          {hist.length === 0 && <p className="muted">No screenings yet this session.</p>}
          <table>
            <tbody>
              {hist.map((h, i) => (
                <tr key={i}>
                  <td>{h.name}</td>
                  <td><Badge>{h.band}</Badge></td>
                  <td className="mono">{h.score}</td>
                  <td className="muted" style={{ fontSize: 11 }}>{h.at.replace('T', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {report && (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3>Client risk one-pager — {report.subject.name}</h3>
            <div>Risk score <strong style={{ fontSize: 20 }}>{report.risk_score}</strong> / 100 &nbsp; <Badge>{report.risk_band}</Badge></div>
          </div>
          <p><strong style={{ color: 'var(--accent-2)' }}>Recommended action:</strong> {report.recommended_action}</p>

          <div className="grid cols-2">
            <div>
              <label>Subject</label>
              <table><tbody>
                <tr><td className="muted">Entity type</td><td>{report.subject.entity_type}</td></tr>
                <tr><td className="muted">Country</td><td>{report.subject.country}</td></tr>
                <tr><td className="muted">PAN</td><td className="mono">{report.subject.pan}</td></tr>
                <tr><td className="muted">Screened at</td><td className="mono">{report.screened_at.replace('T', ' ')}</td></tr>
              </tbody></table>

              <label style={{ marginTop: 12 }}>Risk drivers</label>
              <ul style={{ paddingLeft: 18, margin: '4px 0' }}>
                {report.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
            <div>
              <label>Watchlist matches</label>
              {report.matches.length === 0 && <p className="muted">No matches at or above threshold.</p>}
              {report.matches.map((m, i) => (
                <div key={i} className="card" style={{ background: 'var(--surface-2)', marginBottom: 8, padding: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{m.list_name}</strong>
                    <span><Badge kind={m.category === 'Sanctions' ? 'High' : m.category === 'PEP' ? 'Medium' : 'Low'}>{m.category}</Badge> <span className="mono">{m.match_score}</span></span>
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{m.note}</div>
                </div>
              ))}

              <label style={{ marginTop: 12 }}>Due-diligence checklist</label>
              <ul style={{ paddingLeft: 18, margin: '4px 0' }}>
                {report.edd_checklist.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

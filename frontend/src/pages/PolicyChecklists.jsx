import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { PageHead } from '../components/ui.jsx'
import { generateChecklist, toggleChecklistItem, useStore } from '../store.js'

export default function PolicyChecklists() {
  const { checklists } = useStore()
  const [policies, setPolicies] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => { api.policies().then(setPolicies).catch((e) => setErr(String(e))) }, [])

  const active = policies.find((p) => p.id === activeId)
  const items = activeId ? checklists[activeId] || [] : []
  const doneCount = items.filter((i) => i.done).length

  if (err) return <div className="error">{err}</div>

  return (
    <>
      <PageHead title="Policy Actionables & Checklists" uc="UC 1.8">
        The agent decomposes each policy into a concrete, trackable compliance checklist. Confirm items as
        they are met to close audit gaps and evidence implementation-in-practice.
      </PageHead>

      <div className="grid cols-2">
        <div className="card">
          <h3>Policies</h3>
          <table>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}<div className="muted" style={{ fontSize: 12 }}>{p.version}</div></td>
                  <td style={{ textAlign: 'right' }}>
                    {checklists[p.id]
                      ? <button className="ghost sm" onClick={() => setActiveId(p.id)}>Open</button>
                      : (
                        <button className="sm" onClick={() => { generateChecklist(p.id, p.checklist); setActiveId(p.id) }}>
                          Generate
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          {!active && <p className="muted">Select or generate a checklist.</p>}
          {active && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3>{active.name}</h3>
                <span className="muted">{doneCount}/{items.length} confirmed</span>
              </div>
              <div className="bar" style={{ margin: '8px 0 16px' }}>
                <i style={{ width: `${items.length ? (doneCount / items.length) * 100 : 0}%` }} />
              </div>
              {items.map((it) => (
                <label key={it.id} className={`check${it.done ? ' done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={it.done}
                    onChange={() => toggleChecklistItem(active.id, it.id, !it.done)}
                  />
                  <span>{it.text}</span>
                </label>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}

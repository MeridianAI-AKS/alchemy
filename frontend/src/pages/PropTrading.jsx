import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Badge, PageHead } from '../components/ui.jsx'

const BLANK = { id: '', book: 'Proprietary', symbol: '', side: 'BUY', qty: 0, price: 0, ts: '' }

export default function PropTrading() {
  const [rows, setRows] = useState([])
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => { api.sampleTrades().then(setRows).catch((e) => setErr(String(e))) }, [])

  const upd = (i, k) => (e) => {
    const v = ['qty', 'price'].includes(k) ? Number(e.target.value) : e.target.value
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)))
  }
  const addRow = () => setRows((r) => [...r, { ...BLANK, id: `T-${r.length + 1}`, ts: '2025-08-01T09:30' }])
  const delRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i))

  async function run() {
    setBusy(true); setErr(''); setResult(null)
    try {
      const payload = rows.map((r) => ({ ...r, ts: r.ts.length === 16 ? r.ts + ':00' : r.ts }))
      setResult(await api.reconcile(payload))
    } catch (e) { setErr(String(e)) } finally { setBusy(false) }
  }

  return (
    <>
      <PageHead title="Proprietary Trading — Exception Reports" uc="UC 1.9">
        Automated reconciliation of the proprietary book against client trades from fund accounting.
        The agent checks the proprietary-trading policy rules: contra-trade timing restrictions,
        same-side sequencing (front-running), and conflicting same-day positions.
      </PageHead>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3>Trade blotter</h3>
          <div className="row" style={{ flex: 'none', gap: 8 }}>
            <button className="ghost sm" onClick={addRow}>+ Row</button>
            <button className="sm" disabled={busy || rows.length === 0} onClick={run}>{busy ? 'Reconciling…' : 'Run reconciliation'}</button>
          </div>
        </div>
        <div className="scroll-x">
          <table style={{ minWidth: 860 }}>
            <thead>
              <tr><th>ID</th><th>Book</th><th>Symbol</th><th>Side</th><th>Qty</th><th>Price</th><th>Timestamp</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td><input value={r.id} onChange={upd(i, 'id')} style={{ width: 72 }} /></td>
                  <td><select value={r.book} onChange={upd(i, 'book')} style={{ width: 122 }}><option>Proprietary</option><option>Client</option></select></td>
                  <td><input value={r.symbol} onChange={upd(i, 'symbol')} style={{ width: 108 }} /></td>
                  <td><select value={r.side} onChange={upd(i, 'side')} style={{ width: 86 }}><option>BUY</option><option>SELL</option></select></td>
                  <td><input type="number" value={r.qty} onChange={upd(i, 'qty')} style={{ width: 80 }} /></td>
                  <td><input type="number" value={r.price} onChange={upd(i, 'price')} style={{ width: 92 }} /></td>
                  <td><input type="datetime-local" value={r.ts.slice(0, 16)} onChange={upd(i, 'ts')} style={{ width: 196 }} /></td>
                  <td><button className="ghost sm" onClick={() => delRow(i)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {err && <p className="error">{err}</p>}
      </div>

      {result && (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3>Exception report</h3>
            <Badge kind={result.summary.exceptions ? 'High' : 'Low'}>{result.summary.status}</Badge>
          </div>
          <div className="grid cols-4" style={{ margin: '8px 0 14px' }}>
            {[
              ['Total trades', result.summary.total_trades],
              ['Proprietary', result.summary.proprietary],
              ['Client', result.summary.client],
              ['High-severity', result.summary.high],
            ].map(([l, n]) => (
              <div className="card kpi" key={l} style={{ background: 'var(--surface-2)' }}>
                <div className="n">{n}</div><div className="l">{l}</div>
              </div>
            ))}
          </div>

          {result.exceptions.length === 0 && <p className="muted">No policy exceptions detected.</p>}
          {result.exceptions.map((e, i) => (
            <div key={i} className="card" style={{ background: 'var(--surface-2)', marginBottom: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{e.rule}</strong>
                <span><Badge kind={e.severity}>{e.severity}</Badge> <span className="chip">{e.symbol}</span></span>
              </div>
              <div style={{ fontSize: 13, marginTop: 6 }}>{e.detail}</div>
              <div className="cite">Trades: {e.trades.join(', ')}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

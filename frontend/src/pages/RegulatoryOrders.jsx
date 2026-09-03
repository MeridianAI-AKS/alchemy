import { useEffect, useRef, useState } from 'react'
import { api } from '../api.js'
import { PageHead } from '../components/ui.jsx'

const SUGGESTED = [
  'What have SEBI orders said about conflict of interest for portfolio managers?',
  'Any penalties for weak AML or KYC controls?',
  'Show orders about employee / personal trading violations',
  'What went wrong with marketing performance claims?',
]

export default function RegulatoryOrders() {
  const [orders, setOrders] = useState([])
  const [msgs, setMsgs] = useState([
    { role: 'bot', text: 'Ask me about the indexed SEBI orders — conflict of interest, AML/KYC, insider/personal trading, or marketing compliance.' },
  ])
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { api.orders().then(setOrders).catch(() => {}) }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function ask(text) {
    const question = (text ?? q).trim()
    if (!question || busy) return
    setMsgs((m) => [...m, { role: 'user', text: question }])
    setQ(''); setBusy(true)
    try {
      const r = await api.ordersChat(question)
      setMsgs((m) => [...m, { role: 'bot', text: r.answer, citations: r.citations }])
    } catch (e) {
      setMsgs((m) => [...m, { role: 'bot', text: 'Error: ' + e }])
    } finally { setBusy(false) }
  }

  return (
    <>
      <PageHead title="Regulatory Orders & Knowledge Management" uc="UC 1.4">
        AI summaries of lengthy SEBI orders plus a conversational interface over the case knowledge
        base — penalties, regulations cited, and the practical takeaway for Alchemy.
      </PageHead>

      <div className="grid cols-2">
        <div className="card">
          <h3>Conversational query</h3>
          <div className="chat">
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <span dangerouslySetInnerHTML={{ __html: fmt(m.text) }} />
                {m.citations?.length > 0 && (
                  <div className="cite">Sources: {m.citations.map((c) => `${c.id} (${c.penalty})`).join(' · ')}</div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="divider" />
          <div className="row">
            <input value={q} onChange={(e) => setQ(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && ask()}
                   placeholder="Ask about a SEBI order…" style={{ flex: 3 }} />
            <button onClick={() => ask()} disabled={busy} style={{ flex: 'none', minWidth: 76 }}>{busy ? '…' : 'Ask'}</button>
          </div>
          <div className="pill-list" style={{ marginTop: 10 }}>
            {SUGGESTED.map((s) => <span key={s} className="chip" style={{ cursor: 'pointer' }} onClick={() => ask(s)}>{s}</span>)}
          </div>
        </div>

        <div className="card">
          <h3>Indexed orders ({orders.length})</h3>
          {orders.map((o) => (
            <div key={o.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong className="mono">{o.id}</strong>
                <span className="muted">{o.date}</span>
              </div>
              <div>{o.title}</div>
              <div className="muted" style={{ fontSize: 12 }}>{o.entity} · {o.regulation} · Penalty {o.penalty}</div>
              <p style={{ fontSize: 13, margin: '6px 0' }}>{o.summary}</p>
              <div className="pill-list">{o.keywords.map((k) => <span key={k} className="chip">{k}</span>)}</div>
              <div className="divider" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function fmt(t) {
  return String(t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

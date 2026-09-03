export function Badge({ kind, children }) {
  const map = {
    High: 'b-high', Medium: 'b-med', Low: 'b-low',
    Open: 'b-open', Done: 'b-done', Overdue: 'b-over',
  }
  return <span className={`badge ${map[children] || map[kind] || 'b-open'}`}>{children}</span>
}

export function PageHead({ title, uc, children }) {
  return (
    <div className="page-head">
      {uc && <div className="eyebrow">{uc}</div>}
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  )
}

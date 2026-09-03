import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Wordmark } from './components/Logo.jsx'
import { resetDemo } from './store.js'
import Dashboard from './pages/Dashboard.jsx'
import RegulatoryMonitoring from './pages/RegulatoryMonitoring.jsx'
import ComplianceCalendar from './pages/ComplianceCalendar.jsx'
import KycScreening from './pages/KycScreening.jsx'
import RegulatoryOrders from './pages/RegulatoryOrders.jsx'
import PolicyChecklists from './pages/PolicyChecklists.jsx'
import PropTrading from './pages/PropTrading.jsx'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', uc: '00' },
  { to: '/regulatory-monitoring', label: 'Regulatory Change Monitoring', uc: '1.1' },
  { to: '/calendar', label: 'Compliance Calendar & Alerts', uc: '1.2' },
  { to: '/kyc', label: 'KYC / AML / World-Check', uc: '1.3' },
  { to: '/orders', label: 'Regulatory Orders & Knowledge', uc: '1.4' },
  { to: '/checklists', label: 'Policy Actionables & Checklists', uc: '1.8' },
  { to: '/prop-trading', label: 'Prop Trading Exception Reports', uc: '1.9' },
]

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <Wordmark />

        <div className="client-strip">
          <div className="ring">A</div>
          <div className="who">
            <b>Alchemy Capital</b>
            <span>Client workspace</span>
          </div>
        </div>

        <div className="nav-label">Agents</div>
        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="label">{n.label}</span>
              <span className="uc">{n.uc}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="live-pill"><i />agents online</div>
          <div>Prototype · BRD v2 (Oct-2025)</div>
          <div>Synthetic data · rule-based agents</div>
          <button
            className="ghost sm"
            style={{ marginTop: 10, width: '100%' }}
            onClick={() => { resetDemo(); window.location.reload() }}
          >
            Reset demo data
          </button>
        </div>
      </aside>

      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/regulatory-monitoring" element={<RegulatoryMonitoring />} />
          <Route path="/calendar" element={<ComplianceCalendar />} />
          <Route path="/kyc" element={<KycScreening />} />
          <Route path="/orders" element={<RegulatoryOrders />} />
          <Route path="/checklists" element={<PolicyChecklists />} />
          <Route path="/prop-trading" element={<PropTrading />} />
        </Routes>
      </main>
    </div>
  )
}

import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--kf-canvas)' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg px-4 py-3" style={{ backgroundColor: 'var(--kf-panel)' }}>
        <div className="container-fluid">
          <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" to="/">
            <span style={{ color: 'var(--kf-orange)' }}>KF</span> KitchenFlow Pro
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link to="/login" className="btn btn-kf-primary">Staff Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="container text-center py-5 my-5">
        <span className="badge px-3 py-2 mb-3" style={{ backgroundColor: 'var(--kf-orange-soft)', color: 'var(--kf-orange)', fontSize: '14px' }}>
          Solo-Developer Semester Edition
        </span>
        <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--kf-ink)' }}>
          Modern Culinary Operations & Kitchen Intelligence
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '680px' }}>
          Connect dine-in ordering, preparation station queues, inventory movements, and cash billing with our distinctive <strong>Kitchen Rush Predictor</strong>.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button onClick={() => navigate('/login')} className="btn btn-kf-primary btn-lg px-4">
            Enter Staff Portal
          </button>
          <a href="#features" className="btn btn-kf-secondary btn-lg px-4">
            Explore Features
          </a>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: 'var(--kf-canvas)' }}>
      <div className="kf-card" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1" style={{ color: 'var(--kf-ink)' }}>KitchenFlow <span style={{ color: 'var(--kf-orange)' }}>Pro</span></h2>
          <p className="text-muted small">Sign in to your operational workspace</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); navigate('/app'); }}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Email Address</label>
            <input type="email" className="form-control" defaultValue="manager@kitchenflow.local" required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold small">Password</label>
            <input type="password" className="form-control" defaultValue="Password123!" required />
          </div>
          <button type="submit" className="btn btn-kf-primary w-100 py-2">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function AppShell({ children }) {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--kf-panel)', color: '#fff' }} className="p-3 d-flex flex-column">
        <div className="mb-4 px-2">
          <h4 className="fw-bold m-0" style={{ color: '#fff' }}>
            KF <span style={{ color: 'var(--kf-orange)' }}>KitchenFlow</span>
          </h4>
          <span className="badge bg-secondary mt-1">Manager Workspace</span>
        </div>
        <nav className="nav flex-column gap-1 flex-grow-1">
          <Link className="nav-link text-white-50 px-2 py-2 rounded" to="/app">Dashboard</Link>
          <Link className="nav-link text-white-50 px-2 py-2 rounded" to="/app/tables">Tables & Floor</Link>
          <Link className="nav-link text-white-50 px-2 py-2 rounded" to="/app/pos">POS Order</Link>
          <Link className="nav-link text-white-50 px-2 py-2 rounded" to="/app/kitchen">Kitchen Display</Link>
          <Link className="nav-link text-white-50 px-2 py-2 rounded" to="/app/rush">Rush Predictor</Link>
          <Link className="nav-link text-white-50 px-2 py-2 rounded" to="/app/menu">Menu & Catalog</Link>
          <Link className="nav-link text-white-50 px-2 py-2 rounded" to="/app/inventory">Inventory</Link>
          <Link className="nav-link text-white-50 px-2 py-2 rounded" to="/app/billing">Billing</Link>
          <Link className="nav-link text-white-50 px-2 py-2 rounded" to="/app/reports">Reports</Link>
        </nav>
        <div className="pt-3 border-top border-secondary">
          <Link to="/" className="btn btn-sm btn-outline-light w-100">Sign Out</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4" style={{ backgroundColor: 'var(--kf-canvas)' }}>
        {children}
      </main>
    </div>
  );
}

function DashboardPage() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Restaurant Overview</h2>
          <small className="text-muted">Today &bull; Live operational metrics</small>
        </div>
        <span className="badge" style={{ backgroundColor: 'var(--kf-orange-soft)', color: 'var(--kf-orange)' }}>
          System Online
        </span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="kf-card">
            <small className="text-muted text-uppercase fw-bold">Live Orders</small>
            <h3 className="fw-bold my-1">12</h3>
            <span className="kf-badge kf-badge-preparing">4 in prep</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="kf-card">
            <small className="text-muted text-uppercase fw-bold">Today Sales</small>
            <h3 className="fw-bold my-1">Rs 41,250</h3>
            <span className="kf-badge kf-badge-paid">34 orders paid</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="kf-card">
            <small className="text-muted text-uppercase fw-bold">Tables Occupied</small>
            <h3 className="fw-bold my-1">8 / 12</h3>
            <span className="text-muted small">66% utilization</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="kf-card">
            <small className="text-muted text-uppercase fw-bold">Kitchen Bottlenecks</small>
            <h3 className="fw-bold my-1" style={{ color: 'var(--kf-danger)' }}>1 Alert</h3>
            <span className="kf-badge kf-badge-cancelled">Grill at peak</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app/*" element={<AppShell><DashboardPage /></AppShell>} />
    </Routes>
  );
}

import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './app/AuthContext';
import ProtectedRoute from './app/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import TablesPage from './features/tables/TablesPage';
import PosPage from './features/pos/PosPage';
import OrdersPage from './features/orders/OrdersPage';
import StaffPage from './features/staff/StaffPage';
import ThreeDCanvas from './components/ThreeDCanvas';
import {
  LayoutDashboard,
  Grid,
  ShoppingBag,
  ChefHat,
  Zap,
  BookOpen,
  Boxes,
  Receipt,
  BarChart3,
  LogOut,
  UtensilsCrossed,
  User,
  Users,
} from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--kf-canvas)', overflowX: 'hidden' }}>
      {/* Navbar with Glassmorphism */}
      <nav
        className="navbar navbar-expand-lg px-4 py-3 sticky-top"
        style={{
          backgroundColor: 'rgba(27, 35, 48, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container-fluid max-w-7xl">
          <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" to="/">
            <div
              className="p-2 rounded-3 d-flex align-items-center justify-content-center"
              style={{ backgroundColor: 'var(--kf-orange)' }}
            >
              <UtensilsCrossed size={18} color="#fff" />
            </div>
            <span className="fs-5">
              KitchenFlow <span style={{ color: 'var(--kf-orange)' }}>Pro</span>
            </span>
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link to="/login" className="btn btn-kf-primary">
              Enter Staff Workspace
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Interactive 3D Cloche */}
      <div className="container py-5 my-4">
        <div className="row align-items-center g-5">
          {/* Left Hero Text */}
          <div className="col-lg-6">
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 shadow-sm"
              style={{
                backgroundColor: 'var(--kf-orange-soft)',
                color: 'var(--kf-orange)',
                fontSize: '12.5px',
                fontWeight: 600,
              }}
            >
              <span
                className="d-inline-block rounded-circle"
                style={{ width: '8px', height: '8px', backgroundColor: 'var(--kf-orange)' }}
              />
              Full-Stack Semester Build &bull; Interactive 3D Platform
            </div>

            <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--kf-ink)', lineHeight: 1.15 }}>
              Smart Culinary Operations &amp;{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #f58237 0%, #d9480f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Kitchen Intelligence
              </span>
            </h1>

            <p className="lead text-muted mb-4" style={{ fontSize: '16px', lineHeight: 1.6 }}>
              Connect live table occupancy, preparation station queues, real-time POS ordering, and cash billing with our distinctive <strong>Kitchen Rush Predictor</strong>.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-5">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-kf-primary btn-lg px-4 shadow"
              >
                Open Staff Workspace
              </button>
              <button
                onClick={() => navigate('/app/pos?type=TAKEAWAY')}
                className="btn btn-kf-secondary btn-lg px-4"
              >
                Launch POS Demo
              </button>
            </div>

            {/* Quick Live Indicators */}
            <div className="row g-3">
              <div className="col-4">
                <div className="kf-card kf-3d-tilt p-3 text-center border-0 shadow-sm">
                  <h4 className="fw-bold m-0" style={{ color: 'var(--kf-orange)' }}>12</h4>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Smart Tables</small>
                </div>
              </div>
              <div className="col-4">
                <div className="kf-card kf-3d-tilt p-3 text-center border-0 shadow-sm">
                  <h4 className="fw-bold m-0" style={{ color: 'var(--kf-success)' }}>4</h4>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Prep Stations</small>
                </div>
              </div>
              <div className="col-4">
                <div className="kf-card kf-3d-tilt p-3 text-center border-0 shadow-sm">
                  <h4 className="fw-bold m-0 text-primary">FIFO</h4>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Rush Simulation</small>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero: Interactive 3D WebGL Canvas */}
          <div className="col-lg-6 text-center">
            <div
              className="position-relative p-2 rounded-4 shadow-lg animate-float"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
              }}
            >
              <div
                className="position-absolute top-0 start-50 translate-middle-x mt-3 px-3 py-1 rounded-pill small"
                style={{
                  backgroundColor: 'rgba(27, 35, 48, 0.85)',
                  color: '#fff',
                  fontSize: '11px',
                  zIndex: 10,
                }}
              >
                ✨ Interactive 3D Cloche &bull; Move mouse to rotate
              </div>
              <ThreeDCanvas style={{ height: '380px' }} />
            </div>
          </div>
        </div>

        {/* 3D Features Showcase */}
        <div className="mt-5 pt-5 border-top">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Designed for High-Volume Dining</h2>
            <p className="text-muted">A connected multi-workspace restaurant operating system</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="kf-card kf-3d-tilt h-100 p-4 border-0 shadow-sm">
                <div
                  className="p-3 rounded-3 d-inline-block mb-3"
                  style={{ backgroundColor: 'var(--kf-orange-soft)' }}
                >
                  <Grid size={24} color="var(--kf-orange)" />
                </div>
                <h5 className="fw-bold mb-2">Interactive 3D Floor Plan</h5>
                <p className="text-muted small">
                  Switch between 2D standard view and architectural 3D isometric layout with live occupancy status for every table.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="kf-card kf-3d-tilt h-100 p-4 border-0 shadow-sm">
                <div
                  className="p-3 rounded-3 d-inline-block mb-3"
                  style={{ backgroundColor: '#e6f6f4' }}
                >
                  <ChefHat size={24} color="var(--kf-success)" />
                </div>
                <h5 className="fw-bold mb-2">Multi-Station Kitchen KDS</h5>
                <p className="text-muted small">
                  Segregates burger, pizza, fryer, and beverage tickets to designated preparation stations with live elapsed timers.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="kf-card kf-3d-tilt h-100 p-4 border-0 shadow-sm">
                <div
                  className="p-3 rounded-3 d-inline-block mb-3"
                  style={{ backgroundColor: '#e7f5ff' }}
                >
                  <Zap size={24} color="#1971c2" />
                </div>
                <h5 className="fw-bold mb-2">Kitchen Rush Predictor</h5>
                <p className="text-muted small">
                  Deterministic multi-slot FIFO capacity engine simulating bottlenecks and ETA clearance without altering live database records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/app', icon: LayoutDashboard, roles: ['manager', 'waiter', 'cashier'] },
    { label: 'Tables & Floor', path: '/app/tables', icon: Grid, roles: ['manager', 'waiter'] },
    { label: 'POS Order', path: '/app/pos', icon: ShoppingBag, roles: ['manager', 'waiter'] },
    { label: 'Orders List', path: '/app/orders', icon: Receipt, roles: ['manager', 'waiter', 'cashier', 'kitchen'] },
    { label: 'Kitchen Display', path: '/app/kitchen', icon: ChefHat, roles: ['manager', 'kitchen'] },
    { label: 'Rush Predictor', path: '/app/rush', icon: Zap, roles: ['manager'] },
    { label: 'Menu Catalog', path: '/app/menu', icon: BookOpen, roles: ['manager'] },
    { label: 'Staff Management', path: '/app/staff', icon: Users, roles: ['manager'] },
    { label: 'Inventory', path: '/app/inventory', icon: Boxes, roles: ['manager'] },
    { label: 'Billing', path: '/app/billing', icon: Receipt, roles: ['manager', 'cashier'] },
    { label: 'Reports', path: '/app/reports', icon: BarChart3, roles: ['manager'] },
  ];

  const allowedNav = navItems.filter((item) => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{ width: '250px', backgroundColor: 'var(--kf-panel)', color: '#fff' }}
        className="p-3 d-flex flex-column"
      >
        <div className="mb-4 px-2 d-flex align-items-center gap-2">
          <UtensilsCrossed size={24} color="var(--kf-orange)" />
          <div>
            <h5 className="fw-bold m-0" style={{ color: '#fff', letterSpacing: '-0.5px' }}>
              KitchenFlow <span style={{ color: 'var(--kf-orange)' }}>Pro</span>
            </h5>
            <span
              className="badge text-uppercase"
              style={{
                backgroundColor: 'rgba(245, 130, 55, 0.2)',
                color: 'var(--kf-orange)',
                fontSize: '10px',
              }}
            >
              {user?.role} workspace
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav flex-column gap-1 flex-grow-1">
          {allowedNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                className="nav-link px-3 py-2 rounded d-flex align-items-center gap-2"
                to={item.path}
                style={{
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: isActive ? 'var(--kf-orange)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '13.5px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="pt-3 border-top border-secondary">
          <div className="d-flex align-items-center gap-2 mb-2 px-2 text-white-50 small">
            <User size={16} />
            <div className="text-truncate">
              <div className="fw-bold text-white small">{user?.name}</div>
              <div style={{ fontSize: '11px' }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline-light w-100 d-flex align-items-center justify-content-center gap-1"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 p-4" style={{ backgroundColor: 'var(--kf-canvas)', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Restaurant Overview</h2>
          <small className="text-muted">Today &bull; Live operational metrics</small>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => navigate('/app/tables')} className="btn btn-kf-primary btn-sm">
            Floor Plan & Tables
          </button>
          <button onClick={() => navigate('/app/pos?type=TAKEAWAY')} className="btn btn-kf-secondary btn-sm">
            Takeaway POS
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="kf-card">
            <small className="text-muted text-uppercase fw-bold">Live Orders</small>
            <h3 className="fw-bold my-1">Connected</h3>
            <span className="kf-badge kf-badge-preparing">Active MySQL DB</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="kf-card">
            <small className="text-muted text-uppercase fw-bold">Floor Capacity</small>
            <h3 className="fw-bold my-1">12 Tables</h3>
            <span className="kf-badge kf-badge-ready">Ready for Dine-in</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="kf-card">
            <small className="text-muted text-uppercase fw-bold">Kitchen Stations</small>
            <h3 className="fw-bold my-1">4 Active</h3>
            <span className="text-muted small">Grill, Oven, Fryer, Drinks</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="kf-card">
            <small className="text-muted text-uppercase fw-bold">Rush Predictor</small>
            <h3 className="fw-bold my-1" style={{ color: 'var(--kf-orange)' }}>Phase 4</h3>
            <span className="kf-badge kf-badge-queued">Deterministic Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated Application */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/app"
            element={
              <AppShell>
                <DashboardPage />
              </AppShell>
            }
          />
          <Route
            path="/app/tables"
            element={
              <AppShell>
                <TablesPage />
              </AppShell>
            }
          />
          <Route
            path="/app/pos"
            element={
              <AppShell>
                <PosPage />
              </AppShell>
            }
          />
          <Route
            path="/app/orders"
            element={
              <AppShell>
                <OrdersPage />
              </AppShell>
            }
          />
          <Route
            path="/app/staff"
            element={
              <AppShell>
                <StaffPage />
              </AppShell>
            }
          />
          {/* Phase 3 & 4 routes */}
          <Route
            path="/app/kitchen"
            element={
              <AppShell>
                <div className="kf-card p-5 text-center">
                  <ChefHat size={48} color="var(--kf-orange)" className="mb-2" />
                  <h4>Kitchen Display System (KDS)</h4>
                  <p className="text-muted">Coming in Phase 3 — Station-specific tickets, item advancement, and timers.</p>
                </div>
              </AppShell>
            }
          />
          <Route
            path="/app/rush"
            element={
              <AppShell>
                <div className="kf-card p-5 text-center">
                  <Zap size={48} color="var(--kf-orange)" className="mb-2" />
                  <h4>Kitchen Rush Predictor</h4>
                  <p className="text-muted">Coming in Phase 4 — Deterministic multi-slot FIFO queue simulation.</p>
                </div>
              </AppShell>
            }
          />
          <Route
            path="/app/menu"
            element={
              <AppShell>
                <div className="kf-card p-5 text-center">
                  <BookOpen size={48} color="var(--kf-orange)" className="mb-2" />
                  <h4>Menu & Station Management</h4>
                  <p className="text-muted">Manage dishes, categories, and prep station allocations.</p>
                </div>
              </AppShell>
            }
          />
          <Route
            path="/app/inventory"
            element={
              <AppShell>
                <div className="kf-card p-5 text-center">
                  <Boxes size={48} color="var(--kf-orange)" className="mb-2" />
                  <h4>Inventory & Recipe Ledger</h4>
                  <p className="text-muted">Coming in Phase 6 — Stock levels and consumption transactions.</p>
                </div>
              </AppShell>
            }
          />
          <Route
            path="/app/billing"
            element={
              <AppShell>
                <div className="kf-card p-5 text-center">
                  <Receipt size={48} color="var(--kf-orange)" className="mb-2" />
                  <h4>Billing & Cash Settlements</h4>
                  <p className="text-muted">Coming in Phase 5 — Unpaid order settling and printable receipts.</p>
                </div>
              </AppShell>
            }
          />
          <Route
            path="/app/reports"
            element={
              <AppShell>
                <div className="kf-card p-5 text-center">
                  <BarChart3 size={48} color="var(--kf-orange)" className="mb-2" />
                  <h4>Manager Reports & Analytics</h4>
                  <p className="text-muted">Coming in Phase 5 — Sales metrics, station throughput, and top dishes.</p>
                </div>
              </AppShell>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

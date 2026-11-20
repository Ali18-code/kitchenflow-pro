import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './app/AuthContext';
import ProtectedRoute from './app/ProtectedRoute';
import AppShell from './app/layout/AppShell';

// Features
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ProductsPage from './features/products/ProductsPage';
import InventoryPage from './features/inventory/InventoryPage';
import SalesPage from './features/sales/SalesPage';
import SuppliersPage from './features/suppliers/SuppliersPage';
import PurchasesPage from './features/purchases/PurchasesPage';
import ForecastPage from './features/forecast/ForecastPage';
import ReportsPage from './features/reports/ReportsPage';
import SettingsPage from './features/settings/SettingsPage';

import {
  Package,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Boxes,
  Database,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--sp-cloud)', fontFamily: 'var(--font-sans)', color: 'var(--sp-slate)' }}>
      {/* Top Navbar */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 2.5rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--sp-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--sp-radius-sm)',
              backgroundColor: 'var(--sp-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={20} color="#FFFFFF" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--sp-slate)' }}>
            Stock<span style={{ color: 'var(--sp-emerald)' }}>Pilot</span>
          </span>
        </div>
        <div>
          {user ? (
            <Link
              to="/app/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                backgroundColor: 'var(--sp-emerald)',
                color: '#FFFFFF',
                borderRadius: 'var(--sp-radius-sm)',
                fontWeight: '600',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Open Workspace <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                backgroundColor: 'var(--sp-midnight)',
                color: '#FFFFFF',
                borderRadius: 'var(--sp-radius-sm)',
                fontWeight: '600',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Sign In <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: '1100px', margin: '4rem auto 3rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--sp-emerald-soft)',
            color: 'var(--sp-emerald)',
            fontSize: '0.8125rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
          }}
        >
          <Zap size={14} /> Full-Stack Master Blueprint (React + NestJS + MySQL)
        </div>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: '800',
            lineHeight: 1.15,
            color: 'var(--sp-midnight)',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
          }}
        >
          What Should the Business <br />
          <span style={{ color: 'var(--sp-emerald)' }}>Do Next?</span>
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--sp-slate-light)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6,
          }}
        >
          StockPilot connects products, sales, and procurement with transaction-safe stock deductions and the <strong>Forecast Studio</strong>: an explainable what-if reorder simulator backed by transparent arithmetic.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '0.875rem 1.75rem',
              backgroundColor: 'var(--sp-emerald)',
              color: '#FFFFFF',
              borderRadius: 'var(--sp-radius-sm)',
              fontWeight: '700',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            Launch Live Demo <ArrowRight size={18} />
          </button>
          <a
            href="https://github.com/Ali18-code/stockpilot"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '0.875rem 1.75rem',
              backgroundColor: '#FFFFFF',
              color: 'var(--sp-slate)',
              border: '1px solid var(--sp-border)',
              borderRadius: 'var(--sp-radius-sm)',
              fontWeight: '600',
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            GitHub Repository
          </a>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 4rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--sp-radius-md)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-shadow-subtle)' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--sp-cloud)', color: 'var(--sp-emerald)', borderRadius: 'var(--sp-radius-sm)', width: 'fit-content', marginBottom: '1rem' }}>
            <Sliders size={22} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>Explainable Forecast Studio</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--sp-slate-light)', margin: 0, lineHeight: 1.5 }}>
            Interactive what-if demand simulation slider. Replaces opaque AI with auditable mathematical reorder recommendations and one-click PO prefilling.
          </p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--sp-radius-md)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-shadow-subtle)' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--sp-cloud)', color: 'var(--sp-info)', borderRadius: 'var(--sp-radius-sm)', width: 'fit-content', marginBottom: '1rem' }}>
            <Database size={22} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>Zero Negative Stock Invariant</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--sp-slate-light)', margin: 0, lineHeight: 1.5 }}>
            Atomic conditional database updates guarantee inventory never dips below zero even under simultaneous concurrent checkouts.
          </p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--sp-radius-md)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-shadow-subtle)' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--sp-cloud)', color: 'var(--sp-caution)', borderRadius: 'var(--sp-radius-sm)', width: 'fit-content', marginBottom: '1rem' }}>
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>Strict Role Governance</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--sp-slate-light)', margin: 0, lineHeight: 1.5 }}>
            Backend-enforced roles (Admin, Inventory Manager, Sales Staff) with immutable stock movements and audit log tracing.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated Application Workspace */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  DollarSign,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ShoppingCart,
  FilePlus,
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();

  // Illustrative initial contract metrics matching blueprint Section 06 & 08
  const kpis = [
    { label: 'Active Products', value: '248', change: '+12 this month', icon: Boxes, color: 'var(--sp-info)' },
    { label: 'Stock Valuation', value: 'Rs 1,840,500', change: 'Cost × On-Hand', icon: DollarSign, color: 'var(--sp-emerald)' },
    { label: 'Low-Stock SKUs', value: '12', change: 'Below Reorder Point', icon: AlertTriangle, color: 'var(--sp-caution)' },
    { label: 'Pending POs', value: '7', change: 'Submitted / Partial', icon: Clock, color: 'var(--sp-slate-light)' },
  ];

  const atRiskQueue = [
    { sku: 'CAB-USB4-01', name: 'USB-C Thunderbolt 4 Cable 1m', onHand: 18, reorderPoint: 45, daysLeft: 3, risk: 'CRITICAL' },
    { sku: 'PWR-ADP-25W', name: 'Fast Charger 25W Type-C', onHand: 24, reorderPoint: 50, daysLeft: 5, risk: 'REORDER_NOW' },
    { sku: 'ACC-MOU-PAD', name: 'Ergonomic Desk Mat Mouse Pad', onHand: 12, reorderPoint: 25, daysLeft: 7, risk: 'REORDER_NOW' },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Title & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: '0 0 0.25rem 0' }}>
            Operations Overview
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            Real-time inventory levels, sales velocity, and procurement decision support.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/app/sales')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              backgroundColor: 'var(--sp-emerald)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--sp-radius-sm)',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <ShoppingCart size={16} /> Record Sale
          </button>
          <button
            onClick={() => navigate('/app/forecast')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              backgroundColor: 'var(--sp-midnight)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--sp-radius-sm)',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <TrendingUp size={16} /> Open Forecast Studio
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.25rem',
                borderRadius: 'var(--sp-radius-md)',
                border: '1px solid var(--sp-border)',
                boxShadow: 'var(--sp-shadow-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--sp-slate-light)' }}>{kpi.label}</span>
                <div style={{ padding: '0.375rem', borderRadius: 'var(--sp-radius-sm)', backgroundColor: 'var(--sp-cloud)', color: kpi.color }}>
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--sp-slate)', marginBottom: '0.25rem' }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)' }}>{kpi.change}</div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: At-Risk Queue & Quick Simulator Shortcut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Urgent Stockout Risk Queue */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--sp-radius-md)',
            border: '1px solid var(--sp-border)',
            boxShadow: 'var(--sp-shadow-subtle)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--sp-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: 'var(--sp-slate)' }}>
              Stockout Risk Queue (Urgent Reorders)
            </h3>
            <button
              onClick={() => navigate('/app/forecast')}
              style={{ background: 'none', border: 'none', color: 'var(--sp-emerald)', fontSize: '0.8125rem', fontWeight: '600', cursor: 'pointer' }}
            >
              View in Forecast Studio →
            </button>
          </div>
          <div style={{ padding: '1rem' }}>
            {atRiskQueue.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem',
                  borderRadius: 'var(--sp-radius-sm)',
                  backgroundColor: idx % 2 === 0 ? 'var(--sp-cloud)' : '#FFFFFF',
                  marginBottom: '0.5rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--sp-slate)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)' }}>SKU: {item.sku} • On Hand: {item.onHand} units</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      backgroundColor: item.risk === 'CRITICAL' ? 'var(--sp-danger-bg)' : 'var(--sp-caution-bg)',
                      color: item.risk === 'CRITICAL' ? 'var(--sp-danger)' : 'var(--sp-caution)',
                    }}
                  >
                    {item.daysLeft} days left
                  </span>
                  <button
                    onClick={() => navigate('/app/forecast')}
                    style={{
                      padding: '0.375rem 0.625rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--sp-border)',
                      borderRadius: 'var(--sp-radius-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    Simulate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Rules Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--sp-radius-md)',
            border: '1px solid var(--sp-border)',
            boxShadow: 'var(--sp-shadow-subtle)',
            padding: '1.25rem',
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: 'var(--sp-slate)' }}>
            Core System Invariants
          </h3>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <strong style={{ color: 'var(--sp-slate)' }}>Zero Negative Stock:</strong> Atomic database update aborts sales if on-hand is insufficient.
            </li>
            <li>
              <strong style={{ color: 'var(--sp-slate)' }}>Dual-Write Ledger:</strong> Every unit change creates an immutable <code style={{ backgroundColor: 'var(--sp-cloud)', padding: '2px 4px' }}>stock_movements</code> entry.
            </li>
            <li>
              <strong style={{ color: 'var(--sp-slate)' }}>Explainable Forecast:</strong> Transparent 14-day sales moving average with user demand what-if sliders.
            </li>
            <li>
              <strong style={{ color: 'var(--sp-slate)' }}>Idempotent Receiving:</strong> Unique receipt keys prevent duplicate stock additions on retry.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

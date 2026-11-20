import React from 'react';
import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: '0 0 0.25rem 0' }}>
            Reports & Business Intelligence
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            Sales revenue trends, product velocity rankings, and CSV audit exports.
          </p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            backgroundColor: 'var(--sp-midnight)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--sp-radius-sm)',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <Download size={16} /> Export CSV Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--sp-radius-md)',
            border: '1px solid var(--sp-border)',
            boxShadow: 'var(--sp-shadow-subtle)',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--sp-slate)', margin: '0 0 1rem 0' }}>
            Top Selling SKUs (Last 30 Days)
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--sp-border)', fontSize: '0.875rem' }}>
              <span>USB4 40Gbps Type-C Cable</span>
              <strong style={{ color: 'var(--sp-slate)' }}>186 units sold</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--sp-border)', fontSize: '0.875rem' }}>
              <span>Fast Charger 25W Type-C</span>
              <strong style={{ color: 'var(--sp-slate)' }}>142 units sold</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span>Ergonomic Desk Mat Mouse Pad</span>
              <strong style={{ color: 'var(--sp-slate)' }}>89 units sold</strong>
            </li>
          </ul>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--sp-radius-md)',
            border: '1px solid var(--sp-border)',
            boxShadow: 'var(--sp-shadow-subtle)',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--sp-slate)', margin: '0 0 1rem 0' }}>
            Inventory Valuation Metrics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)' }}>Total Cost of Inventory On Hand</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--sp-slate)' }}>Rs 1,840,500</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)' }}>Projected Retail Valuation</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--sp-emerald)' }}>Rs 3,420,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

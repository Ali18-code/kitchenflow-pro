import React, { useState } from 'react';
import { Layers, Plus, History, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function InventoryPage() {
  const movements = [
    { id: 101, sku: 'CAB-USB4-01', name: 'USB4 40Gbps Type-C Cable', delta: -2, type: 'SALE_OUT', ref: 'SAL-2026-0042', actor: 'Sales Staff', time: '10 mins ago' },
    { id: 100, sku: 'CAB-USB4-01', name: 'USB4 40Gbps Type-C Cable', delta: +40, type: 'PURCHASE_IN', ref: 'PO-2026-0012', actor: 'Inventory Manager', time: '2 hours ago' },
    { id: 99, sku: 'PWR-ADP-25W', name: 'Fast Charger 25W Type-C', delta: -1, type: 'ADJUST_OUT', ref: 'ADJ-2026-0003', actor: 'Admin', reason: 'Damaged packaging', time: '1 day ago' },
    { id: 98, sku: 'ACC-MOU-PAD', name: 'Ergonomic Desk Mat Mouse Pad', delta: +25, type: 'OPENING_IN', ref: 'INIT-2026', actor: 'Admin', time: '3 days ago' },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: '0 0 0.25rem 0' }}>
            Inventory Ledger & Movements
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            Immutable, audit-proof history of every stock increase, deduction, and manual adjustment.
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
          <Plus size={16} /> Adjust Stock (Reason Required)
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--sp-radius-md)',
          border: '1px solid var(--sp-border)',
          boxShadow: 'var(--sp-shadow-subtle)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--sp-border)', fontWeight: '600', color: 'var(--sp-slate)' }}>
          Recent Stock Movements (<code style={{ backgroundColor: 'var(--sp-cloud)', padding: '2px 4px' }}>stock_movements</code>)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--sp-cloud)', borderBottom: '1px solid var(--sp-border)', textAlign: 'left', color: 'var(--sp-slate-light)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Movement Type</th>
              <th style={{ padding: '0.75rem 1rem' }}>Product / SKU</th>
              <th style={{ padding: '0.75rem 1rem' }}>Delta</th>
              <th style={{ padding: '0.75rem 1rem' }}>Reference</th>
              <th style={{ padding: '0.75rem 1rem' }}>Actor</th>
              <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--sp-border)' }}>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      backgroundColor: m.delta > 0 ? 'var(--sp-success-bg)' : 'var(--sp-danger-bg)',
                      color: m.delta > 0 ? 'var(--sp-success)' : 'var(--sp-danger)',
                    }}
                  >
                    {m.type}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--sp-slate)' }}>
                  <div style={{ fontWeight: '600' }}>{m.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)' }}>{m.sku}</div>
                </td>
                <td style={{ padding: '1rem', fontWeight: '700', color: m.delta > 0 ? 'var(--sp-success)' : 'var(--sp-danger)' }}>
                  {m.delta > 0 ? `+${m.delta}` : m.delta}
                </td>
                <td style={{ padding: '1rem', color: 'var(--sp-slate-light)' }}>{m.ref}</td>
                <td style={{ padding: '1rem', color: 'var(--sp-slate)' }}>{m.actor}</td>
                <td style={{ padding: '1rem', color: 'var(--sp-slate-light)' }}>{m.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

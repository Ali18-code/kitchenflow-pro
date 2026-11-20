import React, { useState } from 'react';
import { FileSpreadsheet, Plus, CheckCircle, Clock, Truck } from 'lucide-react';

export default function PurchasesPage() {
  const purchaseOrders = [
    {
      id: 12,
      poNumber: 'PO-2026-0012',
      supplier: 'Global Tech Logistics',
      itemsCount: 2,
      totalCost: 1450.0,
      orderedUnits: 140,
      receivedUnits: 40,
      status: 'PARTIALLY RECEIVED',
      expectedDate: '2026-11-25',
    },
    {
      id: 11,
      poNumber: 'PO-2026-0011',
      supplier: 'Apex Component Works',
      itemsCount: 1,
      totalCost: 850.0,
      orderedUnits: 100,
      receivedUnits: 0,
      status: 'SUBMITTED',
      expectedDate: '2026-11-28',
    },
    {
      id: 10,
      poNumber: 'PO-2026-0010',
      supplier: 'Shenzhen Fast Cables Ltd',
      itemsCount: 4,
      totalCost: 3200.0,
      orderedUnits: 300,
      receivedUnits: 300,
      status: 'RECEIVED',
      expectedDate: '2026-11-15',
    },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: '0 0 0.25rem 0' }}>
            Purchase Orders & Stock Receiving
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            Track procurement lifecycle from draft quotes through partial shipments to final inventory receipt.
          </p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            backgroundColor: 'var(--sp-emerald)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--sp-radius-sm)',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Create Purchase Order
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
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--sp-cloud)', borderBottom: '1px solid var(--sp-border)', textAlign: 'left', color: 'var(--sp-slate-light)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>PO Number</th>
              <th style={{ padding: '0.75rem 1rem' }}>Supplier</th>
              <th style={{ padding: '0.75rem 1rem' }}>Progress (Units)</th>
              <th style={{ padding: '0.75rem 1rem' }}>Total Cost</th>
              <th style={{ padding: '0.75rem 1rem' }}>Expected Arrival</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po) => {
              let badgeBg = 'var(--sp-cloud)';
              let badgeColor = 'var(--sp-slate)';
              if (po.status === 'RECEIVED') {
                badgeBg = 'var(--sp-success-bg)';
                badgeColor = 'var(--sp-success)';
              } else if (po.status === 'PARTIALLY RECEIVED') {
                badgeBg = 'var(--sp-caution-bg)';
                badgeColor = 'var(--sp-caution)';
              } else if (po.status === 'SUBMITTED') {
                badgeBg = 'var(--sp-info-bg)';
                badgeColor = 'var(--sp-info)';
              }

              return (
                <tr key={po.id} style={{ borderBottom: '1px solid var(--sp-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--sp-slate)' }}>{po.poNumber}</td>
                  <td style={{ padding: '1rem', color: 'var(--sp-slate)' }}>{po.supplier}</td>
                  <td style={{ padding: '1rem', color: 'var(--sp-slate)' }}>
                    {po.receivedUnits} / {po.orderedUnits} units ({Math.round((po.receivedUnits / po.orderedUnits) * 100)}%)
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--sp-slate)' }}>
                    Rs {po.totalCost.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--sp-slate-light)' }}>{po.expectedDate}</td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: badgeBg,
                        color: badgeColor,
                      }}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {po.status !== 'RECEIVED' && (
                      <button
                        style={{
                          padding: '0.375rem 0.75rem',
                          backgroundColor: 'var(--sp-emerald)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 'var(--sp-radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Receive Units
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

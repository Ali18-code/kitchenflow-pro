import React, { useState } from 'react';
import { Boxes, Plus, Search, Filter } from 'lucide-react';

export default function ProductsPage() {
  const [search, setSearch] = useState('');

  const products = [
    { id: 42, sku: 'CAB-USB4-01', name: 'USB4 40Gbps Type-C Cable 1m', category: 'Cables', costPrice: 12.0, sellPrice: 24.99, onHand: 120, reorderLevel: 25, status: 'Active' },
    { id: 43, sku: 'PWR-ADP-25W', name: 'Fast Charger 25W Type-C Adapter', category: 'Power', costPrice: 8.5, sellPrice: 19.99, onHand: 24, reorderLevel: 50, status: 'Active' },
    { id: 44, sku: 'ACC-MOU-PAD', name: 'Ergonomic Desk Mat Mouse Pad', category: 'Accessories', costPrice: 4.0, sellPrice: 14.99, onHand: 12, reorderLevel: 20, status: 'Active' },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: '0 0 0.25rem 0' }}>
            Product Catalog
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            Manage SKUs, category taxonomy, selling prices, and minimum reorder thresholds.
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
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--sp-radius-md)',
          border: '1px solid var(--sp-border)',
          boxShadow: 'var(--sp-shadow-subtle)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--sp-border)', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sp-slate-light)' }} />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                border: '1px solid var(--sp-border)',
                borderRadius: 'var(--sp-radius-sm)',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--sp-cloud)', borderBottom: '1px solid var(--sp-border)', textAlign: 'left', color: 'var(--sp-slate-light)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>SKU</th>
              <th style={{ padding: '0.75rem 1rem' }}>Product Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Category</th>
              <th style={{ padding: '0.75rem 1rem' }}>Cost Price</th>
              <th style={{ padding: '0.75rem 1rem' }}>Sell Price</th>
              <th style={{ padding: '0.75rem 1rem' }}>On Hand</th>
              <th style={{ padding: '0.75rem 1rem' }}>Reorder Level</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--sp-border)' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--sp-slate)' }}>{p.sku}</td>
                <td style={{ padding: '1rem', color: 'var(--sp-slate)' }}>{p.name}</td>
                <td style={{ padding: '1rem', color: 'var(--sp-slate-light)' }}>{p.category}</td>
                <td style={{ padding: '1rem', color: 'var(--sp-slate)' }}>Rs {p.costPrice.toFixed(2)}</td>
                <td style={{ padding: '1rem', color: 'var(--sp-slate)' }}>Rs {p.sellPrice.toFixed(2)}</td>
                <td style={{ padding: '1rem', fontWeight: '700', color: p.onHand <= p.reorderLevel ? 'var(--sp-danger)' : 'var(--sp-slate)' }}>
                  {p.onHand} units
                </td>
                <td style={{ padding: '1rem', color: 'var(--sp-slate-light)' }}>{p.reorderLevel} units</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'var(--sp-emerald-soft)', color: 'var(--sp-emerald)' }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

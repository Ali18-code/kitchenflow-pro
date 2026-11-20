import React from 'react';
import { Truck, Plus, Mail, Phone, Calendar } from 'lucide-react';

export default function SuppliersPage() {
  const suppliers = [
    { id: 1, name: 'Global Tech Logistics', email: 'orders@gtl-supplies.com', phone: '+1-555-0199', defaultLeadDays: 7, activeProducts: 14, status: 'Active' },
    { id: 2, name: 'Apex Component Works', email: 'sales@apexcomp.io', phone: '+1-555-0248', defaultLeadDays: 5, activeProducts: 8, status: 'Active' },
    { id: 3, name: 'Shenzhen Fast Cables Ltd', email: 'b2b@szfastcable.cn', phone: '+86-755-882109', defaultLeadDays: 14, activeProducts: 32, status: 'Active' },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: '0 0 0.25rem 0' }}>
            Suppliers & Vendors
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            Vendor catalogs, quoted unit costs, lead times, and preferred vendor links.
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
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {suppliers.map((s) => (
          <div
            key={s.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--sp-radius-md)',
              border: '1px solid var(--sp-border)',
              boxShadow: 'var(--sp-shadow-subtle)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontWeight: '700', fontSize: '1.125rem', color: 'var(--sp-slate)' }}>{s.name}</div>
              <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'var(--sp-emerald-soft)', color: 'var(--sp-emerald)' }}>
                {s.status}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--sp-slate-light)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} /> <span>{s.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} /> <span>{s.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} /> <span>Default Lead: <strong>{s.defaultLeadDays} days</strong></span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--sp-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--sp-slate-light)' }}>Linked SKUs: <strong>{s.activeProducts}</strong></span>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--sp-emerald)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                View Linked Products →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

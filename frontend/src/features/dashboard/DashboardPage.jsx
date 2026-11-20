import React from 'react';
import { useAuth } from '../../app/AuthContext';
import { Boxes, ShieldCheck, UserCheck, Layers } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--sp-slate)', margin: '0 0 0.5rem 0' }}>
          Welcome back, {user?.name}
        </h1>
        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--sp-slate-light)' }}>
          Active Role: <strong>{user?.role}</strong> • Phase 1 Foundation Verified.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--sp-radius-md)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-shadow-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--sp-radius-sm)', backgroundColor: 'var(--sp-emerald-soft)', color: 'var(--sp-emerald)' }}>
              <ShieldCheck size={20} />
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--sp-slate)' }}>RBAC Enforced</div>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)', lineHeight: 1.5 }}>
            Backend Passport JWT strategies and NestJS Role Guards actively secure all protected resources.
          </p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--sp-radius-md)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-shadow-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--sp-radius-sm)', backgroundColor: 'var(--sp-info-bg)', color: 'var(--sp-info)' }}>
              <UserCheck size={20} />
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--sp-slate)' }}>3 Demo Roles Active</div>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)', lineHeight: 1.5 }}>
            Admin, Inventory Manager, and Sales Staff accounts are seeded and ready for role verification.
          </p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--sp-radius-md)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-shadow-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--sp-radius-sm)', backgroundColor: 'var(--sp-caution-bg)', color: 'var(--sp-caution)' }}>
              <Layers size={20} />
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--sp-slate)' }}>Next Up: Phase 2</div>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)', lineHeight: 1.5 }}>
            Product Catalog, Categories, Suppliers directory, and Opening Stock ledger transactions.
          </p>
        </div>
      </div>
    </div>
  );
}

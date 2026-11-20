import React from 'react';
import { Settings, Users, Shield, Plus, Lock } from 'lucide-react';

export default function SettingsPage() {
  const users = [
    { id: 1, name: 'Admin Operator', email: 'admin@stockpilot.local', role: 'ADMIN', status: 'Active' },
    { id: 2, name: 'Tariq Mehmood', email: 'manager@stockpilot.local', role: 'INVENTORY_MANAGER', status: 'Active' },
    { id: 3, name: 'Zeeshan Ali', email: 'sales@stockpilot.local', role: 'SALES_STAFF', status: 'Active' },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: '0 0 0.25rem 0' }}>
            User Management & System Access
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            Admin-controlled staff directory, role assignments, and authentication security guards.
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
          <Plus size={16} /> Create User Account
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
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--sp-border)', fontWeight: '600', color: 'var(--sp-slate)' }}>
          Active Staff Directory (<code style={{ backgroundColor: 'var(--sp-cloud)', padding: '2px 4px' }}>users</code>)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--sp-cloud)', borderBottom: '1px solid var(--sp-border)', textAlign: 'left', color: 'var(--sp-slate-light)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>User ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>Staff Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Email</th>
              <th style={{ padding: '0.75rem 1rem' }}>Assigned Role</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--sp-border)' }}>
                <td style={{ padding: '1rem', color: 'var(--sp-slate-light)' }}>#{u.id}</td>
                <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--sp-slate)' }}>{u.name}</td>
                <td style={{ padding: '1rem', color: 'var(--sp-slate-light)' }}>{u.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      backgroundColor: u.role === 'ADMIN' ? 'var(--sp-info-bg)' : 'var(--sp-cloud)',
                      color: u.role === 'ADMIN' ? 'var(--sp-info)' : 'var(--sp-slate)',
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'var(--sp-emerald-soft)', color: 'var(--sp-emerald)' }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button
                    style={{
                      padding: '0.375rem 0.625rem',
                      fontSize: '0.75rem',
                      border: '1px solid var(--sp-border)',
                      borderRadius: 'var(--sp-radius-sm)',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Edit Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

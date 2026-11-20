import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { Users, Plus, ShieldCheck, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await authService.getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users list');
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: '0 0 0.25rem 0' }}>
            Staff & User Management
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            Admin-only management of system accounts and role authorization levels.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--sp-danger-bg)', color: 'var(--sp-danger)', borderRadius: 'var(--sp-radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--sp-radius-md)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-shadow-subtle)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--sp-border)', fontWeight: '600', color: 'var(--sp-slate)' }}>
          Active Accounts in Database
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--sp-slate-light)', fontSize: '0.875rem' }}>
            Loading users...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--sp-cloud)', borderBottom: '1px solid var(--sp-border)', textAlign: 'left', color: 'var(--sp-slate-light)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
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
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

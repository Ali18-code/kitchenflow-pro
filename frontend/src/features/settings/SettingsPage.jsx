import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import PasswordStrengthMeter, { checkPasswordStrength } from '../../components/PasswordStrengthMeter';
import {
  Users,
  Plus,
  ShieldCheck,
  AlertCircle,
  X,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function SettingsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('SALES_STAFF');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formTouched, setFormTouched] = useState({ name: false, email: false, password: false });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadUsers = async () => {
    try {
      const data = await authService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Validation Rules
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isNameValid = name.trim().length >= 2;
  const isEmailValid = emailRegex.test(email.trim());
  const { isSatisfied: isPasswordStrong } = checkPasswordStrength(password);
  const isCreateFormValid = isNameValid && isEmailValid && isPasswordStrong;

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormTouched({ name: true, email: true, password: true });

    if (!isCreateFormValid) {
      return;
    }

    setModalError('');
    setModalSubmitting(true);
    try {
      await authService.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        password,
      });

      setSuccessMsg(`User '${name.trim()}' created successfully!`);
      setShowModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setFormTouched({ name: false, email: false, password: false });
      await loadUsers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create user. Please check inputs.');
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: '0 0 0.25rem 0' }}>
            Staff & User Management
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            Admin-controlled directory, role assignments, and authentication security guards.
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setModalError('');
          }}
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
          <Plus size={16} /> Create Staff Account
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--sp-success-bg)', color: 'var(--sp-success)', border: '1px solid #A7F3D0', borderRadius: 'var(--sp-radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--sp-danger-bg)', color: 'var(--sp-danger)', borderRadius: 'var(--sp-radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Staff Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--sp-radius-md)', border: '1px solid var(--sp-border)', boxShadow: 'var(--sp-shadow-subtle)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--sp-border)', fontWeight: '600', color: 'var(--sp-slate)' }}>
          Active Accounts in Database (<code style={{ backgroundColor: 'var(--sp-cloud)', padding: '2px 4px' }}>users</code>)
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--sp-slate-light)', fontSize: '0.875rem' }}>
            Loading users...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--sp-cloud)', borderBottom: '1px solid var(--sp-border)', textAlign: 'left', color: 'var(--sp-slate-light)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Staff Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Assigned Role</th>
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

      {/* Modal: Create Staff Account with Live Password Strength Checker */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(11, 22, 40, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--sp-radius-md)',
              width: '100%',
              maxWidth: '500px',
              boxShadow: 'var(--sp-shadow-elevated)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--sp-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: '700', fontSize: '1.125rem', color: 'var(--sp-slate)' }}>
                Create New Staff Account
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sp-slate-light)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateUser} style={{ padding: '1.5rem' }} noValidate>
              {modalError && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--sp-danger-bg)', color: 'var(--sp-danger)', borderRadius: 'var(--sp-radius-sm)', marginBottom: '1rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Full Name */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--sp-slate)' }}>Full Name</label>
                  {formTouched.name && !isNameValid && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--sp-danger)' }}>At least 2 characters</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Asad Rauf"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setFormTouched((prev) => ({ ...prev, name: true }))}
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: `1px solid ${formTouched.name && !isNameValid ? 'var(--sp-danger)' : 'var(--sp-border)'}`,
                    borderRadius: 'var(--sp-radius-sm)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Work Email */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--sp-slate)' }}>Work Email</label>
                  {formTouched.email && !isEmailValid && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--sp-danger)' }}>Valid email required</span>
                  )}
                </div>
                <input
                  type="email"
                  placeholder="asad@stockpilot.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setFormTouched((prev) => ({ ...prev, email: true }))}
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: `1px solid ${formTouched.email && !isEmailValid ? 'var(--sp-danger)' : 'var(--sp-border)'}`,
                    borderRadius: 'var(--sp-radius-sm)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Assigned Role */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--sp-slate)', marginBottom: '0.375rem' }}>
                  Assigned RBAC Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: '1px solid var(--sp-border)',
                    borderRadius: 'var(--sp-radius-sm)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="SALES_STAFF">Sales Staff (POS & Sales only)</option>
                  <option value="INVENTORY_MANAGER">Inventory Manager (Catalog, POs, Adjustments, Forecast)</option>
                  <option value="ADMIN">Admin (Full System & User Governance)</option>
                </select>
              </div>

              {/* Password with Live Strength Checker */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--sp-slate)' }}>Password</label>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setFormTouched((prev) => ({ ...prev, password: true }))}
                    style={{
                      width: '100%',
                      padding: '0.625rem 2.5rem 0.625rem 0.75rem',
                      border: '1px solid var(--sp-border)',
                      borderRadius: 'var(--sp-radius-sm)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sp-slate-light)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Live Password Strength Meter with 5-point Checklist */}
                <PasswordStrengthMeter password={password} showCriteria={true} />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--sp-border)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.625rem 1rem',
                    border: '1px solid var(--sp-border)',
                    borderRadius: 'var(--sp-radius-sm)',
                    background: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'var(--sp-slate)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting || !isCreateFormValid}
                  style={{
                    padding: '0.625rem 1.25rem',
                    backgroundColor: 'var(--sp-emerald)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--sp-radius-sm)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: modalSubmitting || !isCreateFormValid ? 'not-allowed' : 'pointer',
                    opacity: modalSubmitting || !isCreateFormValid ? 0.6 : 1,
                  }}
                >
                  {modalSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

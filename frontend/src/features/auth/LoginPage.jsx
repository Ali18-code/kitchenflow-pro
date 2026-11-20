import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { Package, Lock, Mail, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@stockpilot.local');
  const [password, setPassword] = useState('Admin123!');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setError('');
    setSubmitting(true);
    try {
      const user = await login(email.trim(), password);
      if (user.role === 'SALES_STAFF') {
        navigate('/app/sales');
      } else {
        navigate('/app/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please verify credentials.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--sp-cloud)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--sp-radius-md)',
          boxShadow: 'var(--sp-shadow-elevated)',
          border: '1px solid var(--sp-border)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--sp-midnight)',
            padding: '2rem',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--sp-radius-sm)',
              backgroundColor: 'var(--sp-emerald)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Package size={26} color="#FFFFFF" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
            Stock<span style={{ color: 'var(--sp-emerald)' }}>Pilot</span>
          </h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94A3B8' }}>
            Intelligent Inventory, Sales & Procurement
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '2rem' }}>
          {error && (
            <div
              style={{
                backgroundColor: 'var(--sp-danger-bg)',
                color: 'var(--sp-danger)',
                border: '1px solid #FECACA',
                borderRadius: 'var(--sp-radius-sm)',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--sp-slate)',
                  marginBottom: '0.5rem',
                }}
              >
                Work Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--sp-slate-light)',
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@stockpilot.local"
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem 0.625rem 2.5rem',
                    border: '1px solid var(--sp-border)',
                    borderRadius: 'var(--sp-radius-sm)',
                    fontSize: '0.9375rem',
                    color: 'var(--sp-slate)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--sp-slate)',
                  marginBottom: '0.5rem',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--sp-slate-light)',
                  }}
                />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.625rem 2.5rem 0.625rem 2.5rem',
                    border: '1px solid var(--sp-border)',
                    borderRadius: 'var(--sp-radius-sm)',
                    fontSize: '0.9375rem',
                    color: 'var(--sp-slate)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--sp-slate-light)',
                  }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--sp-emerald)',
                color: '#FFFFFF',
                fontWeight: '600',
                fontSize: '0.9375rem',
                border: 'none',
                borderRadius: 'var(--sp-radius-sm)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <ShieldCheck size={18} />
              {submitting ? 'Authenticating...' : 'Sign In to Workspace'}
            </button>
          </form>

          {/* Demo Quick-Login Accounts */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--sp-border)', paddingTop: '1.25rem' }}>
            <p
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--sp-slate-light)',
                fontWeight: '600',
                marginBottom: '0.75rem',
                textAlign: 'center',
              }}
            >
              Quick Demo Accounts
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@stockpilot.local', 'Admin123!')}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--sp-slate)',
                  backgroundColor: 'var(--sp-cloud)',
                  border: '1px solid var(--sp-border)',
                  borderRadius: 'var(--sp-radius-sm)',
                  cursor: 'pointer',
                }}
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('manager@stockpilot.local', 'Manager123!')}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--sp-slate)',
                  backgroundColor: 'var(--sp-cloud)',
                  border: '1px solid var(--sp-border)',
                  borderRadius: 'var(--sp-radius-sm)',
                  cursor: 'pointer',
                }}
              >
                📦 Manager
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('sales@stockpilot.local', 'Sales123!')}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--sp-slate)',
                  backgroundColor: 'var(--sp-cloud)',
                  border: '1px solid var(--sp-border)',
                  borderRadius: 'var(--sp-radius-sm)',
                  cursor: 'pointer',
                }}
              >
                💳 Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter';
import {
  Package,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@stockpilot.local');
  const [password, setPassword] = useState('Admin123!');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Field touch states for clean UX validation
  const [touched, setTouched] = useState({ email: false, password: false });

  const { login } = useAuth();
  const navigate = useNavigate();

  // Real-time validation rules
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordValid = password.length >= 6;

  const getEmailError = () => {
    if (!email.trim()) return 'Email address is required.';
    if (!isEmailValid) return 'Please enter a valid work email address.';
    return null;
  };

  const getPasswordError = () => {
    if (!password) return 'Password is required.';
    if (!isPasswordValid) return 'Password must be at least 6 characters.';
    return null;
  };

  const emailError = touched.email ? getEmailError() : null;
  const passwordError = touched.password ? getPasswordError() : null;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isFormValid) {
      return;
    }

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
    setTouched({ email: true, password: true });
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
        {/* Brand Header */}
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

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field with Live Validation */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <label
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--sp-slate)',
                  }}
                >
                  Work Email
                </label>
                {emailError && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--sp-danger)', fontWeight: '600' }}>
                    {emailError}
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: emailError ? 'var(--sp-danger)' : 'var(--sp-slate-light)',
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  required
                  placeholder="name@stockpilot.local"
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem 0.625rem 2.5rem',
                    border: `1px solid ${emailError ? 'var(--sp-danger)' : 'var(--sp-border)'}`,
                    borderRadius: 'var(--sp-radius-sm)',
                    fontSize: '0.9375rem',
                    color: 'var(--sp-slate)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: emailError ? '#FFFBFB' : '#FFFFFF',
                  }}
                />
              </div>
            </div>

            {/* Password Field with Live Validation & Strength Meter */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <label
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--sp-slate)',
                  }}
                >
                  Password
                </label>
                {passwordError && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--sp-danger)', fontWeight: '600' }}>
                    {passwordError}
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: passwordError ? 'var(--sp-danger)' : 'var(--sp-slate-light)',
                  }}
                />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.625rem 2.5rem 0.625rem 2.5rem',
                    border: `1px solid ${passwordError ? 'var(--sp-danger)' : 'var(--sp-border)'}`,
                    borderRadius: 'var(--sp-radius-sm)',
                    fontSize: '0.9375rem',
                    color: 'var(--sp-slate)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: passwordError ? '#FFFBFB' : '#FFFFFF',
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

              {/* Live Password Strength Meter */}
              <PasswordStrengthMeter password={password} showCriteria={false} />
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
          <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--sp-border)', paddingTop: '1.25rem' }}>
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
              One-Click Demo Credentials
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

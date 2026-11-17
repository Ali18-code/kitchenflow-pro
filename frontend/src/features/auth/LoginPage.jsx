import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { UtensilsCrossed, Lock, Mail, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('waiter@kitchenflow.local');
  const [password, setPassword] = useState('Password123!');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Field touch tracking for clean validation
  const [touched, setTouched] = useState({ email: false, password: false });

  const { login } = useAuth();
  const navigate = useNavigate();

  // Validation rules
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordValid = password.length >= 6;

  const getEmailError = () => {
    if (!email.trim()) return 'Email address is required.';
    if (!isEmailValid) return 'Please enter a valid email address (e.g., name@domain.com).';
    return null;
  };

  const getPasswordError = () => {
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
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
      if (user.role === 'waiter') {
        navigate('/app/tables');
      } else if (user.role === 'kitchen') {
        navigate('/app/kitchen');
      } else if (user.role === 'cashier') {
        navigate('/app/billing');
      } else {
        navigate('/app');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('Password123!');
    setTouched({ email: false, password: false });
    setError('');
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center px-3"
      style={{ minHeight: '100vh', backgroundColor: 'var(--kf-canvas)' }}
    >
      <div className="kf-card shadow-sm" style={{ width: '100%', maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex p-3 rounded-circle mb-3"
            style={{ backgroundColor: 'var(--kf-orange-soft)' }}
          >
            <UtensilsCrossed size={32} color="var(--kf-orange)" />
          </div>
          <h2 className="fw-bold mb-1">
            KitchenFlow <span style={{ color: 'var(--kf-orange)' }}>Pro</span>
          </h2>
          <p className="text-muted small">Modern Culinary Operations & Staff Sign In</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label fw-semibold small d-flex justify-content-between">
              <span>Work Email</span>
              {touched.email && isEmailValid && (
                <span className="text-success d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
                  <CheckCircle2 size={13} /> Valid format
                </span>
              )}
            </label>
            <div className="input-group">
              <span className={`input-group-text bg-white ${emailError ? 'border-danger' : ''}`}>
                <Mail size={16} className={emailError ? 'text-danger' : 'text-muted'} />
              </span>
              <input
                type="email"
                className={`form-control ${emailError ? 'is-invalid' : touched.email && isEmailValid ? 'is-valid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                placeholder="staff@kitchenflow.local"
                required
              />
            </div>
            {emailError && (
              <div className="text-danger mt-1 small" style={{ fontSize: '11.5px' }}>
                {emailError}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label fw-semibold small">Password</label>
            <div className="input-group">
              <span className={`input-group-text bg-white ${passwordError ? 'border-danger' : ''}`}>
                <Lock size={16} className={passwordError ? 'text-danger' : 'text-muted'} />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                className={`form-control ${passwordError ? 'is-invalid' : touched.password && isPasswordValid ? 'is-valid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPass(!showPass)}
                tabIndex="-1"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordError && (
              <div className="text-danger mt-1 small" style={{ fontSize: '11.5px' }}>
                {passwordError}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-kf-primary w-100 py-2 mb-3 fw-semibold"
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>

        {/* Quick Demo Profiles */}
        <div className="border-top pt-3 mt-2 text-center">
          <small className="text-muted fw-bold d-block mb-2 text-uppercase" style={{ fontSize: '11px' }}>
            Quick Demo Logins
          </small>
          <div className="d-flex flex-wrap gap-1 justify-content-center">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleQuickLogin('manager@kitchenflow.local')}
            >
              Manager
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleQuickLogin('waiter@kitchenflow.local')}
            >
              Waiter
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleQuickLogin('kitchen@kitchenflow.local')}
            >
              Kitchen
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleQuickLogin('cashier@kitchenflow.local')}
            >
              Cashier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

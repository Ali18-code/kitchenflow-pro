import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { UtensilsCrossed, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('waiter@kitchenflow.local');
  const [password, setPassword] = useState('Password123!');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
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
        err.response?.data?.message || 'Invalid credentials. Please verify your email and password.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('Password123!');
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
          <p className="text-muted small">Modern Culinary Operations & Kitchen Intelligence</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Work Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white text-muted">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@kitchenflow.local"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white text-muted">
                <Lock size={16} />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-kf-primary w-100 py-2 mb-3"
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>

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

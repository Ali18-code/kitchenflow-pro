import React from 'react';
import { Check, X } from 'lucide-react';

export function calculatePasswordStrength(password = '') {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  if (checks.length) score++;
  if (checks.hasLower && checks.hasUpper) score++;
  if (checks.hasNumber) score++;
  if (checks.hasSpecial) score++;

  let label = 'Very Weak';
  let color = '#dee2e6';
  let width = '10%';

  if (score === 1) {
    label = 'Weak';
    color = 'var(--kf-danger)'; // Red
    width = '25%';
  } else if (score === 2) {
    label = 'Fair';
    color = 'var(--kf-orange)'; // Orange
    width = '50%';
  } else if (score === 3) {
    label = 'Good';
    color = '#1971c2'; // Blue
    width = '75%';
  } else if (score >= 4) {
    label = 'Strong';
    color = 'var(--kf-success)'; // Teal / Green
    width = '100%';
  }

  return { score, label, color, width, checks };
}

export default function PasswordStrengthMeter({ password = '' }) {
  if (!password) return null;

  const { score, label, color, width, checks } = calculatePasswordStrength(password);

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="d-flex justify-content-between align-items-center mb-1">
        <small className="text-muted" style={{ fontSize: '11px' }}>Password Strength:</small>
        <small className="fw-bold" style={{ color, fontSize: '11px' }}>{label}</small>
      </div>
      <div className="progress mb-2" style={{ height: '6px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
        <div
          className="progress-bar transition-all"
          role="progressbar"
          style={{
            width,
            backgroundColor: color,
            transition: 'width 0.3s ease, background-color 0.3s ease',
          }}
        />
      </div>

      {/* Rules Checklist */}
      <div className="row g-1 text-muted" style={{ fontSize: '11px' }}>
        <div className={`col-6 d-flex align-items-center gap-1 ${checks.length ? 'text-success fw-semibold' : ''}`}>
          {checks.length ? <Check size={13} color="var(--kf-success)" /> : <X size={13} className="text-muted" />}
          <span>8+ characters</span>
        </div>
        <div className={`col-6 d-flex align-items-center gap-1 ${checks.hasLower && checks.hasUpper ? 'text-success fw-semibold' : ''}`}>
          {checks.hasLower && checks.hasUpper ? <Check size={13} color="var(--kf-success)" /> : <X size={13} className="text-muted" />}
          <span>Uppercase & lowercase</span>
        </div>
        <div className={`col-6 d-flex align-items-center gap-1 ${checks.hasNumber ? 'text-success fw-semibold' : ''}`}>
          {checks.hasNumber ? <Check size={13} color="var(--kf-success)" /> : <X size={13} className="text-muted" />}
          <span>At least one number</span>
        </div>
        <div className={`col-6 d-flex align-items-center gap-1 ${checks.hasSpecial ? 'text-success fw-semibold' : ''}`}>
          {checks.hasSpecial ? <Check size={13} color="var(--kf-success)" /> : <X size={13} className="text-muted" />}
          <span>Special symbol (@$!%*?)</span>
        </div>
      </div>
    </div>
  );
}

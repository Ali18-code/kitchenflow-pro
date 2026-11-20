import React from 'react';
import { Check, X } from 'lucide-react';

export function checkPasswordStrength(password = '') {
  const criteria = [
    { id: 'length', label: 'At least 8 characters', valid: password.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'One lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { id: 'number', label: 'One number (0-9)', valid: /[0-9]/.test(password) },
    { id: 'special', label: 'One special symbol (!@#$%^&*)', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = criteria.filter((c) => c.valid).length;

  let label = 'Very Weak';
  let color = 'var(--sp-danger)';
  let bg = 'var(--sp-danger-bg)';
  let percentage = 10;

  if (score === 1 || score === 2) {
    label = 'Weak';
    color = '#F87171';
    bg = '#FEE2E2';
    percentage = 35;
  } else if (score === 3) {
    label = 'Fair';
    color = 'var(--sp-caution)';
    bg = 'var(--sp-caution-bg)';
    percentage = 60;
  } else if (score === 4) {
    label = 'Good';
    color = 'var(--sp-info)';
    bg = 'var(--sp-info-bg)';
    percentage = 80;
  } else if (score === 5) {
    label = 'Strong';
    color = 'var(--sp-emerald)';
    bg = 'var(--sp-emerald-soft)';
    percentage = 100;
  }

  const isSatisfied = criteria[0].valid && (criteria[1].valid || criteria[2].valid) && (criteria[3].valid || criteria[4].valid);

  return { criteria, score, label, color, bg, percentage, isSatisfied };
}

export default function PasswordStrengthMeter({ password = '', showCriteria = true }) {
  if (!password) return null;

  const { criteria, label, color, percentage } = checkPasswordStrength(password);

  return (
    <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
      {/* Bar and Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--sp-slate-light)' }}>
          Password Strength
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color }}>
          {label}
        </span>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--sp-border)',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginBottom: showCriteria ? '0.75rem' : '0',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.25s ease, background-color 0.25s ease',
          }}
        />
      </div>

      {/* Requirements Checklist */}
      {showCriteria && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem', fontSize: '0.6875rem' }}>
          {criteria.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: c.valid ? 'var(--sp-emerald)' : 'var(--sp-slate-light)',
                fontWeight: c.valid ? '600' : '400',
                transition: 'color 0.15s ease',
              }}
            >
              {c.valid ? <Check size={13} /> : <X size={13} style={{ opacity: 0.5 }} />}
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

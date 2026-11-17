import React, { useState, useEffect } from 'react';
import { staffService } from '../../services/staffService';
import { stationsService } from '../../services/stationsService';
import PasswordStrengthMeter, { calculatePasswordStrength } from '../../components/PasswordStrengthMeter';
import {
  UserPlus,
  UserCheck,
  UserX,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  User as UserIcon,
  Lock,
} from 'lucide-react';

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('waiter');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedStationIds, setSelectedStationIds] = useState([]);
  const [showPass, setShowPass] = useState(false);

  // Form touched & validation
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      const [staffData, stationsData] = await Promise.all([
        staffService.getStaff(),
        stationsService.getStations(),
      ]);
      setStaffList(staffData);
      setStations(stationsData);
    } catch (err) {
      console.error('Failed to load staff/stations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Validation rules
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isNameValid = name.trim().length >= 2;
  const isEmailValid = emailRegex.test(email.trim());
  const passStrength = calculatePasswordStrength(password);
  const isPasswordValid = passStrength.score >= 3 && password.length >= 8;
  const isConfirmValid = confirmPassword && confirmPassword === password;

  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmValid;

  const handleOpenModal = () => {
    setName('');
    setEmail('');
    setRole('waiter');
    setPassword('');
    setConfirmPassword('');
    setSelectedStationIds([]);
    setTouched({});
    setFormError('');
    setShowModal(true);
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) {
      setFormError('Please resolve all validation requirements before creating the account.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      await staffService.createStaff({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        password,
        stationIds: role === 'kitchen' ? selectedStationIds : undefined,
      });

      setSuccessMsg(`Account for ${name} (${role}) created successfully!`);
      setShowModal(false);
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create staff account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const action = user.active ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}'s account?`)) return;

    try {
      await staffService.toggleStatus(user.id, !user.active);
      loadData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'manager':
        return <span className="kf-badge kf-badge-ready">Manager</span>;
      case 'waiter':
        return <span className="kf-badge kf-badge-served">Waiter</span>;
      case 'kitchen':
        return <span className="kf-badge kf-badge-preparing">Kitchen</span>;
      case 'cashier':
        return <span className="kf-badge kf-badge-paid">Cashier</span>;
      default:
        return <span className="kf-badge kf-badge-queued">{role}</span>;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1">Staff Administration</h2>
          <p className="text-muted small mb-0">
            Manage restaurant employee accounts, role permissions, and station assignments
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="btn btn-kf-primary d-flex align-items-center gap-2 btn-sm"
        >
          <UserPlus size={16} />
          Create New Staff Account
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 small mb-3">
          <CheckCircle2 size={18} color="var(--kf-success)" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Staff Table */}
      <div className="kf-card p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr style={{ fontSize: '13px', color: 'var(--kf-muted)' }}>
                <th className="ps-3 py-3">Employee Name</th>
                <th>Work Email</th>
                <th>Assigned Role</th>
                <th>Kitchen Station(s)</th>
                <th>Status</th>
                <th className="pe-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-warning" role="status" />
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No staff accounts found.
                  </td>
                </tr>
              ) : (
                staffList.map((u) => (
                  <tr key={u.id}>
                    <td className="ps-3 fw-semibold text-dark">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: 'var(--kf-panel)',
                            fontSize: '12px',
                          }}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      {u.stations && u.stations.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {u.stations.map((s) => (
                            <span key={s.id} className="badge bg-light text-dark border">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted small">&mdash;</span>
                      )}
                    </td>
                    <td>
                      {u.active ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="pe-3 text-end">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`btn btn-sm ${
                          u.active ? 'btn-outline-danger' : 'btn-outline-success'
                        } py-1 px-2`}
                        style={{ fontSize: '12px' }}
                      >
                        {u.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Creation Modal with Password Strength Meter */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content kf-card p-4">
              <div className="d-flex justify-content-between align-items-start pb-3 mb-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="p-2 rounded-circle"
                    style={{ backgroundColor: 'var(--kf-orange-soft)' }}
                  >
                    <UserPlus size={22} color="var(--kf-orange)" />
                  </div>
                  <div>
                    <h4 className="fw-bold m-0">Create Staff Account</h4>
                    <small className="text-muted">
                      Assign role and credentials with mandatory strength validation
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              {formError && (
                <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateStaff} noValidate>
                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <UserIcon size={15} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className={`form-control ${
                          touched.name && !isNameValid
                            ? 'is-invalid'
                            : touched.name && isNameValid
                              ? 'is-valid'
                              : ''
                        }`}
                        placeholder="e.g. Bilal Ahmed"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                        required
                      />
                    </div>
                    {touched.name && !isNameValid && (
                      <small className="text-danger d-block mt-1">
                        Full name must be at least 2 characters.
                      </small>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Work Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <Mail size={15} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        className={`form-control ${
                          touched.email && !isEmailValid
                            ? 'is-invalid'
                            : touched.email && isEmailValid
                              ? 'is-valid'
                              : ''
                        }`}
                        placeholder="staff@kitchenflow.local"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                        required
                      />
                    </div>
                    {touched.email && !isEmailValid && (
                      <small className="text-danger d-block mt-1">
                        Please enter a valid email format.
                      </small>
                    )}
                  </div>

                  {/* Role */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Operational Role</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="waiter">Waiter (POS & Floor)</option>
                      <option value="kitchen">Kitchen Staff (Station Queues)</option>
                      <option value="cashier">Cashier (Billing & Cash)</option>
                      <option value="manager">Manager / Admin (Full Access)</option>
                    </select>
                  </div>

                  {/* Kitchen Station Selection */}
                  {role === 'kitchen' && (
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Assigned Stations</label>
                      <div className="d-flex flex-wrap gap-2 pt-1">
                        {stations.map((st) => {
                          const isChecked = selectedStationIds.includes(st.id);
                          return (
                            <label
                              key={st.id}
                              className={`btn btn-sm ${
                                isChecked ? 'btn-kf-primary' : 'btn-outline-secondary'
                              }`}
                              style={{ cursor: 'pointer' }}
                            >
                              <input
                                type="checkbox"
                                className="d-none"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setSelectedStationIds(
                                      selectedStationIds.filter((id) => id !== st.id),
                                    );
                                  } else {
                                    setSelectedStationIds([...selectedStationIds, st.id]);
                                  }
                                }}
                              />
                              {st.name}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Password with Strength Meter */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <Lock size={15} className="text-muted" />
                      </span>
                      <input
                        type={showPass ? 'text' : 'password'}
                        className={`form-control ${
                          touched.password && !isPasswordValid
                            ? 'is-invalid'
                            : touched.password && isPasswordValid
                              ? 'is-valid'
                              : ''
                        }`}
                        placeholder="Create strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPass(!showPass)}
                        tabIndex="-1"
                      >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Real-time Password Strength Meter */}
                    <PasswordStrengthMeter password={password} />
                  </div>

                  {/* Confirm Password */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <Lock size={15} className="text-muted" />
                      </span>
                      <input
                        type={showPass ? 'text' : 'password'}
                        className={`form-control ${
                          touched.confirmPassword && !isConfirmValid
                            ? 'is-invalid'
                            : touched.confirmPassword && isConfirmValid
                              ? 'is-valid'
                              : ''
                        }`}
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
                        required
                      />
                    </div>
                    {touched.confirmPassword && !isConfirmValid && (
                      <small className="text-danger d-block mt-1">
                        Passwords do not match.
                      </small>
                    )}
                    {touched.confirmPassword && isConfirmValid && (
                      <small className="text-success d-flex align-items-center gap-1 mt-1" style={{ fontSize: '11px' }}>
                        <CheckCircle2 size={13} /> Passwords match!
                      </small>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-kf-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-kf-primary px-4 fw-semibold"
                    disabled={submitting || (touched.password && !isFormValid)}
                  >
                    {submitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

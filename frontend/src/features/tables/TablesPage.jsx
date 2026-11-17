import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tablesService } from '../../services/tablesService';
import { useAuth } from '../../app/AuthContext';
import { Users, PlusCircle, RefreshCw, Eye, Utensils, Box, Layers } from 'lucide-react';

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const loadTables = async () => {
    try {
      const data = await tablesService.getTables();
      setTables(data);
    } catch (err) {
      console.error('Failed to load tables:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTables();
    const interval = setInterval(loadTables, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartOrder = (tableId) => {
    navigate(`/app/pos?tableId=${tableId}`);
  };

  const handleToggleService = async (table) => {
    if (user.role !== 'manager') return;
    try {
      await tablesService.updateTable(table.id, { enabled: !table.enabled });
      loadTables();
    } catch (err) {
      alert('Failed to update table status');
    }
  };

  const filteredTables = tables.filter((t) => {
    if (filter === 'AVAILABLE') return t.status === 'AVAILABLE';
    if (filter === 'OCCUPIED') return t.status === 'OCCUPIED';
    return true;
  });

  const availableCount = tables.filter((t) => t.status === 'AVAILABLE').length;
  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED').length;

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1">Restaurant Floor Plan & Tables</h2>
          <p className="text-muted small mb-0">
            Real-time occupancy tracking & table dining management
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {/* 3D Isometric View Switcher */}
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`btn btn-sm d-flex align-items-center gap-2 ${
              is3DMode ? 'btn-dark shadow' : 'btn-outline-dark'
            }`}
          >
            {is3DMode ? <Layers size={15} /> : <Box size={15} />}
            {is3DMode ? '2D Flat View' : '✨ 3D Isometric View'}
          </button>
          <button
            onClick={() => {
              setRefreshing(true);
              loadTables();
            }}
            className="btn btn-kf-secondary d-flex align-items-center gap-2 btn-sm"
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => navigate('/app/pos?type=TAKEAWAY')}
            className="btn btn-kf-primary d-flex align-items-center gap-2 btn-sm"
          >
            <Utensils size={14} />
            New Takeaway Order
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="kf-card d-flex align-items-center justify-content-between py-3">
            <div>
              <small className="text-muted text-uppercase fw-bold">Total Tables</small>
              <h3 className="fw-bold m-0">{tables.length}</h3>
            </div>
            <Users size={28} className="text-muted" />
          </div>
        </div>
        <div className="col-sm-4">
          <div className="kf-card d-flex align-items-center justify-content-between py-3 border-start border-4 border-success">
            <div>
              <small className="text-muted text-uppercase fw-bold">Available Now</small>
              <h3 className="fw-bold m-0" style={{ color: 'var(--kf-success)' }}>
                {availableCount}
              </h3>
            </div>
            <span className="kf-badge kf-badge-ready">Ready</span>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="kf-card d-flex align-items-center justify-content-between py-3 border-start border-4 border-warning">
            <div>
              <small className="text-muted text-uppercase fw-bold">Occupied / Active</small>
              <h3 className="fw-bold m-0" style={{ color: 'var(--kf-orange)' }}>
                {occupiedCount}
              </h3>
            </div>
            <span className="kf-badge kf-badge-preparing">Dining</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn btn-sm ${filter === 'ALL' ? 'btn-dark' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('ALL')}
        >
          All Tables ({tables.length})
        </button>
        <button
          className={`btn btn-sm ${filter === 'AVAILABLE' ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => setFilter('AVAILABLE')}
        >
          Available ({availableCount})
        </button>
        <button
          className={`btn btn-sm ${filter === 'OCCUPIED' ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
          onClick={() => setFilter('OCCUPIED')}
        >
          Occupied ({occupiedCount})
        </button>
      </div>

      {/* Tables Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" />
        </div>
      ) : (
        <div className={is3DMode ? 'isometric-stage' : ''}>
          <div className={`row g-3 ${is3DMode ? 'isometric-grid' : ''}`}>
            {filteredTables.map((t) => {
              const isAvailable = t.status === 'AVAILABLE';
              const isOccupied = t.status === 'OCCUPIED';

              return (
                <div key={t.id} className="col-md-4 col-lg-3">
                  <div
                    className={`kf-card h-100 d-flex flex-column justify-content-between position-relative ${
                      is3DMode ? 'isometric-card' : 'kf-3d-tilt'
                    }`}
                    style={{
                      borderColor: isAvailable
                        ? '#b2e2d8'
                        : isOccupied
                          ? '#ffe8cc'
                          : '#dee2e6',
                      backgroundColor: isAvailable
                        ? '#fbfffe'
                        : isOccupied
                          ? '#fffaf5'
                          : '#f8f9fa',
                    }}
                  >
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="fw-bold m-0">{t.label}</h4>
                      <span
                        className={`kf-badge ${
                          isAvailable
                            ? 'kf-badge-ready'
                            : isOccupied
                              ? 'kf-badge-preparing'
                              : 'kf-badge-queued'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="text-muted small mb-3">
                      <Users size={14} className="me-1 inline-block" />
                      {t.seats} Guests Capacity
                    </div>

                    {isOccupied && t.activeOrder && (
                      <div
                        className="p-2 rounded mb-3 small"
                        style={{ backgroundColor: '#fff', border: '1px solid var(--kf-border)' }}
                      >
                        <div className="d-flex justify-content-between fw-bold mb-1">
                          <span>{t.activeOrder.orderCode}</span>
                          <span className="text-warning">{t.activeOrder.status}</span>
                        </div>
                        <div className="text-muted">
                          Bill: Rs {parseFloat(t.activeOrder.total).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-top">
                    {isAvailable && (
                      <button
                        onClick={() => handleStartOrder(t.id)}
                        className="btn btn-kf-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <PlusCircle size={15} />
                        Take Order
                      </button>
                    )}

                    {isOccupied && (
                      <button
                        onClick={() => navigate(`/app/orders`)}
                        className="btn btn-kf-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <Eye size={15} />
                        View Live Order
                      </button>
                    )}

                    {!t.enabled && (
                      <small className="text-danger d-block text-center py-1">
                        Out of Service
                      </small>
                    )}

                    {user?.role === 'manager' && (
                      <button
                        onClick={() => handleToggleService(t)}
                        className="btn btn-link btn-sm text-muted w-100 mt-1 py-0 text-decoration-none"
                        style={{ fontSize: '11px' }}
                      >
                        {t.enabled ? 'Mark Out of Service' : 'Enable Table'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}

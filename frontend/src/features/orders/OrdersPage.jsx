import React, { useState, useEffect } from 'react';
import { ordersService } from '../../services/ordersService';
import { Search, RefreshCw, Eye, XCircle, Clock, CheckCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await ordersService.getOrders({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: search || undefined,
      });
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, [statusFilter, search]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await ordersService.cancelOrder(orderId);
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PLACED':
        return 'kf-badge-queued';
      case 'PREPARING':
        return 'kf-badge-preparing';
      case 'READY':
        return 'kf-badge-ready';
      case 'SERVED':
        return 'kf-badge-served';
      case 'PAID':
        return 'kf-badge-paid';
      case 'CANCELLED':
        return 'kf-badge-cancelled';
      default:
        return 'kf-badge-queued';
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1">Orders Registry & Details</h2>
          <p className="text-muted small mb-0">
            Real-time dine-in & takeaway order tracking
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            loadOrders();
          }}
          className="btn btn-kf-secondary d-flex align-items-center gap-2 btn-sm"
          disabled={refreshing}
        >
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="kf-card mb-4 p-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white">
                <Search size={14} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by order code or table..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-7">
            <div className="d-flex flex-wrap gap-1 justify-content-md-end">
              {['ALL', 'PLACED', 'PREPARING', 'READY', 'SERVED', 'PAID'].map((s) => (
                <button
                  key={s}
                  className={`btn btn-sm ${statusFilter === s ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table & Detail Drawer */}
      <div className="row g-3">
        <div className={selectedOrder ? 'col-lg-7' : 'col-12'}>
          <div className="kf-card p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle m-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr style={{ fontSize: '13px', color: 'var(--kf-muted)' }}>
                    <th className="ps-3 py-3">Order Code</th>
                    <th>Type / Table</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th className="pe-3 text-end">Action</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '14px' }}>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <div className="spinner-border text-warning" role="status" />
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        No orders match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr
                        key={o.id}
                        className={selectedOrder?.id === o.id ? 'table-warning' : ''}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedOrder(o)}
                      >
                        <td className="ps-3 fw-bold text-dark">{o.orderCode}</td>
                        <td>
                          {o.orderType === 'DINE_IN' ? (
                            <span className="badge bg-light text-dark border">
                              {o.table?.label || 'Dine-In'}
                            </span>
                          ) : (
                            <span className="badge bg-secondary">Takeaway</span>
                          )}
                        </td>
                        <td>{o.items?.length || 0} items</td>
                        <td className="fw-semibold">
                          Rs {parseFloat(o.total).toLocaleString()}
                        </td>
                        <td>
                          <span className={`kf-badge ${getStatusBadgeClass(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {new Date(o.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="pe-3 text-end">
                          <button
                            className="btn btn-sm btn-outline-secondary p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(o);
                            }}
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Order Details Panel */}
        {selectedOrder && (
          <div className="col-lg-5">
            <div className="kf-card sticky-top" style={{ top: '80px' }}>
              <div className="d-flex justify-content-between align-items-start pb-3 mb-3 border-bottom">
                <div>
                  <h4 className="fw-bold m-0">{selectedOrder.orderCode}</h4>
                  <small className="text-muted">
                    {selectedOrder.orderType} &bull;{' '}
                    {selectedOrder.table ? selectedOrder.table.label : 'Counter'}
                  </small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                />
              </div>

              {/* Status & Timing */}
              <div className="d-flex justify-content-between align-items-center mb-3 p-2 rounded" style={{ backgroundColor: 'var(--kf-canvas)' }}>
                <span className={`kf-badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
                <small className="text-muted d-flex align-items-center gap-1">
                  <Clock size={13} />
                  {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                </small>
              </div>

              {/* Items Breakdown */}
              <h6 className="fw-bold text-uppercase small text-muted mb-2">Order Items</h6>
              <div className="d-flex flex-column gap-2 mb-3">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded"
                    style={{ border: '1px solid var(--kf-border)', backgroundColor: '#fff' }}
                  >
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold">
                        {item.qty}x {item.menuItem?.name || 'Dish'}
                      </span>
                      <span>
                        Rs {(parseFloat(item.unitPrice) * item.qty).toLocaleString()}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: 'var(--kf-orange-soft)',
                          color: 'var(--kf-orange)',
                          fontSize: '10px',
                        }}
                      >
                        {item.station?.name || 'Kitchen'}
                      </span>
                      <span className={`kf-badge ${getStatusBadgeClass(item.itemStatus)}`} style={{ fontSize: '10px' }}>
                        {item.itemStatus}
                      </span>
                    </div>
                    {item.notes && (
                      <small className="text-muted d-block mt-1 fst-italic">
                        Note: {item.notes}
                      </small>
                    )}
                  </div>
                ))}
              </div>

              {/* Bill Summary */}
              <div className="border-top pt-2 mb-3">
                <div className="d-flex justify-content-between text-muted small">
                  <span>Subtotal</span>
                  <span>Rs {parseFloat(selectedOrder.subtotal).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small">
                  <span>Tax (5%)</span>
                  <span>Rs {parseFloat(selectedOrder.tax).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 mt-1 border-top pt-1">
                  <span>Total Due</span>
                  <span className="text-success">
                    Rs {parseFloat(selectedOrder.total).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedOrder.status === 'PLACED' && (
                <button
                  onClick={() => handleCancel(selectedOrder.id)}
                  className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                >
                  <XCircle size={15} /> Cancel Order
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

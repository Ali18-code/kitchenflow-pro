import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import { tablesService } from '../../services/tablesService';
import { ordersService } from '../../services/ordersService';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  MessageSquare,
} from 'lucide-react';

export default function PosPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tableIdParam = searchParams.get('tableId');
  const typeParam = searchParams.get('type') || (tableIdParam ? 'DINE_IN' : 'TAKEAWAY');

  const [orderType, setOrderType] = useState(typeParam);
  const [selectedTableId, setSelectedTableId] = useState(
    tableIdParam ? parseInt(tableIdParam, 10) : null,
  );
  const [tables, setTables] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state: array of { menuItem, quantity, notes }
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load tables and categories on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [catsData, tablesData] = await Promise.all([
          menuService.getCategories(),
          tablesService.getTables(),
        ]);
        setCategories(catsData);
        setTables(tablesData);
      } catch (err) {
        console.error('Failed to load initial POS data:', err);
      }
    }
    loadData();
  }, []);

  // Load menu items when category or search changes
  useEffect(() => {
    async function loadItems() {
      try {
        const items = await menuService.getItems({
          categoryId: selectedCatId || undefined,
          search: searchQuery || undefined,
          availableOnly: true,
        });
        setMenuItems(items);
      } catch (err) {
        console.error('Failed to load menu items:', err);
      }
    }
    loadItems();
  }, [selectedCatId, searchQuery]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.menuItem.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.menuItem.id === item.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      } else {
        return [...prev, { menuItem: item, quantity: 1, notes: '' }];
      }
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.menuItem.id === itemId) {
            const newQty = line.quantity + delta;
            return newQty > 0 ? { ...line, quantity: newQty } : null;
          }
          return line;
        })
        .filter(Boolean),
    );
  };

  const updateNotes = (itemId, notes) => {
    setCart((prev) =>
      prev.map((line) =>
        line.menuItem.id === itemId ? { ...line, notes } : line,
      ),
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((line) => line.menuItem.id !== itemId));
  };

  // Calculations (tax = 5%)
  const subtotal = cart.reduce(
    (sum, line) => sum + parseFloat(line.menuItem.price) * line.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before placing order.');
      return;
    }

    if (orderType === 'DINE_IN' && !selectedTableId) {
      setErrorMessage('Please select a dine-in table.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // Idempotency key per submission
      const idempotencyKey = `pos-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const payload = {
        orderType,
        tableId: orderType === 'DINE_IN' ? selectedTableId : undefined,
        idempotencyKey,
        items: cart.map((line) => ({
          menuItemId: line.menuItem.id,
          quantity: line.quantity,
          notes: line.notes || undefined,
        })),
      };

      const result = await ordersService.createOrder(payload);
      setOrderSuccess(result);
      setCart([]);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to place order. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTableObj = tables.find((t) => t.id === selectedTableId);

  return (
    <div>
      {/* Top Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={() => navigate('/app/tables')}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
          >
            <ArrowLeft size={16} /> Tables
          </button>
          <div>
            <h3 className="fw-bold m-0">
              {orderType === 'DINE_IN'
                ? `New Order / ${selectedTableObj ? selectedTableObj.label : 'Select Table'}`
                : 'New Takeaway Order'}
            </h3>
            <small className="text-muted">POS Order Builder & Dispatch</small>
          </div>
        </div>

        {/* Order Type Toggle */}
        <div className="d-flex align-items-center gap-2">
          <div className="btn-group btn-group-sm">
            <button
              className={`btn ${orderType === 'DINE_IN' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setOrderType('DINE_IN')}
            >
              Dine-In
            </button>
            <button
              className={`btn ${orderType === 'TAKEAWAY' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => {
                setOrderType('TAKEAWAY');
                setSelectedTableId(null);
              }}
            >
              Takeaway
            </button>
          </div>

          {orderType === 'DINE_IN' && (
            <select
              className="form-select form-select-sm"
              style={{ width: '140px' }}
              value={selectedTableId || ''}
              onChange={(e) => setSelectedTableId(parseInt(e.target.value, 10))}
            >
              <option value="">Choose Table</option>
              {tables.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  disabled={t.status === 'OCCUPIED' && t.id !== selectedTableId}
                >
                  {t.label} ({t.seats} seats) {t.status === 'OCCUPIED' ? '(Occupied)' : ''}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Grid: Left Dishes, Right Sticky Cart */}
      <div className="row g-3">
        {/* Left Side: Categories & Dishes */}
        <div className="col-lg-8">
          {/* Search & Category Filter Pills */}
          <div className="kf-card mb-3 p-3">
            <div className="row g-2 align-items-center mb-3">
              <div className="col-md-6">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white">
                    <Search size={14} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn btn-sm ${selectedCatId === null ? 'btn-kf-primary' : 'btn-kf-secondary'}`}
                onClick={() => setSelectedCatId(null)}
              >
                All Items
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`btn btn-sm ${selectedCatId === cat.id ? 'btn-kf-primary' : 'btn-kf-secondary'}`}
                  onClick={() => setSelectedCatId(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dishes Cards Grid with 3D Depth & Real Photography */}
          <div className="row g-3">
            {menuItems.map((item) => {
              // Default high quality food image fallback if not set
              const defaultImg =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
              const displayImg = item.imageUrl || defaultImg;

              return (
                <div key={item.id} className="col-sm-6 col-md-4">
                  <div className="kf-card kf-3d-tilt h-100 d-flex flex-column justify-content-between p-0 overflow-hidden shadow-sm">
                    {/* Food Photo with Floating 3D Badges */}
                    <div className="food-card-img-wrapper">
                      <img
                        src={displayImg}
                        alt={item.name}
                        className="food-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImg;
                        }}
                      />
                      <span className="food-card-badge shadow-sm" style={{ color: 'var(--kf-orange)' }}>
                        {item.station?.name || 'Kitchen'}
                      </span>
                      <span className="food-card-time shadow-sm d-flex align-items-center gap-1">
                        <Clock size={11} /> {item.prepMinutes}m
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        <h5 className="fw-bold mb-1" style={{ fontSize: '15px' }}>{item.name}</h5>
                        <div className="fw-bold text-success mb-3 fs-6">
                          Rs {parseFloat(item.price).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="btn btn-kf-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1 shadow-sm"
                      >
                        <Plus size={15} /> Add to Order
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Sticky Order Cart */}
        <div className="col-lg-4">
          <div
            className="kf-card sticky-top"
            style={{ top: '80px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
          >
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                <ShoppingBag size={18} color="var(--kf-orange)" />
                Order Cart
              </h5>
              <span className="badge bg-secondary">{cart.length} lines</span>
            </div>

            {errorMessage && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <ShoppingBag size={36} className="mb-2 opacity-50" />
                <p className="small mb-0">Cart is empty</p>
                <small>Select dishes from the menu to build order</small>
              </div>
            ) : (
              <div>
                {/* Cart Items List */}
                <div className="d-flex flex-column gap-3 mb-3">
                  {cart.map((line) => (
                    <div
                      key={line.menuItem.id}
                      className="p-2 rounded"
                      style={{ backgroundColor: 'var(--kf-canvas)', border: '1px solid var(--kf-border)' }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                          <div className="fw-bold small">{line.menuItem.name}</div>
                          <small className="text-muted">
                            Rs {parseFloat(line.menuItem.price).toLocaleString()} each
                          </small>
                        </div>
                        <div className="fw-bold text-end">
                          Rs {(parseFloat(line.menuItem.price) * line.quantity).toLocaleString()}
                        </div>
                      </div>

                      {/* Controls: Quantity & Notes */}
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="d-flex align-items-center gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary p-1"
                            onClick={() => updateQuantity(line.menuItem.id, -1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 fw-bold small">{line.quantity}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary p-1"
                            onClick={() => updateQuantity(line.menuItem.id, 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="btn btn-sm text-danger p-1"
                          onClick={() => removeFromCart(line.menuItem.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Special instructions */}
                      <div className="mt-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Special instructions (e.g. less spicy)..."
                          value={line.notes}
                          onChange={(e) => updateNotes(line.menuItem.id, e.target.value)}
                          style={{ fontSize: '12px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Summary */}
                <div className="border-top pt-3 mb-3">
                  <div className="d-flex justify-content-between text-muted small mb-1">
                    <span>Subtotal</span>
                    <span>Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between text-muted small mb-2">
                    <span>Estimated Tax (5%)</span>
                    <span>Rs {tax.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold fs-5 pt-2 border-top">
                    <span>Total</span>
                    <span style={{ color: 'var(--kf-orange)' }}>
                      Rs {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="btn btn-kf-primary w-100 py-2 fs-6 fw-bold"
                >
                  {submitting ? 'Placing Order...' : 'PLACE ORDER'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      {orderSuccess && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content kf-card p-4 text-center">
              <div
                className="d-inline-flex p-3 rounded-circle mb-3 mx-auto"
                style={{ backgroundColor: '#e6f6f4' }}
              >
                <CheckCircle size={40} color="var(--kf-success)" />
              </div>
              <h3 className="fw-bold mb-1">Order Placed Successfully!</h3>
              <p className="text-muted small">
                Order code:{' '}
                <strong className="fs-5 text-dark">{orderSuccess.orderCode}</strong>
              </p>

              <div
                className="p-3 rounded mb-3 text-start small"
                style={{ backgroundColor: 'var(--kf-canvas)' }}
              >
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Type:</span>
                  <span className="fw-bold">{orderSuccess.orderType}</span>
                </div>
                {orderSuccess.table && (
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Table:</span>
                    <span className="fw-bold">{orderSuccess.table.label}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Items:</span>
                  <span>{orderSuccess.items?.length || 0} items dispatched</span>
                </div>
                <div className="d-flex justify-content-between fw-bold pt-1 border-top">
                  <span>Total Amount:</span>
                  <span className="text-success">
                    Rs {parseFloat(orderSuccess.total).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-kf-secondary w-50"
                  onClick={() => {
                    setOrderSuccess(null);
                    navigate('/app/tables');
                  }}
                >
                  Back to Tables
                </button>
                <button
                  className="btn btn-kf-primary w-50"
                  onClick={() => {
                    setOrderSuccess(null);
                    navigate('/app/orders');
                  }}
                >
                  View Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

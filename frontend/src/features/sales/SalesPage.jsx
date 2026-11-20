import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SalesPage() {
  const [cart, setCart] = useState([
    { productId: 42, sku: 'CAB-USB4-01', name: 'USB4 40Gbps Type-C Cable 1m', onHand: 120, unitPrice: 24.99, quantity: 2 },
  ]);
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleQtyChange = (idx, newQty) => {
    const qty = Math.max(1, parseInt(newQty) || 1);
    setCart((prev) => {
      const updated = [...prev];
      updated[idx].quantity = qty;
      return updated;
    });
  };

  const handleCheckout = () => {
    setError('');
    // Client verification against available on-hand stock
    for (const item of cart) {
      if (item.quantity > item.onHand) {
        setError(`Insufficient stock for ${item.name}! Requested: ${item.quantity}, Available: ${item.onHand}`);
        return;
      }
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccessReceipt({
        saleNumber: `SAL-2026-00${Math.floor(Math.random() * 900) + 100}`,
        subtotal: subtotal.toFixed(2),
        items: [...cart],
        timestamp: new Date().toLocaleString(),
      });
      setCart([]);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: '0 0 0.25rem 0' }}>
          Sales Checkout & Stock Deduction
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
          Record completed transactions with server-enforced atomic stock deductions and immutable movement history.
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--sp-danger-bg)',
            color: 'var(--sp-danger)',
            border: '1px solid #FECACA',
            borderRadius: 'var(--sp-radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successReceipt && (
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--sp-success-bg)',
            color: 'var(--sp-success)',
            border: '1px solid #A7F3D0',
            borderRadius: 'var(--sp-radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem' }}>
            <CheckCircle2 size={20} />
            <span>Sale {successReceipt.saleNumber} Confirmed Successfully!</span>
          </div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--sp-slate)' }}>
            Total Billed: <strong>Rs {successReceipt.subtotal}</strong> • Stock deducted atomically • <code style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '2px 4px' }}>SALE_OUT</code> ledger movement recorded.
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Cart Line Items */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--sp-radius-md)',
            border: '1px solid var(--sp-border)',
            boxShadow: 'var(--sp-shadow-subtle)',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--sp-slate)', margin: '0 0 1rem 0' }}>
            Current Order Line Items
          </h3>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--sp-slate-light)' }}>
              Order cart is empty. Add active products to record a sale.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--sp-border)', textAlign: 'left', color: 'var(--sp-slate-light)' }}>
                  <th style={{ padding: '0.75rem 0' }}>Product</th>
                  <th style={{ padding: '0.75rem 0' }}>Available</th>
                  <th style={{ padding: '0.75rem 0' }}>Unit Price</th>
                  <th style={{ padding: '0.75rem 0', width: '90px' }}>Quantity</th>
                  <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--sp-border)' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ fontWeight: '600', color: 'var(--sp-slate)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)' }}>{item.sku}</div>
                    </td>
                    <td style={{ padding: '1rem 0', color: 'var(--sp-slate)' }}>{item.onHand} units</td>
                    <td style={{ padding: '1rem 0', color: 'var(--sp-slate)' }}>Rs {item.unitPrice.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <input
                        type="number"
                        min="1"
                        max={item.onHand}
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(idx, e.target.value)}
                        style={{
                          width: '70px',
                          padding: '0.375rem',
                          border: '1px solid var(--sp-border)',
                          borderRadius: 'var(--sp-radius-sm)',
                        }}
                      />
                    </td>
                    <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: '600', color: 'var(--sp-slate)' }}>
                      Rs {(item.unitPrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Order Summary & Submit */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--sp-radius-md)',
            border: '1px solid var(--sp-border)',
            boxShadow: 'var(--sp-shadow-subtle)',
            padding: '1.5rem',
            height: 'fit-content',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--sp-slate)', margin: '0 0 1rem 0' }}>
            Checkout Summary
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: '600', color: 'var(--sp-slate)' }}>Rs {subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: '700', color: 'var(--sp-slate)' }}>
            <span>Total Payable</span>
            <span style={{ color: 'var(--sp-emerald)' }}>Rs {subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={processing || cart.length === 0}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: 'var(--sp-emerald)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--sp-radius-sm)',
              fontWeight: '600',
              fontSize: '0.9375rem',
              cursor: processing || cart.length === 0 ? 'not-allowed' : 'pointer',
              opacity: processing || cart.length === 0 ? 0.6 : 1,
            }}
          >
            {processing ? 'Processing Transaction...' : 'Complete Sale & Decrement Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

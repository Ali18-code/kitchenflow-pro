import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Sliders,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShoppingCart,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ForecastPage() {
  const navigate = useNavigate();

  // Sample active product for simulation demo
  const [selectedProduct, setSelectedProduct] = useState({
    id: 42,
    sku: 'CAB-USB4-01',
    name: 'USB4 40Gbps Type-C Cable 1m',
    onHand: 120,
    historicalDailyDemand: 12,
    defaultLeadDays: 7,
    defaultSupplier: 'Global Tech Logistics',
    unitCost: 12.0,
  });

  // Simulator controls
  const [demandOverride, setDemandOverride] = useState(12);
  const [leadDays, setLeadDays] = useState(7);
  const [safetyDays, setSafetyDays] = useState(3);
  const [reviewDays, setReviewDays] = useState(7);
  const [incomingUnits, setIncomingUnits] = useState(0);

  // Deterministic Reorder Math (Section 09 & 11)
  const math = useMemo(() => {
    const effectiveDemand = Number(demandOverride) || 0;
    const available = Number(selectedProduct.onHand) || 0;
    const lead = Number(leadDays) || 0;
    const safety = Number(safetyDays) || 0;
    const review = Number(reviewDays) || 0;
    const incoming = Number(incomingUnits) || 0;

    let daysCover = 'Not estimable';
    let daysCoverNum = 0;
    if (effectiveDemand > 0) {
      daysCoverNum = available / effectiveDemand;
      daysCover = daysCoverNum.toFixed(1);
    } else if (available === 0) {
      daysCover = '0';
    }

    const reorderPoint = effectiveDemand * (lead + safety);
    const targetUnits = effectiveDemand * (lead + safety + review);
    const suggestedOrder = Math.max(0, Math.ceil(targetUnits - available - incoming));

    let riskStatus = 'HEALTHY';
    let riskColor = 'var(--sp-success)';
    let riskBg = 'var(--sp-success-bg)';
    let riskLabel = 'Healthy Coverage';

    if (effectiveDemand <= 0) {
      riskStatus = 'UNKNOWN';
      riskColor = 'var(--sp-slate-light)';
      riskBg = 'var(--sp-cloud)';
      riskLabel = 'Thin / Zero Demand';
    } else if (available === 0 || daysCoverNum < lead) {
      riskStatus = 'CRITICAL';
      riskColor = 'var(--sp-danger)';
      riskBg = 'var(--sp-danger-bg)';
      riskLabel = 'Stockout Projected Before Delivery';
    } else if (available <= reorderPoint) {
      riskStatus = 'REORDER_NOW';
      riskColor = 'var(--sp-caution)';
      riskBg = 'var(--sp-caution-bg)';
      riskLabel = 'Reorder Now (Buffer Breached)';
    }

    return {
      effectiveDemand,
      daysCover,
      daysCoverNum,
      reorderPoint,
      targetUnits,
      suggestedOrder,
      riskStatus,
      riskColor,
      riskBg,
      riskLabel,
    };
  }, [demandOverride, leadDays, safetyDays, reviewDays, incomingUnits, selectedProduct.onHand]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <TrendingUp size={24} color="var(--sp-emerald)" />
          <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: 'var(--sp-slate)', margin: 0 }}>
            Forecast Studio
          </h1>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--sp-emerald-soft)',
              color: 'var(--sp-emerald)',
            }}
          >
            Deterministic Engine
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
          Transparent what-if simulation to test demand spikes and calculate exact restock quantities before cash is committed.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.5rem' }}>
        {/* Controls Column */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--sp-radius-md)',
            border: '1px solid var(--sp-border)',
            boxShadow: 'var(--sp-shadow-subtle)',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--sp-slate)', margin: '0 0 1.25rem 0' }}>
            Simulation Inputs & Sliders
          </h3>

          {/* Product Profile Box */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--sp-cloud)',
              borderRadius: 'var(--sp-radius-sm)',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)', textTransform: 'uppercase', fontWeight: '600' }}>
              Active SKU
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--sp-slate)', marginTop: '0.25rem' }}>
              {selectedProduct.name}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--sp-slate-light)', marginTop: '0.25rem' }}>
              SKU: {selectedProduct.sku} • On Hand: <strong>{selectedProduct.onHand} units</strong> • Supplier: {selectedProduct.defaultSupplier}
            </div>
          </div>

          {/* Daily Demand Slider */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--sp-slate)' }}>
                Expected Daily Demand
              </label>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--sp-emerald)' }}>
                {demandOverride} units / day
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={demandOverride}
              onChange={(e) => setDemandOverride(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--sp-emerald)' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)', marginTop: '0.25rem' }}>
              Baseline: 14-day trailing average is 12 units/day. Drag right to simulate demand surge.
            </div>
          </div>

          {/* Lead Days */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--sp-slate)', marginBottom: '0.375rem' }}>
                Supplier Lead Time (Days)
              </label>
              <input
                type="number"
                min="1"
                value={leadDays}
                onChange={(e) => setLeadDays(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--sp-border)',
                  borderRadius: 'var(--sp-radius-sm)',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--sp-slate)', marginBottom: '0.375rem' }}>
                Safety Stock Buffer (Days)
              </label>
              <input
                type="number"
                min="0"
                value={safetyDays}
                onChange={(e) => setSafetyDays(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--sp-border)',
                  borderRadius: 'var(--sp-radius-sm)',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Review Interval & Incoming Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--sp-slate)', marginBottom: '0.375rem' }}>
                Order Cycle / Review (Days)
              </label>
              <input
                type="number"
                min="1"
                value={reviewDays}
                onChange={(e) => setReviewDays(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--sp-border)',
                  borderRadius: 'var(--sp-radius-sm)',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--sp-slate)', marginBottom: '0.375rem' }}>
                Confirmed Incoming Units
              </label>
              <input
                type="number"
                min="0"
                value={incomingUnits}
                onChange={(e) => setIncomingUnits(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--sp-border)',
                  borderRadius: 'var(--sp-radius-sm)',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Output & Decision Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Status Badge Banner */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--sp-radius-md)',
              backgroundColor: math.riskBg,
              border: `1px solid ${math.riskColor}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {math.riskStatus === 'CRITICAL' ? (
              <AlertTriangle size={24} color={math.riskColor} />
            ) : (
              <CheckCircle size={24} color={math.riskColor} />
            )}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: math.riskColor }}>
                Status Evaluation
              </div>
              <div style={{ fontWeight: '700', fontSize: '1.125rem', color: 'var(--sp-slate)' }}>
                {math.riskLabel}
              </div>
            </div>
          </div>

          {/* Mathematical Results Cards */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--sp-radius-md)',
              border: '1px solid var(--sp-border)',
              boxShadow: 'var(--sp-shadow-subtle)',
              padding: '1.5rem',
            }}
          >
            <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--sp-slate-light)', margin: '0 0 1rem 0' }}>
              Calculated Decision Targets
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--sp-cloud)', borderRadius: 'var(--sp-radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)' }}>Days of Cover</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--sp-slate)' }}>
                  {math.daysCover} {math.daysCover !== 'Not estimable' && 'days'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--sp-slate-light)' }}>On-Hand ÷ Effective Demand</div>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'var(--sp-cloud)', borderRadius: 'var(--sp-radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)' }}>Reorder Point (ROP)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--sp-slate)' }}>
                  {math.reorderPoint} units
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--sp-slate-light)' }}>Demand × (Lead + Safety)</div>
              </div>
            </div>

            <div style={{ padding: '1rem', border: '1px dashed var(--sp-border)', borderRadius: 'var(--sp-radius-sm)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)', fontWeight: '600' }}>
                    RECOMMENDED REORDER QUANTITY
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--sp-emerald)' }}>
                    {math.suggestedOrder} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--sp-slate)' }}>units</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--sp-slate-light)' }}>Estimated PO Cost</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--sp-slate)' }}>
                    Rs {(math.suggestedOrder * selectedProduct.unitCost).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA: Prefill PO */}
            <button
              onClick={() => navigate('/app/purchases')}
              disabled={math.suggestedOrder === 0}
              style={{
                width: '100%',
                padding: '0.875rem',
                backgroundColor: 'var(--sp-emerald)',
                color: '#FFFFFF',
                fontWeight: '600',
                fontSize: '0.9375rem',
                border: 'none',
                borderRadius: 'var(--sp-radius-sm)',
                cursor: math.suggestedOrder === 0 ? 'not-allowed' : 'pointer',
                opacity: math.suggestedOrder === 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Prefill Purchase Order ({math.suggestedOrder} units)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

# StockPilot 📦📊
> **Intelligent inventory, sales and procurement — built around one question: what should the business do next?**  
> *Full-Stack Master Blueprint (React + Vite / NestJS REST API / MySQL + TypeORM)*

---

## 🚀 Overview

Small and mid-sized businesses often track stock, purchases, and sales in disconnected spreadsheets. They can know what they own but still reorder too late, tie up capital in excess stock, or lose transaction auditability.

**StockPilot** connects products, quantities, sales, suppliers, and purchase orders into a single, cohesive, transaction-safe platform. Its highlight is the **Forecast Studio**: an explainable simulation engine that projects stockout timing and recommends optimal reorder quantities using transparent arithmetic rather than opaque AI claims.

```
Demand (Sales) ──▶ Low Stock Alert ──▶ Forecast Studio (What-if Simulation) ──▶ Purchase Order ──▶ Stock Receipt
```

---

## 🌟 Key Differentiator: Explainable Forecast Studio

Instead of unprovable black-box machine learning, Forecast Studio provides auditable, interactive decision support:

* **14-day Baseline Daily Demand**:
  $$\text{dailyDemand} = \frac{\text{soldUnitsLast14Days}}{14}$$
* **Interactive What-If Demand Override**:
  $$\text{effectiveDemand} = \text{manualOverride} \mathbin{??} \text{dailyDemand}$$
* **Days of Cover (Stockout Horizon)**:
  $$\text{daysToStockout} = \frac{\text{availableUnits}}{\text{effectiveDemand}}$$
* **Reorder Point (ROP)**:
  $$\text{reorderPoint} = \text{effectiveDemand} \times (\text{leadDays} + \text{safetyDays})$$
* **Target Stock Level**:
  $$\text{targetUnits} = \text{effectiveDemand} \times (\text{leadDays} + \text{safetyDays} + \text{reviewDays})$$
* **Suggested Order Quantity**:
  $$\text{suggestedOrder} = \max\Big(0, \lceil \text{targetUnits} - \text{availableUnits} - \text{incomingUnits} \rceil\Big)$$
* **One-Click Prefill**: Seamlessly transitions the calculated quantity and preferred supplier into a new Draft Purchase Order.

---

## 🛠️ Tech Stack & System Architecture

StockPilot is built as a **modular monolith** with transactional integrity:

* **Frontend**: React 18, Vite, React Router 6, TanStack Query (server state), React Hook Form + Zod, Recharts, Lucide Icons.
* **Backend**: NestJS 10 (TypeScript), Passport JWT, Role Guards, class-validator DTOs, TypeORM transactions.
* **Database**: MySQL 8.0 (InnoDB, UTF8MB4), BIGINT auto-increment IDs, DECIMAL(12,2) money precision, unsigned balances, signed movement deltas, UTC datetime.

---

## 👥 Role-Based Access Control (RBAC)

Three predefined personas strictly enforced at the backend controller/guard level:

| Capability | Admin | Inventory Manager | Sales Staff |
| :--- | :---: | :---: | :---: |
| **View Dashboard & Catalog** | ✅ | ✅ | ✅ (Read-only) |
| **Create/Edit Products & Suppliers** | ✅ | ✅ | ❌ |
| **Manual Stock Adjustments (with reason)** | ✅ | ✅ | ❌ |
| **Record Sale / Atomic Stock Decrement** | ✅ | Optional | ✅ (Own sales) |
| **Create, Submit & Receive POs** | ✅ | ✅ | ❌ |
| **Forecast Studio (Simulation)** | ✅ | ✅ | Read-only Alerts |
| **User Management & Audit Logs** | ✅ | ❌ | ❌ |

---

## 🔒 Non-Negotiable Domain Invariants

1. **Balance Never Negative**: Conditional atomic update inside DB transaction:
   ```sql
   UPDATE inventory_balances
   SET on_hand = on_hand - :qty
   WHERE product_id = :id AND on_hand >= :qty;
   ```
   If affected rows $\ne$ 1, rolls back and returns `409 Conflict` (`INSUFFICIENT_STOCK`).
2. **Dual-Write Stock Movement Ledger**: Every change to `inventory_balances` must record a corresponding immutable entry in `stock_movements` in the same transaction.
   * Types: `OPENING_IN`, `PURCHASE_IN`, `SALE_OUT`, `ADJUST_IN`, `ADJUST_OUT`, `SALE_VOID_IN`.
3. **Historical Price Stability**: Sales and Purchase Orders snapshot prices and costs at creation; catalog price edits never alter past financial records.
4. **Idempotent Stock Receiving**: Purchase receipts require a unique `receipt_key` ensuring duplicate requests never double-receive stock.
5. **No Hard Deletes**: Products and suppliers referenced in transactions are soft-disabled (`is_active = false`).

---

## 📁 Repository Structure

```
stockpilot/
├── frontend/             # React + Vite client application
│   ├── src/
│   │   ├── app/          # Routes, AuthContext, AppShell, Navigation
│   │   ├── api/          # Axios HTTP client & API interceptors
│   │   ├── components/   # Reusable UI (DataTable, Badges, Modals, KpiCards)
│   │   ├── features/     # Feature modules (auth, dashboard, products, inventory, sales, suppliers, purchases, forecast, reports, settings)
│   │   ├── hooks/        # Custom React hooks
│   │   └── styles/       # Design tokens (Midnight, Emerald, Cloud, Slate)
│   └── package.json
├── backend/              # NestJS REST API
│   ├── src/
│   │   ├── common/       # Guards, filters, decorators
│   │   ├── config/       # Environment configuration
│   │   ├── database/     # DataSource, migrations, seeders
│   │   ├── modules/      # Feature modules (auth, users, categories, products, inventory, sales, suppliers, purchasing, forecast, reports, audit)
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── docs/                 # Architectural specifications
│   ├── ERD.md            # Entity Relationship Diagram & Data Dictionary
│   ├── API.md            # REST API Contract (/api/v1)
│   ├── TESTS.md          # Acceptance test scenarios (T01 - T12)
│   └── DEMO.md           # 7-minute evaluation walkthrough script
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Boot Sequence

### 1. Prerequisites
* Node.js v18+ & npm
* MySQL Server 8.0+ running on port 3306

### 2. Database Creation
```sql
CREATE DATABASE IF NOT EXISTS stockpilot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Verify MySQL credentials in .env
npm run seed
npm run start:dev
```
Backend runs on `http://localhost:3000/api/v1`.

### 4. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
Client runs on `http://localhost:5173`.

---

## 👥 Seed Accounts for Demonstration

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@stockpilot.local` | `Admin123!` |
| **Inventory Manager** | `manager@stockpilot.local` | `Manager123!` |
| **Sales Staff** | `sales@stockpilot.local` | `Sales123!` |

---

## 🧪 Acceptance Test Cases (T01 - T12)

* **T01**: Admin logs in (200); Sales staff cannot manage users (403).
* **T02**: Create category, product, opening stock $\to$ `OPENING_IN` movement created.
* **T03**: Sell 2 from 10 units $\to$ Balance = 8; `SALE_OUT` (-2) logged; sale recorded.
* **T04**: Sell 9 when 8 remain $\to$ `409 Conflict`; stock unchanged.
* **T05**: Concurrent sales for final unit $\to$ Exactly one succeeds; balance $\ge 0$.
* **T06**: Create PO for 100, submit, receive 40 $\to$ Status `PARTIALLY RECEIVED`; balance +40.
* **T07**: Retry same `receipt_key` $\to$ Second stock increment rejected.
* **T08**: Attempt to receive more than PO remaining $\to$ 409 Conflict.
* **T09**: Void completed sale $\to$ Restores stock once; duplicate void rejected.
* **T10**: Forecast with demand 12/day, on hand 120 $\to$ 10 days cover calculated.
* **T11**: Forecast with zero demand/history $\to$ "Not estimable" state, no `NaN`/`Infinity`.
* **T12**: Responsive layout tested down to 360px viewport width.

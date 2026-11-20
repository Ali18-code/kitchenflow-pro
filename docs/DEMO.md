# StockPilot 7-Minute Live Evaluation & Viva Walkthrough Script

Use this structured sequence during evaluation to clearly demonstrate technical depth, transactional consistency, and the unique Forecast Studio.

---

## ⏱️ Minute-by-Minute Evaluation Schedule

### 0:00 – 0:45 | Introduction & Dashboard
* **Action**: Open the landing page, introduce StockPilot.
* **Talking Point**: *"StockPilot is an intelligent inventory and procurement management platform built around one core question: what should the business do next? It bridges the gap between sales depletion and vendor replenishment using transaction-safe business logic and explainable forecasting."*
* **Showcase**: Highlight the Dashboard KPIs: Active Products, Total Stock Valuation (cost $\times$ on-hand), Low-Stock Risk Queue, Open PO count, and 7-day sales activity chart.

### 0:45 – 1:30 | Identity, Authentication & Roles
* **Action**: Log in as `admin@stockpilot.local`. Open User Management.
* **Demonstration**: Show predefined roles (`ADMIN`, `INVENTORY_MANAGER`, `SALES_STAFF`). Show that password hashes are argon2/bcrypt and permissions are verified by NestJS backend guards, not just hidden UI buttons.

### 1:30 – 2:15 | Product Catalog & Inventory Ledger
* **Action**: Navigate to Products. Open an item (e.g. `USB-C Cable`).
* **Demonstration**: Show on-hand balance and its direct link to the append-only `stock_movements` ledger.
* **Talking Point**: *"Notice that the balance is not an unverified number—every single unit change is backed by an immutable ledger movement with an actor and source reference."*

### 2:15 – 3:05 | Sales Checkout & Atomic Stock Deduction
* **Action**: Switch to Sales screen (or log in as Sales Staff). Record a sale of 2 units.
* **Demonstration**:
  1. Show that on-hand quantity decreases by 2 in real-time.
  2. Show that a `SALE_OUT` entry appears in the movement history.
  3. Attempt to sell more than the remaining quantity: demonstrate the immediate `409 Conflict` error and zero balance corruption.

### 3:05 – 4:15 | Differentiator: Forecast Studio & What-If Simulation
* **Action**: Open **Forecast Studio** for the low-stock SKU.
* **Demonstration**:
  1. Show the deterministic 14-day average daily demand calculation.
  2. Adjust the daily demand slider to simulate an upcoming promotion (e.g., doubling demand from 12 $\to$ 24 units/day).
  3. Watch the Days of Cover drop and the risk badge transition from *Reorder Now* (Amber) to *Critical* (Red).
  4. Click **"Generate Suggested PO"** to prefill a purchase order with the recommended units.

### 4:15 – 5:30 | Procurement Lifecycle & Partial Stock Receipt
* **Action**: Open the prefilled Purchase Order.
* **Demonstration**:
  1. Submit the Draft PO (status transitions to `SUBMITTED`).
  2. Perform a partial receipt (e.g. receive 40 of 100 units).
  3. Show PO status change to `PARTIALLY RECEIVED`.
  4. Show the inventory balance incrementing by exactly +40 units, with a `PURCHASE_IN` movement.
  5. Demonstrate idempotency: show that re-submitting with the same receipt key never duplicates stock.

### 5:30 – 6:15 | Reports & Auditing
* **Action**: Open Reports.
* **Demonstration**: Show sales velocity, stock valuation breakdown, and export capabilities.

### 6:15 – 7:00 | Exception Handling & Viva Q&A
* **Action**: Show invalid input recovery, role restriction error messages, and conclude walkthrough.

---

## 🎯 Viva Defense & Examiner Q&A Cheat Sheet

| Question | Defensible Answer |
| :--- | :--- |
| **Why React + NestJS + MySQL?** | *"NestJS provides a modular TypeScript architecture with dependency injection and clean service separation. MySQL InnoDB provides ACID transactions, row-level locking, and strict relational integrity essential for financial/inventory data."* |
| **How do you prevent negative stock under concurrent sales?** | *"We execute atomic conditional updates: `UPDATE inventory_balances SET on_hand = on_hand - :qty WHERE product_id = :id AND on_hand >= :qty`. If affected rows is not 1, the transaction rolls back and returns 409 Conflict."* |
| **Why is your forecasting rule-based instead of ML?** | *"For small and medium enterprises, black-box ML models are prone to hallucinating without massive historical data, and operators cannot audit why a recommendation was made. Our deterministic arithmetic is auditable, explainable, and supports interactive what-if demand simulation."* |
| **How does PO receiving prevent double-receipt?** | *"Every receipt submission requires a client-generated unique `receipt_key` with a database unique constraint and transaction rollback."* |

# KitchenFlow Pro — 7-Minute Demonstration Script

This script walks through the end-to-end operational journey using two browser windows (Waiter POS & Manager / Kitchen Dashboard).

---

## 1. Login & Manager Overview (0:00 - 0:45)
1. Navigate to `http://localhost:5173`.
2. View the public landing page with featured menu items and workflow overview.
3. Sign in as Manager (`manager@kitchenflow.local` / `Password123!`).
4. Inspect Dashboard: KPI cards (Today Sales, Orders, Tables occupied, Live Kitchen alerts).

---

## 2. Table Selection & POS Order Placement (0:45 - 1:45)
1. Open a second window / tab as Waiter (`waiter@kitchenflow.local` / `Password123!`).
2. Navigate to Floor Plan (`/app/tables`) and select an available table (e.g., Table 05).
3. Browse Menu categories (Burgers, Pizza, Drinks) and add items to the cart:
   * 2x Zinger Burger (routed to Grill Station)
   * 1x Margherita Pizza (routed to Oven Station)
   * 2x Cold Coffee (routed to Drinks Station)
4. Add special instructions (e.g. "less spicy").
5. Click **Place Order**. Note the generated order code and server-authoritative calculated totals.

---

## 3. Live Kitchen Display (KDS) (1:45 - 2:45)
1. Switch to the Kitchen workspace (`/app/kitchen`).
2. Filter by station (Grill, Oven, Drinks).
3. Observe items segregated according to their designated preparation station.
4. Advance the Zinger Burger from `QUEUED` to `PREPARING`. Observe timer starting.
5. Demonstrate transition safety: attempt jumping directly to `READY` to show error prevention.

---

## 4. Kitchen Rush Predictor Simulation (2:45 - 4:20)
1. Switch to Manager workspace and navigate to `/app/rush`.
2. Inspect current station queue backlogs and baseline completion ETAs.
3. Select Grill Station:
   * Observe baseline clear time (e.g., 80 minutes with 1 parallel slot).
   * Adjust simulated capacity slider to 2 slots.
   * Observe scenario projection reducing clearance to ~40 minutes.
   * Add 3 hypothetical incoming burgers and inspect the revised bottleneck curve.
4. Demonstrate that live order state and DB records remain completely untouched.

---

## 5. Order Readiness, Cash Settlement & Printable Receipt (4:20 - 5:10)
1. In Kitchen Display, complete prep: mark items as `READY`.
2. Waiter serves dishes: order status advances to `SERVED`.
3. In Cashier Billing (`/app/billing`), pull up the unpaid order for Table 05.
4. Settle with cash payment. Order transitions to `PAID`.
5. Open the printable receipt modal and verify line items, tax, and total.

---

## 6. Live Analytics & Audit Ledger (5:10 - 6:00)
1. Return to Manager Analytics (`/app/reports`).
2. Verify today's paid sales increased exactly by the settled order amount.
3. Review inventory levels and append-only stock movement log.

---

## 7. Security & Business Rule Verification (6:00 - 7:00)
1. Demonstrate API role guard: Waiter attempting to patch menu prices receives `403 Forbidden`.
2. Show database integrity constraints and transaction rollback guarantees.

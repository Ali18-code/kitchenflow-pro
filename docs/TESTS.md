# KitchenFlow Pro — Acceptance Test Suite & Critical Test Cases

| ID | Test Scenario | Input / Action | Expected Result |
|---|---|---|---|
| **T01** | Wrong password or inactive staff | `POST /auth/login` with bad password | `401 Unauthorized`; no JWT issued |
| **T02** | Waiter role attempts menu price edit | Waiter JWT `PATCH /menu/items/1` | `403 Forbidden` enforced by NestJS RolesGuard |
| **T03** | Place dine-in order with empty cart | `POST /orders` with empty `items` array | `400 Bad Request` validation error |
| **T04** | Ingredient race condition | Concurrent orders competing for limited stock | At most one succeeds; stock never drops below 0 |
| **T05** | Order submission retry with idempotency key | Same `idempotencyKey` sent twice | Returns existing order without creating duplicate |
| **T06** | Multi-station order item dispatch | Order with burger and pizza | Burger routes to Grill; pizza routes to Oven |
| **T07** | Invalid kitchen status transition | Attempt `PATCH item_status` directly from `QUEUED` to `READY` | `409 Conflict` (must transition through `PREPARING`) |
| **T08** | Rush Predictor capacity simulation | Simulate Grill station with 1 vs 2 slots | Predicts 50% clearance reduction with zero DB mutations |
| **T09** | Rush Predictor with empty queue | Simulate station with 0 queued items | 0-minute estimated clearance; no division by zero |
| **T10** | Double payment prevention | Pay order once, then attempt second payment | `409 Conflict` (order already paid) |
| **T11** | Cancel queued item before preparation | Cancel `QUEUED` item | Item marked `CANCELLED`; stock restored in ledger |
| **T12** | Cancel item during active preparation | Cancel `PREPARING` item | Rejected for regular waiter; requires manager void |
| **T13** | Conflicting table reservation | Book overlapping time slot on same table | `409 Conflict` table already reserved |
| **T14** | Responsive mobile POS layout | Render POS at 375px mobile viewport | Sticky cart drawer; dish grid adapts cleanly |
| **T15** | Manager revenue report verification | Complete cash payment for order | Paid revenue updates by exact amount once |

# StockPilot Test Suite & Acceptance Scenarios (T01 - T12)

This test matrix verifies that StockPilot is reliable, transaction-safe, and resilient against edge cases.

| ID | Test Scenario | Execution Step | Expected Verification Result |
| :--- | :--- | :--- | :--- |
| **T01** | **Role Separation** | Admin logs in; accesses `/api/v1/users`. Sales staff logs in; requests `/api/v1/users`. | Admin receives `200 OK` with user list; Sales Staff receives `403 Forbidden`. |
| **T02** | **Product & Opening Stock** | Create Category, then create Product with `openingStock: 25`. | Product is saved; `inventory_balances.on_hand == 25`; `stock_movements` contains `OPENING_IN (+25)` movement. |
| **T03** | **Normal Sale** | Sell 2 units from a product with 10 on hand. | `201 Created`; `inventory_balances.on_hand == 8`; `SALE_OUT (-2)` logged; line price snapshotted. |
| **T04** | **Negative Stock Guard** | Attempt to sell 9 units when only 8 remain in stock. | Server returns `409 Conflict` (`INSUFFICIENT_STOCK`); balance remains 8; no sale row created. |
| **T05** | **Race Condition / Concurrency** | Send two simultaneous sale requests for the final 1 unit on hand. | Exactly one request returns `201 Created`; second returns `409 Conflict`; final balance never drops below 0. |
| **T06** | **PO Partial Receipt** | Create PO for 100 units; submit PO; receive 40 units. | PO status transitions to `PARTIALLY RECEIVED`; balance increases by +40; remaining units = 60. |
| **T07** | **Receipt Idempotency** | Re-submit the same receipt payload with the identical `receiptKey`. | Request rejected with conflict / existing receipt returned; inventory is NOT incremented twice. |
| **T08** | **Over-Receipt Guard** | Attempt to receive 70 units on a PO line with only 60 units remaining. | Returns `409 Conflict`; transaction aborts; inventory and PO line remain unchanged. |
| **T09** | **Sale Void & Stock Reversal (P1)** | Void a completed sale of 2 units; attempt to void it a second time. | First void restores +2 to balance and logs `SALE_VOID_IN`; second void rejected with error. |
| **T10** | **Forecast Math Validation** | Set daily demand to 12/day with on-hand 120 and lead time 7. | Displays exactly 10.0 days of cover; formulas strictly match configured constants. |
| **T11** | **Forecast Edge Cases (Zero/Thin)** | Query Forecast Studio for a brand new product with 0 sales history. | Renders explicit "Not estimable / Limited history" state; never outputs `NaN`, `null`, or `Infinity`. |
| **T12** | **Mobile Responsiveness (P1)** | Shrink viewport to 360px width. | Tables scroll horizontally with sticky headers; navigation folds into drawer without broken layout. |

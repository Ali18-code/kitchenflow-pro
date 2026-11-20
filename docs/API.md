# StockPilot REST API Contract (`/api/v1`)

All endpoints return a standardized JSON envelope with consistent status codes and error payloads.

---

## 1. Authentication & Users

### `POST /api/v1/auth/login`
* **Access**: Public
* **Body**:
  ```json
  { "email": "admin@stockpilot.local", "password": "Password123!" }
  ```
* **Response (200 OK)**:
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "name": "Admin Operator",
      "email": "admin@stockpilot.local",
      "role": "ADMIN"
    }
  }
  ```

### `GET /api/v1/auth/me`
* **Access**: Authenticated (`ADMIN`, `INVENTORY_MANAGER`, `SALES_STAFF`)
* **Response (200 OK)**: Current user profile object.

### `GET /api/v1/users`
* **Access**: `ADMIN` only
* **Response (200 OK)**: Array of staff accounts with roles and `is_active` flags.

### `POST /api/v1/users`
* **Access**: `ADMIN` only
* **Body**: `{ "name": "...", "email": "...", "password": "...", "role": "..." }`
* **Response (201 Created)**: Created user without password hash.

### `PATCH /api/v1/users/:id`
* **Access**: `ADMIN` only
* **Body**: `{ "role": "...", "is_active": true/false }`
* **Response (200 OK)**: Updated user.

---

## 2. Categories & Products

### `GET /api/v1/categories`
* **Access**: All logged-in roles
* **Response (200 OK)**: List of product categories.

### `POST /api/v1/categories`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Body**: `{ "name": "Cables & Connectors", "description": "High-speed cables" }`

### `GET /api/v1/products`
* **Access**: All logged-in roles
* **Query Params**: `page=1&limit=20&q=cable&categoryId=2&activeOnly=true`
* **Response (200 OK)**: Paginated products with on-hand balance and stock status.

### `POST /api/v1/products`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Body**:
  ```json
  {
    "sku": "CAB-USB4-01",
    "name": "USB4 40Gbps Cable 1m",
    "categoryId": 1,
    "costPrice": 12.50,
    "sellPrice": 24.99,
    "reorderLevel": 15,
    "openingStock": 50
  }
  ```
* **Effect**: Inserts product, creates `inventory_balances` record, and appends `OPENING_IN` movement.

### `GET /api/v1/products/:id`
* **Access**: All logged-in roles
* **Response (200 OK)**: Product details with on-hand units, movement history, and linked suppliers.

### `PATCH /api/v1/products/:id`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Body**: `{ "name": "...", "costPrice": 14.00, "sellPrice": 27.99, "reorderLevel": 20 }`

---

## 3. Inventory & Movements

### `GET /api/v1/inventory/movements`
* **Access**: All logged-in roles
* **Query Params**: `productId=42&type=SALE_OUT&from=2026-11-01&to=2026-11-20`
* **Response (200 OK)**: Audit list of stock movements with actor and reference details.

### `POST /api/v1/inventory/adjustments`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Body**:
  ```json
  {
    "productId": 42,
    "delta": -3,
    "reason": "Damaged goods during warehouse audit"
  }
  ```
* **Effect**: Transactionally updates `inventory_balances.on_hand` and appends `ADJUST_OUT` movement.

---

## 4. Sales

### `GET /api/v1/sales`
* **Access**: `ADMIN`, `INVENTORY_MANAGER` (all sales); `SALES_STAFF` (own sales)
* **Response (200 OK)**: Paginated sales ledger with line totals.

### `POST /api/v1/sales`
* **Access**: `SALES_STAFF`, `ADMIN`
* **Headers**: `Idempotency-Key: <UUID>` (optional recommended)
* **Body**:
  ```json
  {
    "items": [
      { "productId": 42, "quantity": 2 }
    ]
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "saleId": 105,
    "saleNumber": "SAL-2026-0105",
    "subtotal": 49.98,
    "items": [
      { "productId": 42, "productName": "USB4 Cable", "quantity": 2, "unitPrice": 24.99, "lineTotal": 49.98 }
    ],
    "createdAt": "2026-11-20T16:00:00.000Z"
  }
  ```
* **Error Response (409 Conflict)**:
  ```json
  {
    "statusCode": 409,
    "error": "INSUFFICIENT_STOCK",
    "message": "Product CAB-USB4-01 has only 1 units available (requested 2)"
  }
  ```

### `GET /api/v1/sales/:id`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`, creator `SALES_STAFF`
* **Response (200 OK)**: Sale receipt with snapshot prices.

### `POST /api/v1/sales/:id/void`
* **Access**: `ADMIN`
* **Effect**: Sets status to `VOID`, reverts inventory balance atomically, and logs `SALE_VOID_IN` movements. Second attempt returns `400 / 409`.

---

## 5. Suppliers & Purchase Orders

### `GET /api/v1/suppliers`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Response (200 OK)**: Suppliers list with linked product counts.

### `POST /api/v1/suppliers`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Body**: `{ "name": "Global Tech Logistics", "email": "sales@gtl.com", "phone": "+1-555-0199", "defaultLeadDays": 7 }`

### `POST /api/v1/suppliers/:id/products`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Body**: `{ "productId": 42, "unitCost": 12.00, "leadDays": 7, "isPreferred": true }`

### `GET /api/v1/purchase-orders`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Query Params**: `status=SUBMITTED`
* **Response (200 OK)**: List of purchase orders.

### `POST /api/v1/purchase-orders`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Body**:
  ```json
  {
    "supplierId": 4,
    "items": [
      { "productId": 42, "orderedQty": 100, "unitCost": 12.00 }
    ]
  }
  ```
* **Response (201 Created)**: Status is initialized as `DRAFT`.

### `POST /api/v1/purchase-orders/:id/submit`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Effect**: Transitions status from `DRAFT` $\to$ `SUBMITTED`.

### `POST /api/v1/purchase-orders/:id/receipts`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Body**:
  ```json
  {
    "receiptKey": "rcpt-uuid-20261120-001",
    "items": [
      { "poItemId": 12, "receivedQty": 40 }
    ]
  }
  ```
* **Effect**:
  * Validates `receivedQty <= (orderedQty - previouslyReceived)`.
  * Increases `inventory_balances.on_hand` by received units.
  * Appends `PURCHASE_IN` movement to ledger.
  * Transitions PO status to `PARTIAL` or `RECEIVED`.
  * Duplicate `receiptKey` returns 409 or cached result without re-incrementing stock.

---

## 6. Forecast Studio & Analytics

### `GET /api/v1/forecast/products/:id`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Response (200 OK)**:
  ```json
  {
    "productId": 42,
    "onHand": 120,
    "incomingUnits": 0,
    "soldUnitsLast14Days": 168,
    "dailyDemand": 12.0,
    "defaultLeadDays": 7,
    "safetyDays": 3,
    "reviewDays": 7,
    "daysCover": 10.0,
    "reorderPoint": 120,
    "targetUnits": 204,
    "suggestedOrder": 84,
    "riskStatus": "REORDER_NOW"
  }
  ```

### `POST /api/v1/forecast/simulate`
* **Access**: `ADMIN`, `INVENTORY_MANAGER`
* **Body**:
  ```json
  {
    "productId": 42,
    "dailyDemandOverride": 18,
    "leadDays": 7,
    "safetyDays": 3,
    "reviewDays": 7
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "productId": 42,
    "onHand": 120,
    "dailyDemand": 18.0,
    "daysCover": 6.67,
    "reorderPoint": 180,
    "targetUnits": 306,
    "suggestedOrder": 186,
    "riskStatus": "CRITICAL",
    "basis": "MANUAL_OVERRIDE"
  }
  ```

### `GET /api/v1/dashboard/summary`
* **Access**: All logged-in roles
* **Response (200 OK)**: Active product counts, estimated stock value, low-stock alerts, open POs count, and 7-day sales activity trend.

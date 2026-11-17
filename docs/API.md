# KitchenFlow Pro — API Specification

Base URL: `/api/v1`

All responses follow standard HTTP status codes and JSON envelopes:
- `200 OK` / `201 Created`
- `400 Bad Request` (Validation errors)
- `401 Unauthorized` (Missing or invalid JWT)
- `403 Forbidden` (Insufficient role permissions)
- `404 Not Found`
- `409 Conflict` (Business rule or stock/idempotency violation)

---

## 1. Authentication & Session

### `POST /api/v1/auth/login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "manager@kitchenflow.local",
    "password": "Password123!"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "accessToken": "jwt_token_string",
    "user": {
      "id": 1,
      "name": "Head Chef & Manager",
      "email": "manager@kitchenflow.local",
      "role": "manager"
    }
  }
  ```

### `GET /api/v1/auth/me`
* **Access**: Authenticated (`manager`, `waiter`, `kitchen`, `cashier`)
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "name": "Head Chef & Manager",
    "email": "manager@kitchenflow.local",
    "role": "manager"
  }
  ```

---

## 2. Prep Stations & Tables

### `GET /api/v1/stations`
* **Access**: Authenticated

### `PATCH /api/v1/stations/:id`
* **Access**: Manager
* **Request Body**:
  ```json
  {
    "capacitySlots": 2,
    "waitWarnMin": 25
  }
  ```

### `GET /api/v1/tables`
* **Access**: Manager, Waiter
* **Response**: List of tables with status (free / occupied / reserved) derived from active orders.

---

## 3. Menu & Categories

### `GET /api/v1/menu/categories`
* **Access**: All

### `GET /api/v1/menu/items`
* **Access**: All
* **Query Params**: `categoryId`, `search`, `availableOnly`

### `POST /api/v1/menu/items`
* **Access**: Manager

---

## 4. Orders & POS

### `POST /api/v1/orders`
* **Access**: Waiter, Manager
* **Request Body**:
  ```json
  {
    "orderType": "DINE_IN",
    "tableId": 5,
    "idempotencyKey": "order-20261117-uuid",
    "items": [
      { "menuItemId": 1, "quantity": 2, "notes": "No onions" },
      { "menuItemId": 4, "quantity": 1 }
    ]
  }
  ```
* **Response `201 Created`**: Returns order with calculated subtotal, tax, total, and created order items with `QUEUED` status.

### `GET /api/v1/orders`
* **Access**: Staff
* **Query Params**: `status`, `orderType`, `search`

---

## 5. Kitchen Display System (KDS)

### `GET /api/v1/kitchen/tickets`
* **Access**: Kitchen, Manager
* **Query Params**: `stationId`

### `PATCH /api/v1/order-items/:id/status`
* **Access**: Kitchen, Waiter
* **Request Body**:
  ```json
  {
    "status": "PREPARING" // or "READY", "SERVED"
  }
  ```

---

## 6. Kitchen Rush Predictor

### `GET /api/v1/rush/summary`
* **Access**: Manager
* **Response**: Per-station active load, queued counts, and baseline projected clear times.

### `POST /api/v1/rush/simulate`
* **Access**: Manager
* **Constraint**: Strictly read-only simulation. Never mutates live orders or inventory.
* **Request Body**:
  ```json
  {
    "scenario": {
      "stationId": 1,
      "capacitySlots": 2,
      "extraIncoming": [
        { "menuItemId": 1, "quantity": 3 }
      ]
    }
  }
  ```
* **Response**: Baseline ETAs vs simulated ETAs, clearance difference, affected orders, risk flags.

---

## 7. Billing & Payments

### `GET /api/v1/billing/unpaid`
* **Access**: Cashier, Manager

### `POST /api/v1/payments`
* **Access**: Cashier, Manager
* **Request Body**:
  ```json
  {
    "orderId": 12,
    "amount": 2450.00,
    "method": "CASH"
  }
  ```

---

## 8. Analytics & Reports

### `GET /api/v1/analytics/overview`
* **Access**: Manager
* **Response**: Today's sales, paid orders count, active tables count, low stock alert count.

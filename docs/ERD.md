# KitchenFlow Pro — Entity Relationship Diagram (ERD)

## Database Engine & Standards
* **Engine**: MySQL 8.0+ / InnoDB
* **Collation**: `utf8mb4_unicode_ci`
* **Numeric Precisions**: Prices, subtotals, taxes, and amounts use `DECIMAL(12,2)`
* **Auditability**: All state-changing entities include timestamps (`created_at`, `updated_at`)

---

## Entity Definitions & Fields

### 1. `users`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `name` VARCHAR(100) NOT NULL
* `email` VARCHAR(150) NOT NULL UNIQUE
* `password_hash` VARCHAR(255) NOT NULL
* `role` ENUM('manager', 'waiter', 'kitchen', 'cashier') NOT NULL
* `active` BOOLEAN NOT NULL DEFAULT TRUE
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### 2. `prep_stations`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `name` VARCHAR(80) NOT NULL UNIQUE (e.g., 'Grill', 'Oven', 'Fryer', 'Drinks')
* `capacity_slots` INT NOT NULL DEFAULT 1 (CHECK capacity_slots >= 1)
* `wait_warn_min` INT NOT NULL DEFAULT 20
* `active` BOOLEAN NOT NULL DEFAULT TRUE
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### 3. `staff_stations` (Many-to-Many Join)
* `user_id` BIGINT NOT NULL, FK -> `users(id)` ON DELETE CASCADE
* `station_id` BIGINT NOT NULL, FK -> `prep_stations(id)` ON DELETE CASCADE
* PRIMARY KEY (`user_id`, `station_id`)

### 4. `restaurant_tables`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `label` VARCHAR(50) NOT NULL UNIQUE (e.g., 'Table 01', 'Table 02')
* `seats` INT NOT NULL DEFAULT 4 (CHECK seats >= 1)
* `enabled` BOOLEAN NOT NULL DEFAULT TRUE
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### 5. `menu_categories`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `name` VARCHAR(100) NOT NULL UNIQUE
* `sort_order` INT NOT NULL DEFAULT 0
* `enabled` BOOLEAN NOT NULL DEFAULT TRUE
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### 6. `menu_items`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `category_id` BIGINT NOT NULL, FK -> `menu_categories(id)`
* `station_id` BIGINT NOT NULL, FK -> `prep_stations(id)`
* `name` VARCHAR(120) NOT NULL
* `price` DECIMAL(12,2) NOT NULL (CHECK price >= 0)
* `prep_minutes` INT NOT NULL DEFAULT 10 (CHECK prep_minutes > 0)
* `available` BOOLEAN NOT NULL DEFAULT TRUE
* `image_url` VARCHAR(255) NULL
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### 7. `ingredients`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `name` VARCHAR(100) NOT NULL UNIQUE
* `unit` VARCHAR(20) NOT NULL (e.g., 'pcs', 'grams', 'ml')
* `stock_qty` DECIMAL(12,2) NOT NULL DEFAULT 0.00 (CHECK stock_qty >= 0)
* `reorder_qty` DECIMAL(12,2) NOT NULL DEFAULT 10.00
* `active` BOOLEAN NOT NULL DEFAULT TRUE
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### 8. `recipe_items`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `menu_item_id` BIGINT NOT NULL, FK -> `menu_items(id)` ON DELETE CASCADE
* `ingredient_id` BIGINT NOT NULL, FK -> `ingredients(id)` ON DELETE CASCADE
* `qty_per_item` DECIMAL(12,2) NOT NULL (CHECK qty_per_item > 0)
* UNIQUE KEY `uk_recipe_menu_ingredient` (`menu_item_id`, `ingredient_id`)

### 9. `orders`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `order_code` VARCHAR(50) NOT NULL UNIQUE (e.g., 'ORD-20261117-001')
* `table_id` BIGINT NULL, FK -> `restaurant_tables(id)`
* `order_type` ENUM('DINE_IN', 'TAKEAWAY') NOT NULL DEFAULT 'DINE_IN'
* `status` ENUM('PLACED', 'PREPARING', 'READY', 'SERVED', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PLACED'
* `created_by` BIGINT NOT NULL, FK -> `users(id)`
* `subtotal` DECIMAL(12,2) NOT NULL DEFAULT 0.00
* `discount` DECIMAL(12,2) NOT NULL DEFAULT 0.00
* `tax` DECIMAL(12,2) NOT NULL DEFAULT 0.00
* `total` DECIMAL(12,2) NOT NULL DEFAULT 0.00
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
* INDEX `idx_orders_status_created` (`order_type`, `status`, `created_at`)

### 10. `order_items`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `order_id` BIGINT NOT NULL, FK -> `orders(id)` ON DELETE CASCADE
* `menu_item_id` BIGINT NOT NULL, FK -> `menu_items(id)`
* `station_id` BIGINT NOT NULL, FK -> `prep_stations(id)`
* `qty` INT NOT NULL DEFAULT 1 (CHECK qty >= 1)
* `unit_price` DECIMAL(12,2) NOT NULL (snapshot at time of ordering)
* `prep_minutes` INT NOT NULL (snapshot at time of ordering)
* `item_status` ENUM('QUEUED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED') NOT NULL DEFAULT 'QUEUED'
* `notes` VARCHAR(255) NULL
* `started_at` TIMESTAMP NULL
* `ready_at` TIMESTAMP NULL
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
* INDEX `idx_order_items_station_status` (`station_id`, `item_status`, `created_at`)

### 11. `stock_movements` (Append-Only Ledger)
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `ingredient_id` BIGINT NOT NULL, FK -> `ingredients(id)`
* `order_item_id` BIGINT NULL, FK -> `order_items(id)`
* `movement_type` ENUM('CONSUMPTION', 'REVERSAL', 'RESTOCK', 'ADJUSTMENT') NOT NULL
* `qty_delta` DECIMAL(12,2) NOT NULL (negative for consumption, positive for restock/reversal)
* `reason` VARCHAR(255) NOT NULL
* `created_by` BIGINT NOT NULL, FK -> `users(id)`
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* UNIQUE KEY `uk_order_ingredient_movement` (`order_item_id`, `ingredient_id`, `movement_type`)

### 12. `payments`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `order_id` BIGINT NOT NULL UNIQUE, FK -> `orders(id)`
* `amount` DECIMAL(12,2) NOT NULL
* `method` ENUM('CASH') NOT NULL DEFAULT 'CASH'
* `status` ENUM('COMPLETED', 'FAILED') NOT NULL DEFAULT 'COMPLETED'
* `reference` VARCHAR(100) NULL
* `collected_by` BIGINT NOT NULL, FK -> `users(id)`
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 13. `reservations`
* `id` BIGINT AUTO_INCREMENT PRIMARY KEY
* `table_id` BIGINT NOT NULL, FK -> `restaurant_tables(id)`
* `guest_name` VARCHAR(100) NOT NULL
* `contact` VARCHAR(50) NOT NULL
* `guests` INT NOT NULL DEFAULT 2
* `start_at` DATETIME NOT NULL
* `end_at` DATETIME NOT NULL
* `status` ENUM('PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') NOT NULL DEFAULT 'CONFIRMED'
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
* INDEX `idx_res_table_window` (`table_id`, `start_at`, `end_at`, `status`)

### 14. `restaurant_settings`
* `id` INT PRIMARY KEY DEFAULT 1
* `tax_rate` DECIMAL(5,4) NOT NULL DEFAULT 0.0500 (5%)
* `service_rate` DECIMAL(5,4) NOT NULL DEFAULT 0.0000 (0%)
* `currency_code` VARCHAR(10) NOT NULL DEFAULT 'PKR'
* `opening_hours` JSON NULL
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

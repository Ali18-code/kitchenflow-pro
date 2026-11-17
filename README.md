# KitchenFlow Pro 🍽️⏱️
> **Smart Restaurant Operations, Intelligence & Kitchen Management Platform**  
> Complete Full-Stack Semester Build Blueprint (React + Vite + Bootstrap 5 / NestJS + TypeORM / MySQL 8)

---

## 🚀 Overview
KitchenFlow Pro connects dine-in restaurant operations, table occupancy, kitchen preparation stations, ingredient inventory, billing, and management analytics into a unified platform. 

The highlight is an interactive **Kitchen Rush Predictor**: a deterministic multi-slot FIFO capacity simulation engine that projects queue clearance and bottleneck improvements without altering live production orders.

### Core Workspaces
* **Manager**: Real-time sales KPIs, dish/station management, inventory restock, staff roles, and rush simulation.
* **Waiter / POS**: Interactive floor plan, menu categories, notes/customizations, server-authoritative cart calculation, and order submission.
* **Kitchen Staff**: Station-scoped order tickets, item progression timers (`QUEUED` $\to$ `PREPARING` $\to$ `READY`), and delay alerts.
* **Cashier**: Unpaid orders registry, cash settlement with idempotency, and printable receipts.

---

## 🛠️ Tech Stack
* **Frontend**: React 18, Vite, Bootstrap 5, Custom CSS Tokens (`Modern Culinary Operations` theme), React Router 6, Chart.js / `react-chartjs-2`, Lucide Icons.
* **Backend**: NestJS 10, TypeScript, TypeORM, MySQL 8 (InnoDB, UTF8MB4), Passport JWT, `class-validator`.
* **Database**: MySQL 8.0 relational database with row locking (`SELECT FOR UPDATE`), foreign key constraints, and transactional stock deductions.

---

## 📁 Repository Structure
```
kitchenflow-pro/
├── frontend/             # React + Vite client application
│   ├── src/
│   │   ├── app/          # Routes, Auth Provider, AppShell, Navigation
│   │   ├── components/   # Badges, Modals, Tables, UI Controls
│   │   ├── features/     # Feature modules (auth, dashboard, pos, kitchen, rush, etc.)
│   │   ├── services/     # Axios API client and endpoints
│   │   └── styles/       # CSS variables & Modern Culinary Operations theme
│   └── package.json
├── backend/              # NestJS REST API
│   ├── src/
│   │   ├── auth/         # JWT authentication & role-based guards
│   │   ├── users/        # Staff accounts & station assignments
│   │   ├── menu/         # Categories & menu items
│   │   ├── stations/     # Preparation station capacity & queues
│   │   ├── tables/       # Restaurant table layout & occupancy
│   │   ├── orders/       # Transactional order placement & state machine
│   │   ├── kitchen/      # KDS tickets & item progression
│   │   ├── rush/         # Deterministic FIFO queue simulation engine
│   │   ├── inventory/    # Ingredients & append-only stock movement ledger
│   │   ├── payments/     # Cash settlement & idempotency
│   │   └── analytics/    # Sales, station load, and popularity metrics
│   └── package.json
├── docs/                 # Architectural specifications
│   ├── ERD.md            # Database schema & entity relationships
│   ├── API.md            # REST API contract & endpoints
│   ├── TESTS.md          # Critical acceptance test cases
│   └── DEMO.md           # 7-minute viva walkthrough script
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
* Node.js v18+ & npm
* MySQL Server 8.0+ running on port 3306

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Ensure your MySQL credentials are set in .env
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Seed Accounts for Demonstration
* **Manager**: `manager@kitchenflow.local` / `Password123!`
* **Waiter**: `waiter@kitchenflow.local` / `Password123!`
* **Kitchen Staff**: `kitchen@kitchenflow.local` / `Password123!`
* **Cashier**: `cashier@kitchenflow.local` / `Password123!`

---

## 📜 License
Academic & Educational project — Full Stack Development Semester Build.

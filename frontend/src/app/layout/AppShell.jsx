import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  Package,
  LayoutDashboard,
  Boxes,
  Layers,
  ShoppingCart,
  Truck,
  FileSpreadsheet,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  UserCheck,
} from 'lucide-react';

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'INVENTORY_MANAGER', 'SALES_STAFF'] },
    { name: 'Products', path: '/app/products', icon: Boxes, roles: ['ADMIN', 'INVENTORY_MANAGER', 'SALES_STAFF'] },
    { name: 'Inventory Ledger', path: '/app/inventory', icon: Layers, roles: ['ADMIN', 'INVENTORY_MANAGER'] },
    { name: 'Sales & POS', path: '/app/sales', icon: ShoppingCart, roles: ['ADMIN', 'INVENTORY_MANAGER', 'SALES_STAFF'] },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: ['ADMIN', 'INVENTORY_MANAGER'] },
    { name: 'Purchase Orders', path: '/app/purchases', icon: FileSpreadsheet, roles: ['ADMIN', 'INVENTORY_MANAGER'] },
    { name: 'Forecast Studio', path: '/app/forecast', icon: TrendingUp, roles: ['ADMIN', 'INVENTORY_MANAGER', 'SALES_STAFF'] },
    { name: 'Reports', path: '/app/reports', icon: BarChart3, roles: ['ADMIN', 'INVENTORY_MANAGER'] },
    { name: 'Settings & Audit', path: '/app/settings', icon: Settings, roles: ['ADMIN'] },
  ];

  const visibleNav = navItems.filter((item) => !user?.role || item.roles.includes(user.role));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--sp-cloud)', fontFamily: 'var(--font-sans)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--sp-midnight)',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--sp-radius-sm)',
              backgroundColor: 'var(--sp-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1.125rem', letterSpacing: '-0.02em' }}>
              Stock<span style={{ color: 'var(--sp-emerald)' }}>Pilot</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Inventory & Ops</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--sp-radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? 'rgba(20, 184, 138, 0.15)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--sp-emerald)' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                })}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div
          style={{
            padding: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sp-emerald)',
                }}
              >
                <UserCheck size={16} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#F8FAFC', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Operator'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{user?.role || 'Staff'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Topbar */}
        <header
          style={{
            height: '60px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--sp-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--sp-slate-light)' }}>
            <span>StockPilot</span>
            <span>/</span>
            <span style={{ fontWeight: '600', color: 'var(--sp-slate)' }}>Workspace</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                backgroundColor: 'var(--sp-emerald-soft)',
                color: 'var(--sp-emerald)',
              }}
            >
              ● Phase 1 Online
            </span>
          </div>
        </header>

        {/* Routed Screen Outlet */}
        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

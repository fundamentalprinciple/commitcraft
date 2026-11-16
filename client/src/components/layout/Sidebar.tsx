import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Scroll,
  Trophy,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Skull,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import XPBar from '../gamification/XPBar';
import CoinDisplay from '../gamification/CoinDisplay';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/island', icon: Map, label: 'Haunted Island' },
  { to: '/quests', icon: Scroll, label: 'Quests' },
  { to: '/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/teams', icon: Users, label: 'Teams' },
  { to: '/leaderboard', icon: BarChart3, label: 'Leaderboard' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-halloween-purple/20">
        <div className="w-9 h-9 rounded-xl bg-halloween-orange/20 flex items-center justify-center animate-pulse-glow">
          <Skull size={20} className="text-halloween-orange" />
        </div>
        <div>
          <h1 className="font-cinzel font-bold text-halloween-ghost text-sm leading-tight">
            CommitCraft
          </h1>
          <p className="text-halloween-ghost-dim text-xs">GitHub Gamification</p>
        </div>
      </div>

      {/* User stats */}
      {user && (
        <div className="px-4 py-4 border-b border-halloween-purple/20">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-9 h-9 rounded-full border-2 border-halloween-orange/40"
            />
            <div className="min-w-0">
              <p className="text-halloween-ghost text-sm font-semibold truncate">
                {user.displayName}
              </p>
              <p className="text-halloween-ghost-dim text-xs truncate">@{user.username}</p>
            </div>
          </div>
          <XPBar xp={user.xp} level={user.level} compact showLabel={false} />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-halloween-ghost-dim">
              Lvl <span className="text-halloween-orange font-semibold">{user.level}</span>
            </span>
            <CoinDisplay coins={user.coins} size="sm" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-halloween-orange/15 text-halloween-orange border border-halloween-orange/20 shadow-halloween'
                  : 'text-halloween-ghost-muted hover:text-halloween-ghost hover:bg-halloween-purple/15'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-halloween-purple/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-halloween-ghost-muted hover:text-halloween-red hover:bg-halloween-red/10 transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-halloween-violet border border-halloween-purple/40 flex items-center justify-center text-halloween-ghost"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-halloween-darker border-r border-halloween-purple/20 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-halloween-darker border-r border-halloween-purple/20 h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;

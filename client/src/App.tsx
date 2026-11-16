import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/authStore';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import {
  IslandPage,
  QuestsPage,
  AchievementsPage,
  TeamsPage,
  LeaderboardPage,
  SettingsPage,
} from './pages/PlaceholderPages';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-halloween-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-halloween-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-halloween-ghost-muted text-sm font-cinzel">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E1035',
            color: '#E8E8F0',
            border: '1px solid rgba(74,27,109,0.5)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: { primary: '#00FF88', secondary: '#070710' },
          },
          error: {
            iconTheme: { primary: '#FF2D2D', secondary: '#070710' },
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/island" element={<IslandPage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Login from './components/login_signUp/Login';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Operational Components
import ControlCenter from './components/manager/ControlCenter';
import TripDispatcher from './components/dispatch_and_manage/TripDispatcher';
import OperationalAnalytics from './components/analytics_page/OperationalAnalytics';
import DriverManagement from './components/driver_page/DriverManagement';
import ExpenseLogging from './components/Expence_page/ExpenseLogging';
import DriverDetail from './components/driver_page/DriverDetail';
import VehicleRegistry from './components/vehicle_register/VehicleRegistry';
import MaintenanceLogs from './components/service_log/MaintenanceLogs';

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper to determine the default home page based on role
  const getHomeRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
      case 'FLEET_MANAGER':
        return <Navigate to="/dashboard" replace />;
      case 'DISPATCHER':
        return <Navigate to="/dispatch" replace />;
      case 'FINANCIAL_ANALYST':
      case 'ADMIN':
        return <Navigate to="/analytics" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      {/* Public Gateway */}
      <Route path="/login" element={user ? getHomeRedirect() : <Login />} />

      {/* Internal Protected Area */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>

        {/* Core Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'ADMIN']}>
            <ControlCenter />
          </ProtectedRoute>
        } />

        {/* Terminal Routes */}
        <Route path="/vehicles" element={
          <ProtectedRoute allowedRoles={['DISPATCHER', 'FLEET_MANAGER', 'ADMIN']}>
            <VehicleRegistry />
          </ProtectedRoute>
        } />

        <Route path="/dispatch" element={
          <ProtectedRoute allowedRoles={['DISPATCHER', 'FLEET_MANAGER', 'ADMIN']}>
            <TripDispatcher />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['FINANCIAL_ANALYST', 'FLEET_MANAGER', 'ADMIN']}>
            <OperationalAnalytics onNavigateToDrivers={() => navigate('/drivers')} />
          </ProtectedRoute>
        } />

        <Route path="/expenses" element={
          <ProtectedRoute allowedRoles={['FINANCIAL_ANALYST', 'FLEET_MANAGER', 'ADMIN']}>
            <ExpenseLogging />
          </ProtectedRoute>
        } />

        <Route path="/drivers" element={
          <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'ADMIN']}>
            <DriverManagement />
          </ProtectedRoute>
        } />

        <Route path="/drivers/:id" element={
          <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'ADMIN']}>
            <DriverDetail />
          </ProtectedRoute>
        } />

        <Route path="/maintenance" element={
          <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'ADMIN']}>
            <MaintenanceLogs />
          </ProtectedRoute>
        } />

      </Route>

      {/* Access Control Redirections */}
      <Route path="/" element={getHomeRedirect()} />
      <Route path="*" element={getHomeRedirect()} />
    </Routes>
  );
}

export default App;

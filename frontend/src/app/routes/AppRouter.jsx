import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Login from '../../pages/Auth/Login';
import Signup from '../../pages/Auth/Signup';
import ForgotPassword from '../../pages/Auth/ForgotPassword';
import Focus from '../../pages/Focus/Focus';
import Calendar from '../../pages/Calendar/Calendar';
import Goals from '../../pages/Goals/Goals';
import Habits from '../../pages/Habits/Habits';
import Analytics from '../../pages/Analytics/Analytics';
import Settings from '../../pages/Settings/Settings';
import AI from '../../pages/AI/AI';
import Tasks from '../../pages/Tasks/Tasks';
import Profile from '../../pages/Profile/Profile';
import { useAuthStore } from "../../store/authStore"; // adjust path if needed

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-assistant" element={<AI />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="flex h-screen items-center justify-center">404 - Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

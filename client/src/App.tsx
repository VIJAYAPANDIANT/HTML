import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './modules/landing/LandingPage';
import LoginPage from './modules/auth/LoginPage';
import RegisterPage from './modules/auth/RegisterPage';
import DashboardPage from './modules/dashboard/DashboardPage';
import AiCenterPage from './modules/ai-center/AiCenterPage';
import OrganizationsPage from './modules/organizations/OrganizationsPage';
import IndustryPage from './modules/industry/IndustryPage';
import AnalyticsPage from './modules/analytics/AnalyticsPage';
import ReportsPage from './modules/reports/ReportsPage';
import NotificationsPage from './modules/notifications/NotificationsPage';
import SettingsPage from './modules/settings/SettingsPage';
import ProfilePage from './modules/profile/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes with Sidebar Layout */}
        <Route
          path="/*"
          element={
            <AppLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="ai-center" element={<AiCenterPage />} />
                <Route path="organizations" element={<OrganizationsPage />} />
                <Route path="industry" element={<IndustryPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                
                {/* Fallback Redirect */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

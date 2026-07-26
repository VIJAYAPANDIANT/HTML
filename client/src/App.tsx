import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AgriculturePage from './modules/industry/AgriculturePage';
import ErrorBoundary from './components/ui/ErrorBoundary';
import NotFoundPage from './modules/error/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
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
                  <Route path="agriculture" element={<AgriculturePage />} />
                  <Route path="healthcare" element={<IndustryPage />} />
                  <Route path="manufacturing" element={<IndustryPage />} />
                  <Route path="smart-city" element={<IndustryPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  
                  {/* Fallback to custom 404 page inside layout */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

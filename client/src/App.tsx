import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './modules/auth/LoginPage';
import DashboardPage from './modules/dashboard/DashboardPage';
import AiCenterPage from './modules/ai-center/AiCenterPage';
import OrganizationsPage from './modules/organizations/OrganizationsPage';
import IndustryPage from './modules/industry/IndustryPage';
import AnalyticsPage from './modules/analytics/AnalyticsPage';
import ReportsPage from './modules/reports/ReportsPage';
import NotificationsPage from './modules/notifications/NotificationsPage';
import SettingsPage from './modules/settings/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<LoginPage />} />

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

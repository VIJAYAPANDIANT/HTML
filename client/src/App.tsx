import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Dynamic lazy imports for route code-splitting
const LandingPage = lazy(() => import('./modules/landing/LandingPage'));
const LoginPage = lazy(() => import('./modules/auth/LoginPage'));
const RegisterPage = lazy(() => import('./modules/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./modules/dashboard/DashboardPage'));
const AiCenterPage = lazy(() => import('./modules/ai-center/AiCenterPage'));
const OrganizationsPage = lazy(() => import('./modules/organizations/OrganizationsPage'));
const IndustryPage = lazy(() => import('./modules/industry/IndustryPage'));
const AnalyticsPage = lazy(() => import('./modules/analytics/AnalyticsPage'));
const ReportsPage = lazy(() => import('./modules/reports/ReportsPage'));
const NotificationsPage = lazy(() => import('./modules/notifications/NotificationsPage'));
const SettingsPage = lazy(() => import('./modules/settings/SettingsPage'));
const ProfilePage = lazy(() => import('./modules/profile/ProfilePage'));
const AgriculturePage = lazy(() => import('./modules/industry/AgriculturePage'));
const HealthcarePage = lazy(() => import('./modules/industry/HealthcarePage'));
const ManufacturingPage = lazy(() => import('./modules/industry/ManufacturingPage'));
const SmartCityPage = lazy(() => import('./modules/industry/SmartCityPage'));
const SustainabilityDashboardPage = lazy(() => import('./modules/industry/SustainabilityDashboardPage'));
const UploadCenterPage = lazy(() => import('./modules/upload/UploadCenterPage'));
const NotFoundPage = lazy(() => import('./modules/error/NotFoundPage'));

// Glassmorphic loading fallback for smooth UX transitions
const LoadingView = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0B0F19] text-white space-y-4">
    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider animate-pulse">Syncing neural pipelines...</span>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingView />}>
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
                  <Suspense fallback={<LoadingView />}>
                    <Routes>
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="ai-center" element={<AiCenterPage />} />
                      <Route path="organizations" element={<OrganizationsPage />} />
                      <Route path="industry" element={<IndustryPage />} />
                      <Route path="agriculture" element={<AgriculturePage />} />
                      <Route path="healthcare" element={<HealthcarePage />} />
                      <Route path="manufacturing" element={<ManufacturingPage />} />
                      <Route path="smart-city" element={<SmartCityPage />} />
                      <Route path="sustainability" element={<SustainabilityDashboardPage />} />
                      <Route path="analytics" element={<AnalyticsPage />} />
                      <Route path="reports" element={<ReportsPage />} />
                      <Route path="uploads" element={<UploadCenterPage />} />
                      <Route path="notifications" element={<NotificationsPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      
                      {/* Fallback to custom 404 page inside layout */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </AppLayout>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

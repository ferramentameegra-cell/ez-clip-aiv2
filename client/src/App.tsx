import { Route, Switch, Router, useLocation } from 'wouter';
import { Home } from '@/pages/Home';
import { Dashboard } from '@/pages/Dashboard';
import { MyRetentionVideos } from '@/pages/MyRetentionVideos';
import { JobsList } from '@/pages/JobsList';
import { JobDetail } from '@/pages/JobDetail';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { Education } from '@/pages/Education';
import { TermsOfUse } from '@/pages/TermsOfUse';
import { Billing } from '@/pages/Billing';
import { Onboarding } from '@/pages/Onboarding';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { AdminUsers } from '@/pages/admin/Users';
import { AdminJobs } from '@/pages/admin/Jobs';
import { TRPCProvider } from '@/lib/trpc-client.tsx';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function AppContent() {
  const [location] = useLocation();
  const showHeader = !['/login', '/signup', '/onboarding'].includes(location);

  return (
    <div className="min-h-screen">
      {showHeader && location !== '/' && <Header />}
      <Switch>
        {/* Landing Page (Pública) */}
        <Route path="/" component={Home} />

        {/* Auth Pages (Públicas) */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        {/* Onboarding (Protegida - sem onboarding completo) */}
        <Route path="/onboarding">
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        </Route>

        {/* Dashboard (Protegida - requer login e onboarding) */}
        <Route path="/dashboard">
          <ProtectedRoute requireOnboarding={true}>
            <Dashboard />
          </ProtectedRoute>
        </Route>

        {/* Rotas Protegidas */}
        <Route path="/profile">
          <ProtectedRoute requireOnboarding={true}>
            <Profile />
          </ProtectedRoute>
        </Route>
        <Route path="/settings">
          <ProtectedRoute requireOnboarding={true}>
            <Settings />
          </ProtectedRoute>
        </Route>
        <Route path="/education">
          <ProtectedRoute requireOnboarding={true}>
            <Education />
          </ProtectedRoute>
        </Route>
        <Route path="/my-retention-videos">
          <ProtectedRoute requireOnboarding={true}>
            <MyRetentionVideos />
          </ProtectedRoute>
        </Route>
        <Route path="/jobs/:id">
          <ProtectedRoute requireOnboarding={true}>
            <JobDetail />
          </ProtectedRoute>
        </Route>
        <Route path="/jobs">
          <ProtectedRoute requireOnboarding={true}>
            <JobsList />
          </ProtectedRoute>
        </Route>
        <Route path="/terms">
          <ProtectedRoute requireOnboarding={true}>
            <TermsOfUse />
          </ProtectedRoute>
        </Route>
        <Route path="/billing">
          <ProtectedRoute requireOnboarding={true}>
            <Billing />
          </ProtectedRoute>
        </Route>

        {/* Rotas Admin */}
        <Route path="/admin/users">
          <ProtectedRoute requireOnboarding={true} requireAdmin={true}>
            <AdminUsers />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/jobs">
          <ProtectedRoute requireOnboarding={true} requireAdmin={true}>
            <AdminJobs />
          </ProtectedRoute>
        </Route>
        <Route path="/admin">
          <ProtectedRoute requireOnboarding={true} requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>

        {/* 404 */}
        <Route>
          <div className="container mx-auto py-16 px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">404 - Página não encontrada</h1>
            <a href="/" className="text-indigo-600 hover:underline">
              Voltar para a página inicial
            </a>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <TRPCProvider>
        <Toaster position="top-right" />
        <Router>
          <AppContent />
        </Router>
      </TRPCProvider>
    </ThemeProvider>
  );
}

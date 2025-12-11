import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import InstallPrompt from './components/InstallPrompt';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import DashboardPage from './pages/DashboardPage';
import LearnPage from './pages/LearnPage';
import IrregularVerbsPage from './pages/IrregularVerbsPage';
import PhrasalVerbsPage from './pages/PhrasalVerbsPage';
import StativeVerbsPage from './pages/StativeVerbsPage';
import VerbPatternsPage from './pages/VerbPatternsPage';
import PracticePage from './pages/PracticePage';
import AuthPage from './pages/AuthPage';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

  // Pages that require login
  const protectedPages = ['dashboard', 'favorites', 'learn', 'practice'];

  useEffect(() => {
    // Redirect to auth if trying to access protected page while logged out
    if (!loading && !user && protectedPages.includes(currentPage)) {
      setCurrentPage('auth');
    }
  }, [currentPage, user, loading]);

  function renderPage() {
    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'auth':
        return <AuthPage onNavigate={setCurrentPage} />;
      case 'search':
        return <SearchPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'learn':
        return <LearnPage />;
      case 'irregular':
        return <IrregularVerbsPage />;
      case 'phrasal':
        return <PhrasalVerbsPage />;
      case 'stative':
        return <StativeVerbsPage />;
      case 'patterns':
        return <VerbPatternsPage />;
      case 'practice':
        return <PracticePage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  }

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
      <InstallPrompt />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

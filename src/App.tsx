import { useState } from 'react';
import Layout from './components/Layout';
import InstallPrompt from './components/InstallPrompt';
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
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  function renderPage() {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
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
    <ErrorBoundary>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
      <InstallPrompt />
    </ErrorBoundary>
  );
}

export default App;

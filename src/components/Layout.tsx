import { BookOpen, Brain, List, Sparkles, Home, Trophy, Menu, X, GraduationCap, Search, Star, Map, LogOut, User as UserIcon } from 'lucide-react';
import { useState, ReactNode } from 'react';
import InstallPrompt from './InstallPrompt';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'milestones', label: 'Map', icon: Map },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'favorites', label: 'Favorites', icon: Star },
    // { id: 'dashboard', label: 'Stats', icon: BarChart3 }, // Stats might be redundant with Map now
  ];

  const menuItems = [
    { id: 'irregular', label: 'Irregular Verbs', icon: List },
    { id: 'phrasal', label: 'Phrasal Verbs', icon: BookOpen },
    { id: 'stative', label: 'Stative Verbs', icon: Sparkles },
    { id: 'patterns', label: 'Verb Patterns', icon: Brain },
    { id: 'practice', label: 'Practice Quiz', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="text-green-600" size={24} />
            <h1 className="text-lg font-bold text-gray-800">EnglishVerbs</h1>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">More Options</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon size={22} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              <div className="border-t border-gray-100 my-2 pt-2">
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all text-red-600 hover:bg-red-50"
                >
                  <LogOut size={22} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </>
      )}

      <main className="pb-24 md:pb-8 pt-16 md:pt-0 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom">
        <div className="grid grid-cols-5 gap-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-all ${isActive
                  ? 'text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Icon size={24} className={isActive ? 'stroke-2' : ''} />
                <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <aside className="hidden md:block fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-green-600" size={28} />
            EnglishVerbs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Master English Verbs</p>
        </div>

        <nav className="p-4 space-y-2">
          {[...bottomNavItems, ...menuItems].map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          {user && (
            <div className="flex items-center gap-3 p-2 mb-2 rounded-lg bg-white border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                <UserIcon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="hidden md:block md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      <InstallPrompt />
    </div>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, Home, Plus, Info, LogOut, User, LogIn, Sigma } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const publicNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/about', icon: Info, label: 'About' },
  ];

  const adminNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: Plus, label: 'Dashboard' },
    { path: '/about', icon: Info, label: 'About' },
  ];

  const navItems = isAuthenticated ? adminNavItems : publicNavItems;

  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  return (
    <header className="relative z-10 mb-8">
      <nav className="glass-card p-4 mx-4 mt-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-white hover:text-blue-200 transition-colors group"
          >
            <div className="relative">
              <Sigma size={32} className="text-blue-300 group-hover:text-blue-200 transition-colors" />
              <Calculator size={18} className="absolute -bottom-1 -right-1 text-purple-300 group-hover:text-purple-200 transition-colors" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              EG Math Hub
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
            
            {/* Login Button - Only show if not authenticated */}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <LogIn size={18} />
                <span className="font-medium">Login</span>
              </Link>
            )}
            
            {/* Logout Button - Only show if authenticated */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <div className="flex items-center space-x-1 text-white/80">
                <User size={16} />
                <span className="text-sm">Admin</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-20">
        <div className="glass-card p-2">
          <div className="flex justify-around">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            ))}
            
            {/* Mobile Login/Logout */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="flex flex-col items-center p-2 rounded-lg text-white/70 hover:text-white transition-all duration-300"
              >
                <LogIn size={20} />
                <span className="text-xs mt-1">Login</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center p-2 rounded-lg text-white/70 hover:text-white transition-all duration-300"
              >
                <LogOut size={20} />
                <span className="text-xs mt-1">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import { Link, useLocation } from 'react-router-dom';
import { Home, Truck } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
              aria-label="Go to home page"
            >
              AI Platform
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                aria-label="Home page"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/buttons"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/buttons' 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                aria-label="Freight quote page"
              >
                <Truck className="h-4 w-4" />
                <span>Freight Quote</span>
              </Link>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/"
              className={`p-2 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Home page"
            >
              <Home className="h-5 w-5" />
            </Link>
            <Link
              to="/buttons"
              className={`p-2 rounded-lg transition-colors ${
                location.pathname === '/buttons' 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Freight quote page"
            >
              <Truck className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Heart, LayoutDashboard, LogOut, Menu, X,
  User, ChevronDown, Search, GitCompareArrows
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary-100 text-primary-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">
                Info<span className="text-primary-600">kost</span>
              </span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-1 font-medium">Bengkulu</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/cari" className={navLinkClass('/cari')}>
              <Search className="w-4 h-4" />
              Cari Kost
            </Link>
            <Link to="/compare" className={navLinkClass('/compare')}>
              <GitCompareArrows className="w-4 h-4" />
              Bandingkan
            </Link>
            {user && (
              <Link to="/wishlist" className={navLinkClass('/wishlist')}>
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className={navLinkClass('/admin')}>
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.nama.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.nama}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-premium border border-gray-100 py-2 z-50 animate-scale-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.nama}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="badge-blue mt-1">{user.role}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm !px-5 !py-2"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in border-t border-gray-100 mt-2 pt-3">
            <div className="flex flex-col gap-1">
              <Link to="/cari" className={navLinkClass('/cari')}>
                <Search className="w-4 h-4" />
                Cari Kost
              </Link>
              <Link to="/compare" className={navLinkClass('/compare')}>
                <GitCompareArrows className="w-4 h-4" />
                Bandingkan
              </Link>
              {user && (
                <>
                  <Link to="/wishlist" className={navLinkClass('/wishlist')}>
                    <Heart className="w-4 h-4" />
                    Wishlist
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className={navLinkClass('/admin')}>
                      <LayoutDashboard className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <hr className="my-2 border-gray-100" />
                  <div className="px-3 py-2 flex items-center gap-2">
                    <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user.nama.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{user.nama}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              )}
              {!user && (
                <>
                  <hr className="my-2 border-gray-100" />
                  <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg">
                    Masuk
                  </Link>
                  <Link to="/register" className="btn-primary text-sm text-center">
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
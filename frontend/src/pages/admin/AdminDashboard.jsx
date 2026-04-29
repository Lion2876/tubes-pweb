import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Users, Star, Menu, X, ChevronRight, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const AdminDashboard = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalKost: 0, totalUsers: 0, totalReviews: 0, totalWishlists: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch { /* silent */ }
    };
    fetchStats();
  }, [location]);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location]);

  const menuItems = [
    { path: '/admin/kost', label: 'Kelola Kost', icon: Home, count: stats.totalKost },
    { path: '/admin/user', label: 'Kelola User', icon: Users, count: stats.totalUsers },
    { path: '/admin/review', label: 'Kelola Review', icon: Star, count: stats.totalReviews },
  ];

  const isActive = (path) => location.pathname === path || (path === '/admin/kost' && location.pathname === '/admin');

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">Admin Panel</p>
                  <p className="text-xs text-gray-400">Infokost Bengkulu</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    active ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5" />
                    {item.label}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    active ? 'bg-white/20' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{user?.nama?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.nama}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-primary-600 transition-colors">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-medium text-gray-700">Admin</span>
            </div>
          </div>
          <Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" /> Kembali ke Website
          </Link>
        </div>

        {/* Stats cards */}
        <div className="px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Kost', value: stats.totalKost, icon: Home, color: 'primary' },
              { label: 'Total User', value: stats.totalUsers, icon: Users, color: 'accent' },
              { label: 'Total Review', value: stats.totalReviews, icon: Star, color: 'amber' },
              { label: 'Total Wishlist', value: stats.totalWishlists, icon: BarChart3, color: 'purple' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              const colorMap = {
                primary: 'bg-primary-100 text-primary-600',
                accent: 'bg-emerald-100 text-emerald-600',
                amber: 'bg-amber-100 text-amber-600',
                purple: 'bg-purple-100 text-purple-600',
              };
              return (
                <div key={i} className="card-premium p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Outlet for nested routes */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DetailKost from './pages/DetailKost';
import WishlistPage from './pages/WishlistPage';
import ComparePage from './pages/ComparePage';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageKost from './pages/admin/ManageKost';
import ManageUser from './pages/admin/ManageUser';
import ManageReview from './pages/admin/ManageReview';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cari" element={<SearchPage />} />
        <Route path="/kost/:id" element={<DetailKost />} />
        <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
        <Route path="/compare" element={<ComparePage />} />
        {/* Admin routes */}
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>}>
          <Route index element={<ManageKost />} />
          <Route path="kost" element={<ManageKost />} />
          <Route path="user" element={<ManageUser />} />
          <Route path="review" element={<ManageReview />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
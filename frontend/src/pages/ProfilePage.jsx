import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  User, Lock, Star, Pencil, Save, Trash2, Eye, EyeOff,
  Shield, MessageSquare, ChevronRight, Home, AlertCircle
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profil');

  // Profile form
  const [nama, setNama] = useState(user?.nama || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'ulasan') fetchReviews();
  }, [activeTab]);

  const fetchReviews = async () => {
    setReviewLoading(true);
    try {
      const { data } = await API.get('/review/user/me');
      setReviews(data);
    } catch {
      toast.error('Gagal memuat ulasan');
    }
    setReviewLoading(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!nama.trim() || !email.trim()) {
      toast.error('Nama dan email tidak boleh kosong');
      return;
    }
    setProfileLoading(true);
    try {
      await API.put('/auth/profile', { nama: nama.trim(), email: email.trim() });
      updateUser({ nama: nama.trim(), email: email.trim() });
      toast.success('Profil berhasil diperbarui! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil');
    }
    setProfileLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordBaru.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }
    if (passwordBaru !== konfirmasiPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }
    setPasswordLoading(true);
    try {
      await API.put('/auth/change-password', { passwordLama, passwordBaru });
      toast.success('Password berhasil diubah! 🔒');
      setPasswordLama('');
      setPasswordBaru('');
      setKonfirmasiPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah password');
    }
    setPasswordLoading(false);
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Yakin ingin menghapus ulasan ini?')) return;
    try {
      await API.delete(`/review/user/${id}`);
      toast.success('Ulasan berhasil dihapus');
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus ulasan');
    }
  };

  const tabs = [
    { id: 'profil', label: 'Profil Saya', icon: User },
    { id: 'keamanan', label: 'Keamanan', icon: Shield },
    { id: 'ulasan', label: 'Ulasan Saya', icon: MessageSquare },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-primary-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium">Profil</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header Card */}
        <div className="card-premium p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">{user?.nama?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user?.nama}</h1>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="badge-blue mt-1">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="card-premium p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Tab: Profil */}
            {activeTab === 'profil' && (
              <div className="card-premium p-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Pencil className="w-4.5 h-4.5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Edit Profil</h2>
                    <p className="text-xs text-gray-400">Perbarui informasi akun Anda</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="text"
                        className="input-modern !pl-11"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <div className="relative group">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="email"
                        className="input-modern !pl-11"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="btn-primary flex items-center justify-center gap-2 !mt-6"
                  >
                    {profileLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Save className="w-4 h-4" /> Simpan Perubahan</>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Keamanan */}
            {activeTab === 'keamanan' && (
              <div className="card-premium p-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Lock className="w-4.5 h-4.5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Ganti Password</h2>
                    <p className="text-xs text-gray-400">Pastikan password baru Anda kuat dan mudah diingat</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Lama</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type={showOld ? 'text' : 'password'}
                        className="input-modern !pl-11 !pr-11"
                        placeholder="Masukkan password lama"
                        value={passwordLama}
                        onChange={(e) => setPasswordLama(e.target.value)}
                        required
                      />
                      <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Baru</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type={showNew ? 'text' : 'password'}
                        className="input-modern !pl-11 !pr-11"
                        placeholder="Minimal 6 karakter"
                        value={passwordBaru}
                        onChange={(e) => setPasswordBaru(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className="input-modern !pl-11 !pr-11"
                        placeholder="Ulangi password baru"
                        value={konfirmasiPassword}
                        onChange={(e) => setKonfirmasiPassword(e.target.value)}
                        required
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordBaru && konfirmasiPassword && passwordBaru !== konfirmasiPassword && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Password tidak cocok
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="btn-primary flex items-center justify-center gap-2 !mt-6"
                  >
                    {passwordLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Shield className="w-4 h-4" /> Ubah Password</>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Ulasan */}
            {activeTab === 'ulasan' && (
              <div className="animate-fade-in space-y-4">
                <div className="card-premium p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Star className="w-4.5 h-4.5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">Ulasan Saya</h2>
                      <p className="text-xs text-gray-400">Kelola semua ulasan yang Anda berikan</p>
                    </div>
                  </div>
                </div>

                {reviewLoading ? (
                  <div className="card-premium p-10 text-center">
                    <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-400 mt-3">Memuat ulasan...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="card-premium p-10 text-center">
                    <Star className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Belum ada ulasan</p>
                    <p className="text-xs text-gray-400 mt-1">Anda belum memberikan ulasan pada kost manapun</p>
                    <Link to="/cari" className="btn-primary inline-flex items-center gap-2 mt-4 text-sm">
                      <Home className="w-4 h-4" /> Cari Kost
                    </Link>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="card-premium p-5 group hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <Link to={`/kost/${rev.kost_id}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                            {rev.kost_nama}
                          </Link>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${star <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(rev.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{rev.komentar}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          title="Hapus ulasan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
